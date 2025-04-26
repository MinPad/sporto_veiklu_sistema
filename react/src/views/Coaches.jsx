import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import LoadingDialog from "../components/core/LoadingDialog";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";
import { PencilIcon, EnvelopeIcon, PlusCircleIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon, BriefcaseIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";

import FilterDrawerCoach from '../components/core/FilterDrawerCoach';
import SearchFilterBar from "../components/core/SearchFilterBar";
export default function Coaches() {
    const { cityId, gymId } = useParams();

    const [coaches, setCoaches] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [coachToDelete, setCoachToDelete] = useState(null);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        specialties: [],
        approvalStatus: 'all',
    });
    const [showDrawer, setShowDrawer] = useState(false);
    const [availableSpecialties, setAvailableSpecialties] = useState([]);
    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const { data } = await axiosClient.get('/specialties');
                const formatted = (Array.isArray(data) ? data : data.data).map((s) => ({
                    value: s.id,
                    label: s.name,
                }));
                setAvailableSpecialties(formatted);
            } catch (error) {
                console.error('Failed to fetch specialties:', error);
            }
        };

        fetchSpecialties();
    }, []);


    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === "Admin") {
                setIsAdmin(true);
            }
        }

        fetchCoaches();
    }, [cityId, gymId]);
    useEffect(() => {
        fetchCoaches(currentPage);
    }, [cityId, gymId, currentPage]);
    useEffect(() => {
        fetchCoaches(1);
    }, [filters, searchQuery]);
    const fetchCoaches = (page = 1) => {
        const params = {
            page,
            per_page: 9,
        };

        if (searchQuery.trim() !== "") {
            params.search = searchQuery;
        }

        if (filters.approvalStatus !== 'all') {
            params.approval_status = filters.approvalStatus;
        }

        if (filters.specialties.length > 0) {
            params.specialty_ids = filters.specialties;
        }

        // console.log("Fetching with params:", params);

        setLoading(true);
        axiosClient.get(`/cities/${cityId}/gyms/${gymId}/coaches`, { params })
            .then(({ data }) => {
                const coachList = data.data || [];
                setCoaches(coachList);
                setFilteredCoaches(coachList);
                setPagination(data.meta || {});
            })
            .catch(error => {
                console.error("Error fetching coaches:", error);
            })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        // console.log("Filters updated:", filters);
    }, [filters]);


    const handleDeleteClick = (coachId) => {
        setCoachToDelete(coachId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`/cities/${cityId}/gyms/${gymId}/coaches/${coachToDelete}`)
            .then(() => {
                setCoaches((prevCoaches) => prevCoaches.filter(coach => coach.id !== coachToDelete));
                setFilteredCoaches((prevCoaches) => prevCoaches.filter(coach => coach.id !== coachToDelete));
                setIsDialogOpen(false);
                setCoachToDelete(null);
            })
            .catch((error) => {
                console.error("Error deleting coach:", error);
                setIsDialogOpen(false);
            });
    };
    // console.log("coaches", coaches);
    const handleSearchChange = (ev) => {
        setSearchQuery(ev.target.value);
    };

    const searchBar = (
        <SearchFilterBar
            value={searchQuery}
            onChange={handleSearchChange}
            onFilterClick={() => setShowDrawer(true)}
            placeholder="Search coaches by name..."
            showFilter={true}
            filterCount={
                (filters.specialties.length > 0 ? 1 : 0) +
                (filters.approvalStatus !== 'all' ? 1 : 0)
            }
        />
    );

    return (
        <PageComponent
            title="Coaches"
            searchBar={searchBar}
            buttons={
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
                    <TButton
                        to={`/cities/${cityId}/gyms/${gymId}/details`}
                        className="flex items-center justify-center w-full sm:w-auto"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Gym
                    </TButton>

                    {isAdmin && (
                        <TButton
                            color="green"
                            to={`/cities/${cityId}/gyms/${gymId}/coaches/create`}
                            className="flex items-center justify-center w-full sm:w-auto"
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Create new Coach
                        </TButton>
                    )}
                </div>
            }
        >
            <div className="container mx-auto py-4">
                {loading ? (
                    <LoadingDialog />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {coaches.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 italic mt-12">
                                    This gym doesn't have any coaches yet.
                                </div>
                            ) : (
                                coaches.map(coach => (
                                    <div
                                        key={coach.id}
                                        className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                {coach.name} {coach.surname}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-1">
                                                <BriefcaseIcon className="inline-block w-4 h-4 mr-1 text-gray-500" />
                                                <span className="font-medium">Specialties:</span>{" "}
                                                {coach.specialties?.length
                                                    ? coach.specialties.map(s => s.name).join(', ')
                                                    : <em className="text-gray-400">None</em>}
                                            </p>

                                            <p className="text-sm text-gray-500 mb-2">
                                                <span className="font-medium">Gym:</span>{" "}
                                                {coach.gym?.name || <em>Independent</em>}
                                            </p>

                                            {coach.is_approved && (
                                                <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                                    Approved
                                                </span>
                                            )}
                                        </div>

                                        {isAdmin && (
                                            <div className="mt-4 flex justify-between items-center gap-2">
                                                <TButton
                                                    to={`/cities/${cityId}/gyms/${gymId}/coaches/${coach.id}/update`}
                                                    className="flex-1"
                                                >
                                                    <PencilIcon className="w-5 h-5 mr-2" />
                                                    Edit
                                                </TButton>

                                                <TButton
                                                    onClick={() => handleDeleteClick(coach.id)}
                                                    circle
                                                    link
                                                    color="red"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </TButton>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <ConfirmationDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            title="Delete Coach"
                            message="Are you sure you want to delete this coach? This action cannot be undone."
                            onConfirm={confirmDelete}
                        />

                        {/* Pagination Controls */}
                        {pagination.total > pagination.per_page && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded shadow-sm border border-gray-200">
                                    <button
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={pagination.current_page <= 1}
                                        className={`px-4 py-2 rounded transition ${pagination.current_page <= 1
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
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={pagination.current_page >= pagination.last_page}
                                        className={`px-4 py-2 rounded transition ${pagination.current_page >= pagination.last_page
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                        <FilterDrawerCoach
                            isOpen={showDrawer}
                            onClose={() => setShowDrawer(false)}
                            onApply={(newFilters) => setFilters(newFilters)}
                            onClear={() => setFilters({ specialties: [], approvalStatus: 'all' })}
                            initialFilters={filters}
                            availableSpecialties={availableSpecialties}
                        />

                    </>
                )}
            </div>
        </PageComponent>
    );
}
