import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import TButton from './core/TButton';
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import axiosClient from "../axios";

export default function SportEventListItem({
    sportEvent,
    onDeleteClick,
    isAdmin,
    onJoinClick,
    isGuest,
    page,
    perPage,
    sortBy,
    sortDirection }) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleDeleteClick = () => {
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`sports-events/${sportEvent.id}`)
            .then(() => {
                onDeleteClick(sportEvent.id);
                setIsDialogOpen(false);
            })
            .catch((error) => {
                console.error("Error deleting sportEvent:", error);
                setIsDialogOpen(false);
            });
    };
    const joinEvent = () => {
        axiosClient
            .post(`/sports-events/${sportEvent.id}/join`)
            .then((response) => {
                alert(response.data.message);
                if (typeof onJoinClick === "function") {
                    onJoinClick(sportEvent.id, response.data.event.current_participants);
                }
            })
            .catch((error) => {
                alert(error.response?.data?.message || "An error occurred while joining the event.");
            });
    };
    return (
        <div className="flex flex-col py-4 px-6 shadow-lg bg-white hover:bg-gray-50 h-[470px]">
            <h4 className="mt-4 text-lg font-bold">{sportEvent.name}</h4>

            <div className="text-sm text-gray-700 mt-2">
                <p><strong>Location:</strong> {sportEvent.location}</p>
                <p>
                    <strong>Date:</strong> {sportEvent.start_date}
                    {sportEvent.end_date && ` - ${sportEvent.end_date}`}
                </p>
                <p>
                    <strong>Entry Fee:</strong> {sportEvent.is_free ? "Free" : `$${sportEvent.entry_fee}`}
                </p>
                <p>
                    <strong>Participants:</strong> {sportEvent.current_participants} / {sportEvent.max_participants ?? "Unlimited"}
                </p>
            </div>

            <div className="flex-1 overflow-hidden mt-4">
                <div
                    dangerouslySetInnerHTML={{
                        __html: showFullDescription
                            ? sportEvent.description
                            : `${sportEvent.description.substring(0, 100)}...`,
                    }}
                />
                {sportEvent.description.length > 100 && (
                    <button onClick={toggleDescription} className="text-blue-500 underline mt-2">
                        {showFullDescription ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>

            <div className="mt-4 flex items-center space-x-2">
                {isAdmin && (
                    <>
                        <TButton color="yellow" icon={<PencilIcon />} to={`/sports-events/${sportEvent.id}/edit`}>
                            Edit
                        </TButton>
                        <TButton color="red" icon={<TrashIcon />} onClick={handleDeleteClick}>
                            Delete
                        </TButton>
                    </>
                )}

                {!isGuest && !isAdmin && (
                    <TButton
                        color="green"
                        icon={<UserGroupIcon />}
                        onClick={joinEvent}
                        disabled={sportEvent.isFull}
                    >
                        {sportEvent.isFull ? "Event Full" : "Join Event"}
                    </TButton>
                )}


            </div>

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Delete SportEvent"
                message="Are you sure you want to delete this sport event? This action cannot be undone."
                onConfirm={confirmDelete}
            />
        </div>
    );
}
