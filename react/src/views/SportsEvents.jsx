import PageComponent from '../components/PageComponent';
import SportEventListItem from '../components/SportEventListItem';
import LoadingDialog from "../components/core/LoadingDialog";
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import TButton from '../components/core/TButton';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";

export default function SportsEvents() {
    const [sportsEvents, setSportsEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [isAdmin, setIsAdmin] = useState(false);
    const [isGuest, setIsGuest] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSportsEvents, setFilteredSportsEvents] = useState([]);

    const onDeleteClick = (sportEventId) => {
        const updatedSportsEvents = sportsEvents.filter(sportEvent => sportEvent.id !== sportEventId);
        setSportsEvents(updatedSportsEvents);
        setFilteredSportsEvents(updatedSportsEvents);
    };

    // Update participants count for a specific event
    const onJoinClick = (sportEventId, updatedParticipants) => {
        const updatedSportsEvents = sportsEvents.map(event =>
            event.id === sportEventId
                ? { ...event, current_participants: updatedParticipants, is_joined: !event.is_joined }
                : event
        );
        setSportsEvents(updatedSportsEvents);
        setFilteredSportsEvents(updatedSportsEvents);
    };
    const onLeaveClick = (sportEventId, updatedParticipants) => {
        const updatedSportsEvents = sportsEvents.map(event =>
            event.id === sportEventId
                ? { ...event, current_participants: updatedParticipants }
                : event
        );
        setSportsEvents(updatedSportsEvents);
        setFilteredSportsEvents(updatedSportsEvents);
    };

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === "Admin") {
                setIsAdmin(true);
            } else if (decodedToken.role === "User") {
                setIsGuest(false);
            }
        }
        fetchSportsEvents();
    }, []);

    const fetchSportsEvents = () => {
        setLoading(true);
        axiosClient.get(`/sports-events`)
            .then(({ data }) => {
                setSportsEvents(data);
                setFilteredSportsEvents(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching sportsEvents:", error);
                setLoading(false);
            });
    };

    const handleSearchChange = (ev) => {
        const query = ev.target.value;
        setSearchQuery(query);

        const filtered = sportsEvents.filter(sportEvent =>
            sportEvent.name.toLowerCase().startsWith(query.toLowerCase())
        );
        setFilteredSportsEvents(filtered);
    };

    const searchBar = (
        <div className="relative w-full max-w-xs">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search sportsEvents..."
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
    );

    return (
        <PageComponent title="SportsEvents"
            searchBar={searchBar}
        >
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog /> {/* Use the LoadingDialog here */}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {filteredSportsEvents.map(sportEvent => (
                        <SportEventListItem
                            sportEvent={sportEvent}
                            key={sportEvent.id}
                            onDeleteClick={onDeleteClick}
                            onJoinClick={onJoinClick}
                            onLeaveClick={onLeaveClick}
                            isAdmin={isAdmin}
                            isGuest={isGuest}
                        />

                    ))}
                </div>
            )}
        </PageComponent>
    );
}