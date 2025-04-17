import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../../axios';
import ConfirmationDialog from '../core/ConfirmationDialog';
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/outline';
import SuccessAlert from '../../components/core/SuccessAlert';

const MySportsEventsSection = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [eventToLeave, setEventToLeave] = useState(null);
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
    const fetchEvents = () => {
        axiosClient.get('/my-sports-events')
            .then(({ data }) => {
                setEvents(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching joined events:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleLeaveClick = (event) => {
        setEventToLeave(event);
        setIsDialogOpen(true);
    };

    const confirmLeave = () => {
        if (!eventToLeave) return;

        axiosClient.post(`/sports-events/${eventToLeave.id}/leave`)
            .then(() => {
                setEvents(prev => prev.filter(e => e.id !== eventToLeave.id));
                setIsDialogOpen(false);
                setEventToLeave(null);
                showSuccessMessage("You have successfully left the event.");
            })
            .catch(error => {
                console.error("Error leaving event:", error);
                alert("Failed to leave event.");
                setIsDialogOpen(false);
            });
    };

    if (loading) {
        return <p className="text-gray-500">Loading your events...</p>;
    }
    const formatDate = (dateStr, locale = 'en-US') => {
        if (!dateStr) return null;

        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, {
            weekday: 'long',       // e.g., Friday
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderEventDate = (start, end, locale = 'en-US') => {
        if (!start) return 'N/A';
        if (start === end || !end) return formatDate(start, locale);
        return `${formatDate(start, locale)} – ${formatDate(end, locale)}`;
    };

    return (
        <div>
            {successMessage && (
                <SuccessAlert
                    key={successMessage}
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                />
            )}
            <h2 className="text-2xl font-semibold text-indigo-900 mb-6">My Joined Events</h2>
            {events.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
                    You haven’t joined any events yet.
                </div>
            ) : (
                <div className="grid gap-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-2xl shadow p-6 transition hover:shadow-md"
                        >
                            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div className="border-l-4 border-indigo-500 pl-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg m-0">{event.name}</h3>
                                        {event.is_free ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                                Free
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-600">€{event.entry_fee}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">Location:</span> {event.location}
                                    </p>
                                    <div className="text-sm text-gray-600 mb-1 flex items-start sm:items-center gap-1">
                                        <CalendarDaysIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                                        <div>
                                            <span className="font-semibold">Date:</span>{" "}
                                            {renderEventDate(event.start_date, event.end_date)}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        <UserIcon className="h-4 w-4 inline text-gray-500 mr-1" />
                                        {event.current_participants} / {event.max_participants} participants
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Description:</span> {event.description || 'No description provided.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleLeaveClick(event)}
                                    className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-200 px-4 py-2 rounded-md sm:ml-4 w-full sm:w-auto text-center"
                                >
                                    Leave
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Leave Event"
                message={`Are you sure you want to leave "${eventToLeave?.name}" sports event?`}
                onConfirm={confirmLeave}
            />
        </div>
    );
};

export default MySportsEventsSection;