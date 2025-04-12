import { LinkIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";
import { useParams, useNavigate } from 'react-router-dom';

import { geocodeAddress } from '../utils/geocoding';

export default function GymView() {
    const { cityId } = useParams();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [gym, setGym] = useState({
        name: "",
        slug: "",
        status: false,
        description: "",
        image: null,
        image_URL: null,
        address: "",
        openingHoursStart: "",
        openingHoursEnd: "",
        opening_hours: "",
        // latitude: "",
        // longitude: "",
        questions: [],
    });

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setError(null);

        const formData = new FormData();


        if (gym.image) {
            formData.append("image", gym.image);
        } else if (gym.image_URL) {
            formData.append("image_url", gym.image_URL);
        }

        // Append other gym data
        formData.append("name", gym.name);
        formData.append("description", gym.description);
        formData.append("address", gym.address);
        // formData.append("latitude", gym.latitude);
        // formData.append("longitude", gym.longitude);
        const openingHours = `${gym.openingHoursStart} - ${gym.openingHoursEnd}`;
        formData.append("opening_hours", openingHours);

        const coords = await geocodeAddress(gym.address);
        if (coords) {
            formData.append("latitude", coords.latitude);
            formData.append("longitude", coords.longitude);
        } else {
            setError("Failed to determine location from address. Please check the address.");
            return;
        }
        try {
            await axiosClient.post(`/cities/${cityId}/gyms`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate(`/cities/${cityId}/gyms`);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "An error occurred while creating the gym."
            );
            console.error(error);
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setGym({ ...gym, image: file, image_URL: "" });
    };

    const handleImageUrlChange = (e) => {
        setGym({ ...gym, image_URL: e.target.value, image: null });
    };

    return (
        <PageComponent title="Create new Gym">
            <form action="#" method="POST" onSubmit={onSubmit}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Photo</label>
                            <div className="mt-1 flex items-center">
                                {/* Show local image preview if uploaded */}
                                {gym.image && (
                                    <img
                                        src={URL.createObjectURL(gym.image)}
                                        alt="Gym"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                )}

                                {/* Show image preview if URL is entered */}
                                {!gym.image && gym.image_URL && (
                                    <img
                                        src={gym.image_URL}
                                        alt="Gym"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                )}

                                {/* Default icon when no image or URL */}
                                {!gym.image && !gym.image_URL && (
                                    <span className="flex justify-center items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                        <PhotoIcon className="w-8 h-8" />
                                    </span>
                                )}
                            </div>

                            {/* Image URL input */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Or enter an image URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="Enter an image URL"
                                    value={gym.image_URL || ''}
                                    onChange={handleImageUrlChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            {/* Upload image file input */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                                You can upload a gym image or enter an image URL above. If both are provided, the uploaded file will be used.
                            </p>
                        </div>

                        {/* Title */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Gym Title
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={gym.name}
                                onChange={(ev) =>
                                    setGym({ ...gym, name: ev.target.value })
                                }
                                placeholder="Gym Title"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Description */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={gym.description}
                                onChange={(ev) =>
                                    setGym({ ...gym, description: ev.target.value })
                                }
                                placeholder="Describe your gym"
                                maxLength={150}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            ></textarea>
                            <div className="pl-1 text-sm text-gray-500">{gym.description.length}/150</div>
                        </div>
                        {/* Address */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={gym.address}
                                onChange={(ev) =>
                                    setGym({ ...gym, address: ev.target.value })
                                }
                                placeholder="Gym address"
                                maxLength={50}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <div className="text-sm text-gray-500 pl-1">{gym.address.length}/50</div>
                        </div>
                        {/* Latitude */}
                        {/* <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                                Latitude
                            </label>
                            <input
                                type="number"
                                name="latitude"
                                id="latitude"
                                value={gym.latitude}
                                step="any"
                                onChange={(e) => setGym({ ...gym, latitude: e.target.value })}
                                placeholder="54.6872"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div> */}

                        {/* Longitude */}
                        {/* <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                                Longitude
                            </label>
                            <input
                                type="number"
                                name="longitude"
                                id="longitude"
                                value={gym.longitude}
                                step="any"
                                onChange={(e) => setGym({ ...gym, longitude: e.target.value })}
                                placeholder="25.2797"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div> */}
                        {/* Opening Hours */}
                        <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Opening Hours
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="time"
                                    name="openingHoursStart"
                                    id="openingHoursStart"
                                    value={gym.openingHoursStart}
                                    onChange={(ev) => setGym({ ...gym, openingHoursStart: ev.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <span className="self-center text-gray-500">-</span>
                                <input
                                    type="time"
                                    name="openingHoursEnd"
                                    id="openingHoursEnd"
                                    value={gym.openingHoursEnd}
                                    onChange={(ev) => setGym({ ...gym, openingHoursEnd: ev.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
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
