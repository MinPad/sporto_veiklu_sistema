import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef } from 'react';
import TButton from './core/TButton';
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import axiosClient from "../axios";
import SuccessAlert from '../components/core/SuccessAlert';
import { Link } from "react-router-dom";
import UnauthorizedAlert from '../components/core/UnauthorizedAlert';

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
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const successTimeoutRef = useRef(null);
    const showSuccessMessage = (msg) => {
        setSuccessMessage(msg);

        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }

        successTimeoutRef.current = setTimeout(() => {
            setSuccessMessage('');
            successTimeoutRef.current = null;
        }, 3000);
    };
    const [isJoined, setIsJoined] = useState(sportEvent.is_joined);
    const [showUnauthorized, setShowUnauthorized] = useState(false);
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleDeleteClick = () => {
        setIsDialogOpen(true);
    };
    const leaveEvent = () => {
        axiosClient
            .post(`/sports-events/${sportEvent.id}/leave`)
            .then((response) => {
                setIsJoined(false);
                setLeaveDialogOpen(false);
                showSuccessMessage(response.data.message);
                if (typeof onJoinClick === "function") {
                    onJoinClick(sportEvent.id, response.data.event.current_participants);
                }
            })
            .catch((error) => {
                setLeaveDialogOpen(false);
                showSuccessMessage(error.response?.data?.message || "Error while leaving event.");
            });
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
        if (isGuest) {
            setShowUnauthorized(true);
            setTimeout(() => setShowUnauthorized(false), 4000);
            return;
        }

        axiosClient
            .post(`/sports-events/${sportEvent.id}/join`)
            .then((response) => {
                setIsJoined(true);
                showSuccessMessage(response.data.message);
                if (typeof onJoinClick === "function") {
                    onJoinClick(sportEvent.id, response.data.event.current_participants);
                }
            })
            .catch((error) => {
                showSuccessMessage(error.response?.data?.message || "An error occurred while joining the event.");
            });
    };


    // console.log('Event:', sportEvent.name, 'gym_id:', sportEvent.gym_id);
    return (
        <>
            {successMessage && (
                <SuccessAlert
                    key={successMessage}
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                />
            )}
            {showUnauthorized && (
                <UnauthorizedAlert
                    message="You must be logged in to join this event."
                    actionLink="/login"
                    actionLabel="Go to Login"
                    onClose={() => setShowUnauthorized(false)}
                />
            )}
            <div className="relative group h-[470px]" data-testid={`event-card-${sportEvent.id}`}>
                <div className="flex flex-col justify-between h-full py-4 px-6 shadow-lg bg-white hover:bg-gray-50 rounded-lg transition cursor-pointer">

                    {/* Clickable area */}
                    <Link
                        to={`/sports-events/${sportEvent.id}/details`}
                        className="flex-1 block hover:no-underline"
                        data-testid={`event-details-link-${sportEvent.id}`}
                    >
                        <h4 className="mt-4 text-lg font-bold flex items-center gap-2">
                            {sportEvent.name}
                            {sportEvent.gym_id == null && (
                                <span title="Outdoor Event" className="text-green-500 text-sm">🌿</span>
                            )}
                        </h4>

                        <div className="text-sm text-gray-700 mt-2">
                            <p><strong>Location:</strong> {sportEvent.location}</p>
                            <p>
                                <strong>Date:</strong> {sportEvent.start_date}
                                {sportEvent.end_date && ` - ${sportEvent.end_date}`}
                            </p>
                            <p>
                                <strong>Entry Fee:</strong> {sportEvent.is_free ? "Free" : `$${sportEvent.entry_fee}`}
                            </p>
                            <p className="flex items-center gap-2">
                                <strong>Participants:</strong> {sportEvent.current_participants} / {sportEvent.max_participants ?? "Unlimited"}
                                {sportEvent.max_participants !== null && sportEvent.current_participants >= sportEvent.max_participants && (
                                    <span className="inline-block bg-gray-300 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                        Full
                                    </span>
                                )}
                            </p>

                            {sportEvent.difficulty_level && (
                                <div className="mt-1">
                                    <strong>Difficulty:</strong>{" "}
                                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${sportEvent.difficulty_level === "Beginner"
                                        ? "bg-green-100 text-green-700"
                                        : sportEvent.difficulty_level === "Intermediate"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {sportEvent.difficulty_level}
                                    </span>
                                </div>
                            )}

                            {sportEvent.goal_tags?.length > 0 && (
                                <div className="mt-1">
                                    <strong>Goals:</strong>{" "}
                                    {sportEvent.goal_tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {sportEvent.specialties?.length > 0 && (
                                <div className="mt-1">
                                    <strong>Specialties:</strong>{" "}
                                    {sportEvent.specialties.map((specialty, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded"
                                        >
                                            {specialty.name}
                                        </span>
                                    ))}
                                </div>
                            )}
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

                        {sportEvent.coaches?.length > 0 && (
                            <p className="text-xs text-gray-500 italic mt-2">
                                Led by {sportEvent.coaches[0].name} {sportEvent.coaches[0].surname}{sportEvent.coaches.length > 1 ? " +" : ""}
                            </p>
                        )}
                    </Link>

                    {/* Action buttons (outside link) */}
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

                        {isJoined ? (
                            <TButton
                                color="red"
                                onClick={() => setLeaveDialogOpen(true)}
                                data-testid={`leave-button-${sportEvent.id}`}
                            >
                                Leave Event
                            </TButton>
                        ) : (
                            <TButton
                                color="green"
                                icon={<UserGroupIcon />}
                                onClick={joinEvent}
                                disabled={sportEvent.isFull}
                                data-testid={`join-button-${sportEvent.id}`}
                            >
                                {sportEvent.isFull ? "Event Full" : "Join Event"}
                            </TButton>
                        )}

                    </div>

                    {/* Modals */}
                    <ConfirmationDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        title="Delete SportEvent"
                        message="Are you sure you want to delete this sport event? This action cannot be undone."
                        onConfirm={confirmDelete}
                    />
                    <ConfirmationDialog
                        isOpen={leaveDialogOpen}
                        onClose={() => setLeaveDialogOpen(false)}
                        title="Leave Event"
                        message={`Are you sure you want to leave "${sportEvent.name}" sports event?`}
                        onConfirm={leaveEvent}
                    />
                </div>
            </div>
        </>
    );

}
