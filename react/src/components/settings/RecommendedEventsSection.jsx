import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../../axios';
import { CalendarDaysIcon, UserIcon } from '@heroicons/react/24/outline';
import TButton from '../../components/core/TButton';
import SuccessAlert from '../../components/core/SuccessAlert';
import UnauthorizedAlert from '../../components/core/UnauthorizedAlert';

const RecommendedEventsSection = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const getMatchStrength = (score) => {
        if (score >= 5) return { label: "Top Match", color: "green", emoji: "🟢" };
        if (score >= 3) return { label: "Relevant", color: "yellow", emoji: "🟡" };
        return { label: "Weak Match", color: "red", emoji: "🔴" };
    };
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
    const [showFullAlert, setShowFullAlert] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/recommendations?page=${currentPage}`)
            .then((response) => {
                setEvents(response.data.data);
                setPagination(response.data.meta);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [currentPage]);

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    // console.log(`Event: ${event.name}, Score: ${event.recommendation_score}`);

    return (
        <div>
            {showFullAlert && (
                <UnauthorizedAlert
                    message="This event is already full."
                    onClose={() => setShowFullAlert(false)}
                    type="warning"
                />
            )}
            <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Recommended for You</h2>

            {loading ? (
                <p className="text-gray-500">Loading recommendations...</p>
            ) : events.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
                    You’ve already joined all the matching events or there are no suitable recommendations.
                </div>
            ) : (
                <div className="grid gap-4">
                    {successMessage && (
                        <SuccessAlert
                            key={successMessage}
                            message={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />
                    )}
                    {events.map(event => {
                        const match = getMatchStrength(event.recommendation_score);
                        const isFull = event.max_participants !== null && event.current_participants >= event.max_participants;

                        return (
                            <div key={event.id} className="bg-white rounded-2xl shadow p-6 transition hover:shadow-md">
                                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    {/* Left Side: Event Info */}
                                    <div className="border-l-4 border-indigo-500 pl-4 w-full">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                            <h3 className="font-bold text-lg">{event.name}</h3>

                                            <span
                                                className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${match.color}-100 text-${match.color}-800`}
                                                title={`Match Score: ${event.recommendation_score} - ${match.label}`}
                                            >
                                                {match.emoji} {match.label}
                                            </span>

                                            {event.is_free ? (
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                                    Free
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-600">€{event.entry_fee}</span>
                                            )}

                                            {event.difficulty_level && (
                                                <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${event.difficulty_level === "Beginner"
                                                    ? "bg-green-100 text-green-700"
                                                    : event.difficulty_level === "Intermediate"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {event.difficulty_level}
                                                </span>
                                            )}

                                            {event.gym_id == null && (
                                                <span title="Outdoor Event" className="text-green-500 text-sm">🌿</span>
                                            )}

                                            {isFull && (
                                                <span className="bg-gray-300 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                                    Full
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-semibold">Location:</span> {event.location}
                                        </p>

                                        <div className="text-sm text-gray-600 mb-1 flex items-start sm:items-center gap-1">
                                            <CalendarDaysIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                                            <div>
                                                <span className="font-semibold">Date:</span> {formatDate(event.start_date)}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-1">
                                            <UserIcon className="h-4 w-4 inline text-gray-500 mr-1" />
                                            {event.current_participants} / {event.max_participants ?? "Unlimited"} participants
                                        </p>

                                        {event.goal_tags?.length > 0 && (
                                            <div className="text-sm text-gray-600 mb-1">
                                                <span className="font-semibold">Goals:</span>{" "}
                                                {event.goal_tags.map((goal, i) => (
                                                    <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded">
                                                        {goal}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {event.specialties?.length > 0 && (
                                            <div className="text-sm text-gray-600 mb-1">
                                                <span className="font-semibold">Specialties:</span>{" "}
                                                {event.specialties.map((s, i) => (
                                                    <span key={i} className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded">
                                                        {s.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Description:</span>{" "}
                                            {event.description || "No description provided."}
                                        </p>
                                    </div>

                                    <TButton
                                        color="indigo"
                                        disabled={isFull}
                                        onClick={() => {
                                            const isFull = event.max_participants !== null && event.current_participants >= event.max_participants;
                                            if (isFull) {
                                                setShowFullAlert(true);
                                                setTimeout(() => setShowFullAlert(false), 4000);
                                                return;
                                            }

                                            axiosClient
                                                .post(`/sports-events/${event.id}/join`)
                                                .then((response) => {
                                                    showSuccessMessage(response.data.message);
                                                })
                                                .catch((error) => {
                                                    alert(error.response?.data?.message || "An error occurred.");
                                                });
                                        }}

                                        className="w-full sm:w-auto text-center"
                                    >
                                        Join
                                    </TButton>
                                </div>
                            </div>
                        );
                    })}

                    {pagination.total > pagination.per_page && (
                        <div className="mt-2 pt-2 flex justify-center gap-2 border-t border-gray-100">
                            {pagination.current_page > 1 && (
                                <button
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Previous
                                </button>
                            )}
                            <span className="px-4 py-2 text-sm text-gray-600">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>
                            {pagination.current_page < pagination.last_page && (
                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

};

export default RecommendedEventsSection;