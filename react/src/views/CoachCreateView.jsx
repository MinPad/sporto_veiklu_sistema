import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";
import Select from 'react-select';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CoachView() {
    const { cityId, gymId } = useParams();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [allSpecialties, setAllSpecialties] = useState([]);
    const [coach, setCoach] = useState({
        name: "",
        surname: "",
        specialties: [],
        is_approved: false,
    });

    useEffect(() => {
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
    const onSubmit = async (ev) => {
        ev.preventDefault();
        setErrors({});

        const payload = {
            name: coach.name,
            surname: coach.surname,
            is_approved: coach.is_approved,
            gym_id: gymId,
            specialties: coach.specialties ? coach.specialties.map(s => s.value) : [],
        };

        try {
            await axiosClient.post(`/cities/${cityId}/gyms/${gymId}/coaches`, payload);
            navigate(`/cities/${cityId}/gyms/${gymId}/coaches`);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const serverErrors = error.response.data.errors;
                setErrors(serverErrors);
            } else if (error.request) {
                setErrors({ general: ['No response from server. Please try again.'] });
            } else {
                setErrors({ general: ['Unexpected error occurred. Please try again.'] });
            }

            console.error("Error submitting form:", error);
        }
    };


    return (
        <PageComponent title="Create New Coach">
            <form action="#" method="POST" onSubmit={onSubmit}>
                <div className="shadow sm:overflow-visible sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {/* Name */}
                        {errors.general && (
                            <div className="bg-red-100 text-red-800 border border-red-300 rounded px-4 py-2">
                                {errors.general[0]}
                            </div>
                        )}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="name" className="pl-1 block text-sm font-medium text-gray-700">
                                Coach Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={coach.name}
                                onChange={(ev) => {
                                    setCoach({ ...coach, name: ev.target.value });

                                }}
                                placeholder="Coach Name"
                                maxLength={35}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <div className="pl-1 text-sm text-gray-500">{coach.name.length}/35</div>
                            {errors.name && (
                                <div className="text-sm text-red-600 mt-1">{errors.name[0]}</div>
                            )}

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
                                onChange={(ev) => {
                                    setCoach({ ...coach, surname: ev.target.value });
                                    setErrors(prev => ({ ...prev, name: null }));
                                }}
                                placeholder="Coach Surname"
                                maxLength={35}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <div className="pl-1 text-sm text-gray-500">{coach.surname.length}/35</div>
                            {errors.surname && (
                                <div className="text-sm text-red-600 mt-1">{errors.surname[0]}</div>
                            )}
                        </div>

                        {/* ✅ Multi-Select Specialties */}
                        <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specialties (multiple allowed)
                            </label>
                            <Select
                                isMulti
                                name="specialties"
                                options={allSpecialties}
                                value={coach.specialties}
                                onChange={(selected) => {
                                    setCoach({ ...coach, specialties: selected });
                                    setErrors(prev => ({ ...prev, name: null }));
                                }}
                                className="basic-multi-select w-full"
                                classNamePrefix="react-select"
                                placeholder="Select specialties"
                            />
                        </div>


                        {/* Approval Status
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
                        </div> */}
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded shadow text-sm font-medium"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back
                        </button>

                        <TButton type="submit">Save</TButton>
                    </div>
                </div>
            </form>
        </PageComponent>
    );
}
