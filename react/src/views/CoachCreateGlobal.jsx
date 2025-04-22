import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";
import Select from 'react-select';

export default function CreateIndependentCoach() {
    const [cities, setCities] = useState([]);
    const [gyms, setGyms] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [error, setError] = useState({ __html: "" });
    const navigate = useNavigate();
    const [allSpecialties, setAllSpecialties] = useState([]);

    const [coach, setCoach] = useState({
        name: "",
        surname: "",
        is_approved: false,
        gym_id: "",
        specialties: [],
    });

    useEffect(() => {
        axiosClient.get('/cities')
            .then(({ data }) => setCities(data))
            .catch(err => console.error("Error loading cities:", err));

        axiosClient.get('/specialties')
            .then(({ data }) => {
                const formatted = (Array.isArray(data) ? data : data.data).map(s => ({
                    value: s.id,
                    label: s.name
                }));
                setAllSpecialties(formatted);
            })
            .catch((error) => {
                console.error("Failed to load specialties", error);
            });
    }, []);

    useEffect(() => {
        if (selectedCity) {
            axiosClient.get(`/cities/${selectedCity}/gyms`)
                .then(({ data }) => setGyms(data))
                .catch(err => console.error("Error loading gyms:", err));
        } else {
            setGyms([]);
        }
    }, [selectedCity]);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setError({ __html: "" });

        // console.log("Submitting coach:", coach);
        const payload = {
            ...coach,
            specialties: coach.specialties.map(s => s.value),
        };
        // console.log("Final payload sent to backend:", payload);

        try {
            await axiosClient.post('/coaches', payload);
            navigate('/coaches');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    const finalErrors = Object.values(error.response.data.errors || {}).reduce(
                        (accum, next) => [...accum, ...next],
                        []
                    );
                    setError({ __html: finalErrors.join("<br>") });
                } else {
                    setError({ __html: error.response.data.message || "Error creating coach" });
                }
            } else {
                setError({ __html: "Unexpected error occurred. Please try again." });
            }
        }
    };


    return (
        <PageComponent title="Create New Coach">
            <form onSubmit={onSubmit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {error.__html && (
                            <div
                                className="bg-red-100 text-red-800 border border-red-400 rounded px-4 py-2 mb-4"
                                dangerouslySetInnerHTML={error}
                            ></div>
                        )}
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

                        {/* ✅ Multi-Select Specialties */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specialties (multiple allowed)
                            </label>
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

                        {/* City Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select City</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setCoach({ ...coach, gym_id: "" }); // Reset gym when city changes
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            >
                                <option value="">-- Select a City --</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Gym Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assign Gym (optional)</label>
                            <select
                                value={coach.gym_id || ""}
                                onChange={(e) => setCoach({ ...coach, gym_id: e.target.value || null })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                disabled={!selectedCity}
                            >
                                <option value="">Independent (No Gym)</option>
                                {gyms.map(gym => (
                                    <option key={gym.id} value={gym.id}>{gym.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Approval checkbox */}
                        <div>
                            <label className="inline-flex items-center text-sm">
                                <input
                                    type="checkbox"
                                    checked={coach.is_approved}
                                    onChange={(e) => setCoach({ ...coach, is_approved: e.target.checked })}
                                    className="form-checkbox"
                                />
                                <span className="ml-2">Is Approved</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <TButton type="submit">Save</TButton>
                    </div>
                </div>
            </form>
        </PageComponent>
    );
}