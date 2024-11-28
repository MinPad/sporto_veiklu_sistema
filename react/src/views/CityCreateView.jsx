import { LinkIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";

export default function CityCreateView() {
    const [city, setCity] = useState({
        name: "",
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setError(null); // Clear previous errors

        try {
            await axiosClient.post('cities', city);

            navigate('/cities');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    const validationErrors = error.response.data.errors;
                    setError(validationErrors.name ? validationErrors.name[0] : 'Error creating city');
                } else {
                    setError(error.response.data.message || 'Error creating city');
                }
            } else {
                setError('Error creating city');
            }
            console.error('Error:', error);
        }
    };

    return (
        <PageComponent title="Create new City">
            <form action="#" method="POST" onSubmit={onSubmit}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {/* City Name */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                City Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={city.name}
                                onChange={(ev) =>
                                    setCity({ ...city, name: ev.target.value })
                                }
                                placeholder="City Name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Error Message */}
                        {error && (
                            <div className="text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <TButton type="submit">Save</TButton>
                    </div>
                </div>
            </form>
        </PageComponent>
    );
}