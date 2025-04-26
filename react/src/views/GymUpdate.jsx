import { useState, useEffect } from 'react';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";
import { useParams, useNavigate } from 'react-router-dom';
import LoadingDialog from "../components/core/LoadingDialog";
import { geocodeAddress } from '../utils/geocoding';
import Select from 'react-select';
import { PhotoIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function GymUpdate() {
    const { cityId, gymId } = useParams();
    const [gym, setGym] = useState({});
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [image, setImage] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [openingStart, setOpeningStart] = useState('');
    const [openingEnd, setOpeningEnd] = useState('');

    // const [latitude, setLatitude] = useState('');
    // const [longitude, setLongitude] = useState('');

    const [specialties, setSpecialties] = useState([]);
    const [allSpecialties, setAllSpecialties] = useState([]);
    const [isFree, setIsFree] = useState(false);
    const [monthlyFee, setMonthlyFee] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gymRes, specRes] = await Promise.all([
                    axiosClient.get(`cities/${cityId}/gyms/${gymId}`),
                    axiosClient.get('/specialties')
                ]);

                const gymData = gymRes.data;
                const specList = Array.isArray(specRes.data) ? specRes.data : specRes.data.data;

                // Map all specialties
                const formattedSpecs = specList.map((s) => ({
                    value: s.id,
                    label: s.name,
                }));
                setAllSpecialties(formattedSpecs);

                // Set initial gym data
                setGym(gymData);
                setName(gymData.name);
                setAddress(gymData.address);
                setDescription(gymData.description);
                setImageUrl(gymData.image_url || '');
                const [start, end] = gymData.openingHours?.split(' - ') || ['', ''];
                setOpeningStart(start);
                setOpeningEnd(end);
                setIsFree(!!gymData.isFree);
                setMonthlyFee(gymData.monthlyFee || '');
                // Map preselected specialties to same shape as in Select
                const prefilled = (gymData.specialties || []).map(spec => ({
                    value: spec.id,
                    label: spec.name
                }));
                setSpecialties(prefilled);

                setLoading(false);
            } catch (err) {
                console.error("Error loading gym or specialties:", err);
                setError("Failed to load gym details");
                setLoading(false);
            }
        };

        fetchData();
    }, [cityId, gymId]);



    const onSubmit = async (ev) => {
        ev.preventDefault();
        if (!openingStart || !openingEnd) {
            setError("Please select both start and end opening hours.");
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('address', address);
        formData.append('description', description);
        specialties.forEach(spec => {
            formData.append('specialties[]', spec.value);
        });
        formData.append('opening_hours', `${openingStart} - ${openingEnd}`);
        formData.append("is_free", isFree ? 1 : 0);
        formData.append("monthly_fee", isFree ? '' : monthlyFee);
        const coords = await geocodeAddress(address);
        if (coords) {
            formData.append("latitude", coords.latitude);
            formData.append("longitude", coords.longitude);
        } else {
            setError("Failed to determine location from address. Please check the address.");
            return;
        }
        if (image) {
            formData.append('image', image);
        } else if (imageUrl) {
            formData.append('image_url', imageUrl);
        }

        try {
            await axiosClient.post(
                `cities/${cityId}/gyms/${gymId}?_method=PUT`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            navigate(`/cities/${cityId}/gyms/`);
        } catch (err) {
            console.error("Error updating gym:", err);

            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setError(err.response?.data?.message || "An error occurred while updating the gym.");
            }
        }
    };


    if (error) return <div>{error}</div>;

    return (
        <PageComponent title="Update Gym" buttons={
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
            {loading && <LoadingDialog />}
            {!loading && (
                <form onSubmit={onSubmit}>
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
                                    {gym.image_url && (
                                        <img
                                            src={gym.image_url}
                                            alt="Gym"
                                            className="w-32 h-32 object-cover"
                                        />
                                    )}
                                    {!gym.image_url && (
                                        <span className="flex justify-center items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                            <PhotoIcon className="w-8 h-8" />
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="url"
                                        placeholder="Or enter an image URL"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div className="mt-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>

                                <p className="text-sm text-gray-500 mt-1">
                                    You can upload a gym image or enter an image URL above. If both are provided, the uploaded file will be used.
                                </p>

                            </div>

                            {/* Gym Name */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Gym Title
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Gym Title"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your gym"
                                    maxLength={150}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                ></textarea>
                                <div className="pl-1 text-sm text-gray-500">{gym.description.length}/150</div>
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">{errors.description[0]}</p>
                                )}

                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialties
                                </label>
                                <Select
                                    isMulti
                                    name="specialties"
                                    options={allSpecialties}
                                    value={specialties}
                                    onChange={(selected) => setSpecialties(selected)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Select specialties"
                                />
                            </div>
                            {/* Address */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    value={address} // Use address state
                                    onChange={(e) => setAddress(e.target.value)} // Update address directly
                                    placeholder="Gym address"
                                    maxLength={50}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-600 mt-1">{errors.address[0]}</p>
                                )}

                            </div>
                            {/* Latitude
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    id="latitude"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    placeholder="e.g. 54.6872"
                                    step="any"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            {/* Longitude */}
                            {/* <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    id="longitude"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    placeholder="e.g. 25.2797"
                                    step="any"
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
                                        value={openingStart}
                                        onChange={(e) => setOpeningStart(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    <span className="self-center">-</span>
                                    <input
                                        type="time"
                                        value={openingEnd}
                                        onChange={(e) => setOpeningEnd(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.opening_hours && (
                                        <p className="text-sm text-red-600 mt-1">{errors.opening_hours[0]}</p>
                                    )}
                                </div>
                            </div>
                            {/* Is Free Checkbox */}
                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Is this gym free to access?
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isFree}
                                            onChange={(e) => {
                                                setIsFree(e.target.checked);
                                                if (e.target.checked) setMonthlyFee('');
                                            }}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Yes, it's free</span>
                                    </label>
                                </div>
                            </div>

                            {/* Monthly Fee Input */}
                            {!isFree && (
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="monthlyFee" className="block text-sm font-medium text-gray-700">
                                        Monthly Subscription Fee (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="monthlyFee"
                                        id="monthlyFee"
                                        value={monthlyFee}
                                        onChange={(e) => setMonthlyFee(e.target.value)}
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g. 29.99"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.monthly_fee && (
                                        <p className="text-sm text-red-600 mt-1">{errors.monthly_fee[0]}</p>
                                    )}
                                </div>
                            )}
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
