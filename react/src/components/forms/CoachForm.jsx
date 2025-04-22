import { useEffect, useState } from "react";
import Select from "react-select";
import TButton from "../core/TButton";
import axiosClient from "../../axios";
import LoadingDialog from "../core/LoadingDialog";

export default function CoachForm({ onSubmit, initialData = {}, submitText = "Save" }) {
    const [cities, setCities] = useState([]);
    const [gyms, setGyms] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [allSpecialties, setAllSpecialties] = useState([]);
    const [error, setError] = useState({ __html: "" });
    const [gymLoading, setGymLoading] = useState(false);

    const [coach, setCoach] = useState({
        name: "",
        surname: "",
        is_approved: false,
        gym_id: "",
        specialties: [],
    });

    useEffect(() => {
        axiosClient.get("/cities").then(({ data }) => setCities(data));
        axiosClient.get("/specialties").then(({ data }) => {
            const formatted = (Array.isArray(data) ? data : data.data).map((s) => ({
                value: s.id,
                label: s.name,
            }));
            setAllSpecialties(formatted);
        });
    }, []);

    useEffect(() => {
        if (initialData.name) {
            setCoach({
                name: initialData.name || "",
                surname: initialData.surname || "",
                is_approved: initialData.isApproved || false,
                gym_id: initialData.gymId || "", // match CoachResource
                specialties: initialData.specialties?.map((s) => ({
                    value: s.id,
                    label: s.name,
                })) || [],
            });

            if (initialData.gym?.city_id) {
                setSelectedCity(initialData.gym.city_id);
            }
        }
    }, [initialData]);

    useEffect(() => {
        if (selectedCity) {
            setGymLoading(true);
            axiosClient.get(`/cities/${selectedCity}/gyms`)
                .then(({ data }) => {
                    setGyms(data);
                    if (initialData.gymId) {
                        setCoach((prev) => ({ ...prev, gym_id: String(initialData.gymId) }));
                    }
                })
                .finally(() => setGymLoading(false));
        } else {
            setGyms([]);
        }
    }, [selectedCity, initialData.gymId]);

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setError({ __html: "" });

        const payload = {
            ...coach,
            specialties: coach.specialties.map((s) => s.value),
            gym_id: coach.gym_id || null,
        };

        onSubmit(payload).catch((err) => {
            if (err.response?.status === 422) {
                const msgs = Object.values(err.response.data.errors).flat();
                setError({ __html: msgs.join("<br>") });
            } else {
                setError({ __html: err.response?.data?.message || "Something went wrong" });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    {error.__html && (
                        <div
                            className="bg-red-100 text-red-800 border border-red-400 rounded px-4 py-2 mb-4"
                            dangerouslySetInnerHTML={error}
                        />
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Coach Name</label>
                        <input
                            type="text"
                            value={coach.name}
                            onChange={(e) => setCoach({ ...coach, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            required
                        />
                    </div>

                    {/* Surname */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Coach Surname</label>
                        <input
                            type="text"
                            value={coach.surname}
                            onChange={(e) => setCoach({ ...coach, surname: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            required
                        />
                    </div>

                    {/* Specialties */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                        <Select
                            isMulti
                            name="specialties"
                            options={allSpecialties}
                            value={coach.specialties}
                            onChange={(selected) => setCoach({ ...coach, specialties: selected })}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select specialties"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select City</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.target.value);
                                setCoach({ ...coach, gym_id: "" });
                            }}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                        >
                            <option value="">-- Select a City --</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Gym */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign Gym (optional)</label>
                        {gymLoading ? (
                            <div className="h-10 flex items-center">
                                <LoadingDialog />
                            </div>
                        ) : (
                            <select
                                value={String(coach.gym_id || "")}
                                onChange={(e) => setCoach({ ...coach, gym_id: e.target.value || null })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                disabled={!selectedCity}
                            >
                                <option value="">Independent (No Gym)</option>
                                {gyms.map((gym) => (
                                    <option key={gym.id} value={gym.id}>
                                        {gym.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Approved */}
                    <div>
                        <label className="inline-flex items-center text-sm">
                            <input
                                type="checkbox"
                                checked={coach.is_approved}
                                onChange={(e) =>
                                    setCoach({ ...coach, is_approved: e.target.checked })
                                }
                                className="form-checkbox"
                            />
                            <span className="ml-2">Is Approved</span>
                        </label>
                    </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <TButton type="submit">{submitText}</TButton>
                </div>
            </div>
        </form>
    );
}