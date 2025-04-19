import { InformationCircleIcon, PencilIcon, TrashIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef } from 'react';
import TButton from './core/TButton';
import { jwtDecode } from "jwt-decode";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import axiosClient from "../axios";
import { Link } from "react-router-dom";

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
            <div className="relative group h-[470px]">
                <div className="flex flex-col justify-between h-full py-4 px-6 shadow-lg bg-white hover:bg-gray-50 rounded-lg transition cursor-pointer">

                    {/* Clickable part */}
                    <Link
                        to={`/cities/${cityId}/gyms/${gym.id}/details`}
                        className="flex-1 block hover:no-underline"
                    >
                        <img
                            src={gym.image_url}
                            alt={`${gym.name} Gym`}
                            className="w-full h-48 object-cover rounded-md"
                        />
                        <div className="mt-4">
                            <div className="flex items-center gap-2">
                                <h4 className="text-lg font-bold">{gym.name}</h4>
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

                            <div
                                className="text-sm text-gray-700 mt-2"
                                dangerouslySetInnerHTML={{ __html: gym.description }}
                            />

                            <div className="mt-4 text-sm font-semibold text-gray-800">
                                Address: <span className="font-normal">{gym.address.split(',')[0]}</span>
                            </div>
                        </div>
                    </Link>

                    {/* Action buttons (not clickable area) */}
                    <div className="mt-4 flex justify-between items-center gap-2">
                        {isAdmin && (
                            <TButton to={`/cities/${cityId}/gyms/${gym.id}/update`} className="flex-1">
                                <PencilIcon className="w-5 h-5 mr-2" />
                                Edit
                            </TButton>
                        )}
                        <TButton
                            to={`/cities/${cityId}/gyms/${gym.id}/details`}
                            className="flex-1"
                            color="indigo"
                        >
                            <EyeIcon className="w-5 h-5 mr-2" />
                            View Details
                        </TButton>
                        {isAdmin && (
                            <TButton onClick={handleDeleteClick} circle link color="red">
                                <TrashIcon className="w-5 h-5" />
                            </TButton>
                        )}
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