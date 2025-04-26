import PageComponent from '../components/PageComponent';
import SportEventListItem from '../components/SportEventListItem';
import LoadingDialog from "../components/core/LoadingDialog";
import { useEffect, useState } from 'react';
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";

import SearchFilterBar from "../components/core/SearchFilterBar";
import FilterDrawerSportsEvents from '../components/core/FilterDrawerSportsEvents';

export default function SportsEvents() {
    const [sportsEvents, setSportsEvents] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isGuest, setIsGuest] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        specialties: [],
        difficulty: '',
        goals: [],
    });
    const [showDrawer, setShowDrawer] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [availableSpecialties, setAvailableSpecialties] = useState([]);
    const [availableGoals, setAvailableGoals] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const { role } = jwtDecode(token);
            if (role === "Admin") setIsAdmin(true);
            if (role === "Admin" || role === "User") setIsGuest(false);
        }
    }, []);
    useEffect(() => {
        const fetchFilterData = async () => {


            try {
                const [specialtiesResponse, filterOptionsResponse] = await Promise.all([
                    axiosClient.get('/specialties'),
                    axiosClient.get('/sports-events/filter-options'),
                ]);
                // console.log('Specialties fetched:', specialtiesResponse.data);
                setAvailableSpecialties(specialtiesResponse.data);
                setAvailableGoals(filterOptionsResponse.data.goals);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterData();
    }, []);

    useEffect(() => {
        fetchSportsEvents(currentPage);
    }, [currentPage]);

    useEffect(() => {
        fetchSportsEvents(1);
    }, [filters, searchQuery]);

    const fetchSportsEvents = (page = 1) => {
        setLoading(true);

        axiosClient.get('/sports-events', {
            params: {
                page,
                per_page: 6,
                search: searchQuery || undefined,
                specialties: filters.specialties.length > 0 ? filters.specialties : undefined,
                difficulty: filters.difficulty || undefined,
                goals: filters.goals.length > 0 ? filters.goals : undefined,
            }
        })
            .then(({ data }) => {
                setSportsEvents(data.data || []);
                setPagination(data.meta || {});
                setCurrentPage(page);
            })
            .catch((error) => {
                console.error("Error fetching sports events:", error);
            })
            .finally(() => setLoading(false));
    };

    const handleSearchChange = (ev) => {
        setSearchQuery(ev.target.value);
    };

    const activeFilterCount =
        (filters.specialties.length > 0 ? 1 : 0) +
        (filters.difficulty ? 1 : 0) +
        (filters.goals.length > 0 ? 1 : 0);

    const handleClearFilters = () => {
        setFilters({ specialties: [], difficulty: '', goals: [] });
    };

    const searchBar = (
        <SearchFilterBar
            value={searchQuery}
            onChange={handleSearchChange}
            onFilterClick={() => setShowDrawer(true)}
            placeholder="Search sports events..."
            showFilter={true}
            filterCount={activeFilterCount}
        />
    );

    return (
        <PageComponent title="Sports Events" searchBar={searchBar}>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {sportsEvents.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 italic mt-12">
                                No sports events found.
                            </div>
                        ) : (
                            sportsEvents.map((sportEvent) => (
                                <SportEventListItem
                                    key={sportEvent.id}
                                    sportEvent={sportEvent}
                                    onDeleteClick={() => { }}
                                    onJoinClick={() => { }}
                                    onLeaveClick={() => { }}
                                    isAdmin={isAdmin}
                                    isGuest={isGuest}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.total > pagination.per_page && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded shadow-sm border border-gray-200">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={pagination.current_page <= 1}
                                    className={`px-4 py-2 rounded ${pagination.current_page <= 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    Previous
                                </button>

                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
                                    disabled={pagination.current_page >= pagination.last_page}
                                    className={`px-4 py-2 rounded ${pagination.current_page >= pagination.last_page
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <FilterDrawerSportsEvents
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                onApply={(newFilters) => setFilters(newFilters)}
                onClear={handleClearFilters}
                initialFilters={filters}
                availableSpecialties={availableSpecialties}
                availableGoals={availableGoals}
            />

        </PageComponent>
    );
}