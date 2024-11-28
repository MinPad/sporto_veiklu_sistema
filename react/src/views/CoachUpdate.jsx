import { useState, useEffect } from 'react';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";
import { useParams, useNavigate } from 'react-router-dom';
import LoadingDialog from "../components/core/LoadingDialog";

export default function CoachUpdate() {
    const { cityId, coachId, gymId } = useParams(); // Extract cityId and coachId from URL params

    const [coach, setCoach] = useState({}); // Set coach to an empty object initially to avoid null errors
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [approved, setApproved] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // console.log('coachId', coachId);
        axiosClient.get(`/cities/${cityId}/gyms/${gymId}/coaches/${coachId}`)
            .then(({ data }) => {
                setCoach(data);
                setName(data.name);
                setSurname(data.surname);
                setSpecialty(data.specialty);
                setApproved(data.approved);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching coach:", err);
                setError("Error fetching coach details");
                setLoading(false);
            });
    }, [cityId, coachId]);

    const onSubmit = async (ev) => {
        ev.preventDefault();

        const updatedCoach = {
            name,
            surname,
            specialty,
            approved,
        };

        // console.log("Updated Coach:", updatedCoach);

        axiosClient.put(`/cities/${cityId}/gyms/${gymId}/coaches/${coachId}`, updatedCoach)
            .then(() => {
                navigate(`/cities/${cityId}/gyms/${gymId}/coaches/`); // Navigate after successful update
            })
            .catch((err) => {
                console.error("Error updating coach:", err);
                setError("Error updating coach");
            });
    };

    if (error) return <div>{error}</div>;

    return (
        <PageComponent title="Update Coach">
            {loading && <LoadingDialog />}
            {!loading && (
                <form onSubmit={onSubmit}>
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                            {/* Coach Name */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Coach Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name} // Use name state
                                    onChange={(e) => setName(e.target.value)} // Update name directly
                                    placeholder="Coach Name"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            {/* Coach Surname */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                                    Coach Surname
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    placeholder="Coach Surname"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            {/* Specialty */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                                    Specialty
                                </label>
                                <textarea
                                    id="specialty"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    placeholder="Describe your specialty"
                                    maxLength={150}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                ></textarea>
                                {/* <div className="pl-1 text-sm text-gray-500">{coach.description.length}/150</div> */}
                            </div>

                            {/* Approoved */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="is_approved" className="pl-1 block text-sm font-medium text-gray-700">
                                    Is Approved
                                </label>
                                <input
                                    type="checkbox"
                                    name="is_approved"
                                    id="is_approved"
                                    checked={!approved}
                                    onChange={(ev) => setApproved(ev.target.checked)}
                                    className="ml-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                            </div>

                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <TButton>Save</TButton>
                        </div>
                    </div>
                </form>
            )}
        </PageComponent>
    );
}
