import { LinkIcon, PhotoIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from 'react';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";
import { useParams, useNavigate } from 'react-router-dom';

import { geocodeAddress } from '../utils/geocoding';
import Select from 'react-select';

export default function GymView() {
    const { cityId } = useParams();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);

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
        isFree: false,
        monthlyFee: "",
        questions: [],
        specialties: [],
    });
    const [allSpecialties, setAllSpecialties] = useState([]);
    const [cityName, setCityName] = useState("");
    const [loadingCity, setLoadingCity] = useState(true);
    useEffect(() => {
        axiosClient.get('/specialties')
            .then(({ data }) => {
                const items = Array.isArray(data) ? data : data.data;
                const formatted = items.map((s) => ({ value: s.id, label: s.name }));
                setAllSpecialties(formatted);
            })
            .catch((error) => {
                console.error("Failed to load specialties", error);
            });
    }, []);
    useEffect(() => {
        setLoadingCity(true);
        axiosClient.get(`/cities/${cityId}`)
            .then(({ data }) => {
                setCityName(data.name);
            })
            .catch((error) => {
                console.error("Failed to load city", error);
            })
            .finally(() => {
                setLoadingCity(false);
            });
    }, [cityId]);


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
        gym.specialties.forEach((spec) => {
            formData.append('specialties[]', spec.value);
        });
        const openingHours = `${gym.openingHoursStart} - ${gym.openingHoursEnd}`;
        formData.append("opening_hours", openingHours);
        formData.append("is_free", gym.isFree ? 1 : 0);
        formData.append("monthly_fee", gym.isFree ? '' : gym.monthlyFee);
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
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setError(
                    error.response?.data?.message ||
                    "An error occurred while creating the gym."
                );
            }
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
        <PageComponent title={loadingCity ? "Loading..." : `Create new Gym in ${cityName}`} buttons={
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
                <TButton
                    to={`/cities/${cityId}/gyms/`}
                    className="flex items-center justify-center w-full sm:w-auto"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to City
                </TButton>

            </div>
        }>
            <form action="#" method="POST" onSubmit={onSubmit}>
                {error && (
                    <div className="bg-red-100 text-red-800 border border-red-400 rounded px-4 py-2 mb-4">
                        {error}
                    </div>
                )}
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
                                    Enter an image URL
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
                                    Or Upload an Image
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
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>
                            )}
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
                            {errors.description && (
                                <p className="text-sm text-red-600 mt-1">{errors.description[0]}</p>
                            )}
                        </div>
                        {/* Specialties Multi-Select */}
                        <div className="col-span-6 sm:col-span-3">
                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialties
                                </label>
                                <Select
                                    isMulti
                                    name="specialties"
                                    options={allSpecialties}
                                    value={gym.specialties}
                                    onChange={(selected) => setGym({ ...gym, specialties: selected })}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Select specialties"
                                />
                            </div>
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
                                maxLength={70}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <div className="text-sm text-gray-500 pl-1">{gym.address.length}/70</div>
                            {errors.address && (
                                <p className="text-sm text-red-600 mt-1">{errors.address[0]}</p>
                            )}
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
                            {errors.opening_hours && (
                                <p className="text-sm text-red-600 mt-1">{errors.opening_hours[0]}</p>
                            )}
                        </div>
                        {/* Pricing Section */}
                        <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Is this gym free to access?
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={gym.isFree}
                                        onChange={(e) => setGym({ ...gym, isFree: e.target.checked, monthlyFee: "" })}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Yes, it's free</span>
                                </label>
                            </div>
                        </div>

                        {!gym.isFree && (
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="monthlyFee"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Monthly Subscription Fee (€)
                                </label>
                                <input
                                    type="number"
                                    name="monthlyFee"
                                    id="monthlyFee"
                                    value={gym.monthlyFee}
                                    min="0"
                                    step="0.01"
                                    onChange={(e) => setGym({ ...gym, monthlyFee: e.target.value })}
                                    placeholder="e.g. 29.99"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                        )}
                        {errors.monthly_fee && (
                            <p className="text-sm text-red-600 mt-1">{errors.monthly_fee[0]}</p>
                        )}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <TButton>Save</TButton>
                    </div>
                </div>
            </form>
        </PageComponent>
    );
}
