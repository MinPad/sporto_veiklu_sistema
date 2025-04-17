import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef } from 'react';
import TButton from './core/TButton';
import { jwtDecode } from "jwt-decode";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import axiosClient from "../axios";

export default function GymListItem({ gym, onDeleteClick, isAdmin, cityId, onSuccess }) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // For confirmation dialog
    const [gymToDelete, setGymToDelete] = useState(null);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleDeleteClick = () => {
        setGymToDelete(gym.id);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`cities/${cityId}/gyms/${gym.id}`)
            .then((response) => {
                onDeleteClick(gym.id);
                setIsDialogOpen(false);
                setGymToDelete(null);
                const message = response?.data?.message || "Gym deleted successfully!";
                if (typeof onSuccess === "function") {
                    // console.log("SUCCESS MESSAGE FIRED:", message);
                    onSuccess(message);
                }
            })
            .catch((error) => {
                console.error("Error deleting gym:", error);
                setIsDialogOpen(false);
            });
    };

    return (
        <>
            <div className="flex flex-col py-4 px-6 shadow-lg bg-white hover:bg-gray-50 h-[470px]">
                <img
                    src={gym.image_url}
                    alt={`${gym.name} Gym`}
                    className="w-full h-48 object-cover"
                />
                <div className="flex items-center gap-2 mt-4">
                    <h4 className="text-lg font-bold m-0">{gym.name}</h4>
                    {gym.isFree ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            Free
                        </span>
                    ) : (
                        gym.monthlyFee && (
                            <span className="text-sm text-gray-600">
                                €{gym.monthlyFee}/month
                            </span>
                        )
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                    {(gym.specialties || []).map((spec) => (
                        <span
                            key={spec.id}
                            className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full"
                        >
                            {spec.name}
                        </span>
                    ))}
                </div>
                <div className="overflow-hidden flex-1">
                    {/* <div
                    dangerouslySetInnerHTML={{
                        __html: showFullDescription ? gym.description : `${gym.description.substring(0, 25)}...`,
                    }}
                />
                {gym.description.length > 25 && (
                    <button onClick={toggleDescription} className="text-blue-500 underline mt-2">
                        {showFullDescription ? 'Show less' : 'Show more'}
                    </button>
                )} */}

                    <div
                        dangerouslySetInnerHTML={{ __html: gym.description }}
                        className="overflow-hidden flex-1"
                    > </div>

                </div>

                <div className="mt-4">
                    <div className="font-semibold mb-2">
                        <span>Address: </span>
                        <span>
                            {gym.address.split(',')[0]}
                        </span>

                    </div>
                    <div className="flex justify-between items-center">
                        {isAdmin && (
                            <TButton to={`/cities/${cityId}/gyms/${gym.id}/update`}>
                                <PencilIcon className="w-5 h-5 mr-2" />
                                Edit
                            </TButton>)}
                        <TButton to={`/cities/${cityId}/gyms/${gym.id}/coaches`}>
                            <UserGroupIcon className="w-5 h-5 mr-2" />
                            Coaches
                        </TButton>
                        <div className="flex items-center">
                            {/* <TButton href={`/view/gyms/${gym.slug}`} circle link>
                            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        </TButton> */}
                            {gym.id && isAdmin && (
                                <TButton onClick={handleDeleteClick} circle link color="red">
                                    <TrashIcon className="w-5 h-5" />
                                </TButton>
                            )}
                        </div>
                    </div>
                </div>
                <ConfirmationDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="Delete Gym"
                    message="Are you sure you want to delete this gym? This action cannot be undone."
                    onConfirm={confirmDelete}
                />
            </div>
        </>
    );
}