import { useState, useEffect } from 'react';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';
import axiosClient from "../axios";
import { useParams, useNavigate } from 'react-router-dom';
import LoadingDialog from "../components/core/LoadingDialog";

export default function GymUpdate() {
    const { cityId, gymId } = useParams(); // Extract cityId and gymId from URL params
    const [gym, setGym] = useState({}); // Set gym to an empty object initially to avoid null errors
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('useEffect fired');
        axiosClient.get(`cities/${cityId}/gyms/${gymId}`)
            .then(({ data }) => {
                setGym(data);
                setName(data.name);
                setAddress(data.address);
                setDescription(data.description);
                setOpeningHours(data.opening_hours);
                setImageUrl(data.image_url || '');
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching gym:", err);
                setError("Error fetching gym details");
                setLoading(false);
            });
    }, [cityId, gymId]);

    const onSubmit = async (ev) => {
        ev.preventDefault();

        const updatedGym = {
            name,
            address,
            description,
            opening_hours: openingHours,
            image_url: imageUrl,
        };

        console.log("Updated Gym:", updatedGym); // This should now show updated values

        axiosClient.put(`cities/${cityId}/gyms/${gymId}`, updatedGym)
            .then(() => {
                navigate(`/cities/${cityId}/gyms/`); // Navigate after successful update
            })
            .catch((err) => {
                console.error("Error updating gym:", err);
                setError("Error updating gym");
            });
    };

    if (error) return <div>{error}</div>;

    return (
        <PageComponent title="Update Gym">
            {loading && <LoadingDialog />}
            {!loading && (
                <form onSubmit={onSubmit}>
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
                                        value={imageUrl} // Use imageUrl state
                                        onChange={(e) => setImageUrl(e.target.value)} // Update imageUrl directly
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Gym Name */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Gym Title
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name} // Use name state
                                    onChange={(e) => setName(e.target.value)} // Update name directly
                                    placeholder="Gym Title"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            {/* Description */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description} // Use description state
                                    onChange={(e) => setDescription(e.target.value)} // Update description directly
                                    placeholder="Describe your gym"
                                    maxLength={150}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                ></textarea>
                                {/* <div className="pl-1 text-sm text-gray-500">{gym.description.length}/150</div> */}
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
                            </div>

                            {/* Opening Hours */}
                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Opening Hours
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="time"
                                        id="openingHoursStart"
                                        value={openingHours} // Use openingHours state
                                        onChange={(e) => setOpeningHours(e.target.value)} // Update openingHours directly
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
            )}
        </PageComponent>
    );
}
