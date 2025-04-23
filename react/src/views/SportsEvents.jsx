import PageComponent from '../components/PageComponent';
import SportEventListItem from '../components/SportEventListItem';
import LoadingDialog from "../components/core/LoadingDialog";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";

export default function SportsEvents() {
    const [sportsEvents, setSportsEvents] = useState([]);
    const [filteredSportsEvents, setFilteredSportsEvents] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isGuest, setIsGuest] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const onDeleteClick = (sportEventId) => {
        const updated = sportsEvents.filter(e => e.id !== sportEventId);
        setSportsEvents(updated);
        setFilteredSportsEvents(updated);
    };

    const onJoinClick = (id, updatedParticipants) => {
        const updated = sportsEvents.map(e =>
            e.id === id ? { ...e, current_participants: updatedParticipants, is_joined: !e.is_joined } : e
        );
        setSportsEvents(updated);
        setFilteredSportsEvents(updated);
    };

    const onLeaveClick = (id, updatedParticipants) => {
        const updated = sportsEvents.map(e =>
            e.id === id ? { ...e, current_participants: updatedParticipants } : e
        );
        setSportsEvents(updated);
        setFilteredSportsEvents(updated);
    };

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const { role } = jwtDecode(token);
            if (role === "Admin") setIsAdmin(true);
            if (role === "Admin" || role === "User") setIsGuest(false);
        }
        fetchSportsEvents();
    }, []);

    const fetchSportsEvents = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/sports-events?page=${page}`)
            .then(({ data }) => {
                setSportsEvents(data.data || []);
                setFilteredSportsEvents(data.data || []);
                setPagination(data.meta || {});
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching sportsEvents:", error);
                setLoading(false);
            });
    };

    const handleSearchChange = (ev) => {
        const query = ev.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = sportsEvents.filter(e =>
            e.name.toLowerCase().startsWith(query)
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
        <PageComponent title="SportsEvents" searchBar={searchBar}>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {(filteredSportsEvents || []).map(sportEvent => (
                            <SportEventListItem
                                key={sportEvent.id}
                                sportEvent={sportEvent}
                                onDeleteClick={onDeleteClick}
                                onJoinClick={onJoinClick}
                                onLeaveClick={onLeaveClick}
                                isAdmin={isAdmin}
                                isGuest={isGuest}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.total > pagination.per_page && (
                        <div className="mt-6 flex justify-center gap-2">
                            {pagination.current_page > 1 && (
                                <button
                                    onClick={() => fetchSportsEvents(pagination.current_page - 1)}
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
                                    onClick={() => fetchSportsEvents(pagination.current_page + 1)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </PageComponent>
    );
}
