import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";

export default function CoachView() {
    const { cityId, gymId } = useParams();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [coach, setCoach] = useState({
        name: "",
        surname: "",
        specialty: "",
        is_approved: false, // Updated to match the model
    });

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setError(null);

        const formData = new FormData();

        formData.append("name", coach.name);
        formData.append("surname", coach.surname);
        formData.append("specialty", coach.specialty);
        formData.append("is_approved", coach.is_approved); // Add is_approved field
        formData.append("gym_id", gymId); // Ensure gymId is included in the request

        try {
            await axiosClient.post(`/cities/${cityId}/gyms/${gymId}/coaches/`, formData);
            navigate(`/cities/${cityId}/gyms/${gymId}/coaches/`);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Error creating coach');
            } else if (error.request) {
                setError('No response from server. Check your network or backend server.');
            } else {
                setError('Unexpected error occurred. Please try again.');
            }
            console.error('Error:', error);
        }
    };

    return (
        <PageComponent title="Create new Coach">
            <form action="#" method="POST" onSubmit={onSubmit}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {/* Name */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="name" className="pl-1 block text-sm font-medium text-gray-700">
                                Coach Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={coach.name}
                                onChange={(ev) => setCoach({ ...coach, name: ev.target.value })}
                                placeholder="Coach Name"
                                maxLength={35}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <div className="pl-1 text-sm text-gray-500">{coach.name.length}/35</div>
                        </div>

                        {/* Surname */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="surname" className="pl-1 block text-sm font-medium text-gray-700">
                                Coach Surname
                            </label>
                            <input
                                type="text"
                                name="surname"
                                id="surname"
                                value={coach.surname}
                                onChange={(ev) => setCoach({ ...coach, surname: ev.target.value })}
                                placeholder="Coach Surname"
                                maxLength={35}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <div className="pl-1 text-sm text-gray-500">{coach.surname.length}/35</div>
                        </div>

                        {/* Specialty */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="specialty" className="pl-1 block text-sm font-medium text-gray-700">
                                Specialty
                            </label>
                            <textarea
                                name="specialty"
                                id="specialty"
                                value={coach.specialty}
                                onChange={(ev) => {
                                    // Prevent further input if the length exceeds 50 characters
                                    if (ev.target.value.length <= 15) {
                                        setCoach({ ...coach, specialty: ev.target.value });
                                    }
                                }}
                                placeholder="Describe your specialty"
                                maxLength={15}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            ></textarea>
                            <div className="pl-1 text-sm text-gray-500">{coach.specialty.length}/15</div>
                        </div>

                        {/* Approval Status */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="is_approved" className="pl-1 block text-sm font-medium text-gray-700">
                                Is Approved
                            </label>
                            <input
                                type="checkbox"
                                name="is_approved"
                                id="is_approved"
                                checked={coach.is_approved}
                                onChange={(ev) => setCoach({ ...coach, is_approved: ev.target.checked })}
                                className="ml-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <TButton>Save</TButton>
                    </div>
                </div>
            </form>
        </PageComponent>
    );
}
