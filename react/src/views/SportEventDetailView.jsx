import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axios';
import PageComponent from '../components/PageComponent';
import LoadingDialog from "../components/core/LoadingDialog";
import TButton from '../components/core/TButton';
import { ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import SuccessAlert from '../components/core/SuccessAlert';

export default function SportEventDetailView() {
    const { sporteventid } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/sports-events/${sporteventid}`)
            .then((res) => setEvent(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [sporteventid]);
    const joinEvent = () => {
        axiosClient
            .post(`/sports-events/${event.id}/join`)
            .then((res) => {
                setEvent(res.data.event);
                showSuccessMessage(res.data.message);
            })
            .catch((err) => {
                showSuccessMessage(err.response?.data?.message || "Failed to join event.");
            });
    };

    const leaveEvent = () => {
        axiosClient
            .post(`/sports-events/${event.id}/leave`)
            .then((res) => {
                setEvent(res.data.event);
                showSuccessMessage(res.data.message);
            })
            .catch((err) => {
                showSuccessMessage(err.response?.data?.message || "Failed to leave event.");
            });
    };

    const showSuccessMessage = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    if (loading) {
        return (
            <PageComponent title="Loading...">
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog />
                </div>
            </PageComponent>
        );
    }

    if (!event) {
        return <PageComponent title="Event Not Found">Could not load the event.</PageComponent>;
    }
    console.log(event.coaches);
    return (
        <PageComponent
            title={event.name}
            buttons={
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
                    <TButton to="/sports-events" className="flex items-center justify-center">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Events
                    </TButton>
                </div>
            }
        >
            {successMessage && (
                <div className="mb-4 px-4">
                    <SuccessAlert message={successMessage} />
                </div>
            )}

            <div className="container mx-auto px-4 space-y-16">
                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden shadow-md">
                        {/* Skeleton while loading */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                        )}
                        {/* Image */}
                        <img
                            src={event.image_url ? event.image_url : "http://localhost:8000/storage/sports-events/placeholder-image.jpg"}
                            alt={event.name || "Event Image"}
                            className={`w-full h-full object-cover ${imageLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-3">{event.name}</h2>
                        <p className="text-gray-700 mb-1"><strong>Location:</strong> {event.location}</p>
                        <p className="text-gray-700 mb-1">
                            <strong>Date:</strong> {event.start_date}
                            {event.end_date ? ` - ${event.end_date}` : ""}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <strong>Entry Fee:</strong> {event.is_free ? (
                                <span className="text-green-600 font-medium">Free</span>
                            ) : (
                                <span>${parseFloat(event.entry_fee || 0).toFixed(2)}</span>
                            )}
                        </p>
                        <p className="text-gray-700 mb-1 flex items-center gap-2">
                            <strong>Participants:</strong> {event.current_participants} / {event.max_participants ?? "Unlimited"}
                            {event.max_participants !== null && event.current_participants >= event.max_participants && (
                                <span className="inline-block bg-gray-300 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                    Full
                                </span>
                            )}
                        </p>


                        <div className="mt-3">
                            {event.difficulty_level && (
                                <p className="mb-1">
                                    <strong>Difficulty:</strong>{" "}
                                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${event.difficulty_level === "Beginner"
                                        ? "bg-green-100 text-green-700"
                                        : event.difficulty_level === "Intermediate"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {event.difficulty_level}
                                    </span>
                                </p>
                            )}
                            {event.goal_tags?.length > 0 && (
                                <div className="mt-1">
                                    <strong>Goals:</strong>{" "}
                                    {event.goal_tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {event.specialties?.length > 0 && (
                                <div className="mt-1">
                                    <strong>Specialties:</strong>{" "}
                                    {event.specialties.map((spec, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded"
                                        >
                                            {spec.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {event.is_joined ? (
                                <TButton color="red" onClick={leaveEvent}>
                                    Leave Event
                                </TButton>
                            ) : (
                                !(
                                    event.max_participants !== null &&
                                    event.current_participants >= event.max_participants
                                ) && (
                                    <TButton
                                        color="green"
                                        onClick={() => joinEvent()}
                                        className="w-full sm:w-auto"
                                    >
                                        Join Event
                                    </TButton>
                                )
                            )}

                        </div>
                    </div>
                </div>
                {/* Coaches */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Coaches ({event.coaches?.length || 0})</h3>
                    {(!event.coaches || event.coaches.length === 0) ? (
                        <p className="text-gray-500">No coaches assigned to this event.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {event.coaches.map((coach) => (
                                <div
                                    key={coach.id}
                                    className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition-transform hover:scale-[1.02]"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <UserGroupIcon className="w-5 h-5 text-gray-600" />
                                        <p className="font-semibold text-sm">
                                            {coach.name} {coach.surname}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <strong>Specialty:</strong>{" "}
                                        {coach.specialties?.length
                                            ? coach.specialties.map((s) => s.name).join(", ")
                                            : <em className="text-gray-400">None</em>}
                                    </p>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Join / Leave Event */}
                {/* <div className="text-center">
                    {event.is_joined ? (
                        <TButton color="red" onClick={() => leaveEvent()}>
                            Leave Event
                        </TButton>
                    ) : (
                        <TButton
                            color="green"
                            onClick={() => joinEvent()}
                            disabled={event.is_full}
                        >
                            {event.is_full ? "Event Full" : "Join Event"}
                        </TButton>
                    )}
                </div> */}


            </div>

        </PageComponent>
    );
}