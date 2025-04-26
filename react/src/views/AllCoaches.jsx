import { useEffect, useState, useRef } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import {
    MagnifyingGlassIcon,
    PlusCircleIcon,
    PencilIcon,
    TrashIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import { useStateContext } from "../contexts/ContexProvider";
import LoadingDialog from "../components/core/LoadingDialog";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import { useNavigate } from "react-router-dom";

import SuccessAlert from "../components/core/SuccessAlert";
import FilterDrawerAllCoaches from "../components/core/FilterDrawerAllCoaches";
import SearchFilterBar from "../components/core/SearchFilterBar";

export default function AllCoaches() {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const [filters, setFilters] = useState({
        city: "",
        gym: "",
        specialties: [],
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [showDrawer, setShowDrawer] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [coachToDelete, setCoachToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const successTimeoutRef = useRef(null);

    const { userRole } = useStateContext();
    const isAdmin = userRole === "Admin";
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoaches(currentPage);
    }, [currentPage, filters, searchQuery]);

    const fetchCoaches = (page = 1) => {
        setLoading(true);
        axiosClient
            .get(`/coaches`, {
                params: {
                    page,
                    per_page: 9,
                    city_id: filters.city || undefined,
                    gym_id: filters.gym || undefined,
                    specialty_ids: filters.specialties.length > 0 ? filters.specialties : undefined,
                    search: searchQuery || undefined,
                },
            })
            .then(({ data }) => {
                setCoaches(data.data);
                setPagination(data.meta);
            })
            .catch((error) => {
                console.error("Error fetching coaches:", error);
            })
            .finally(() => setLoading(false));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeleteClick = (coachId) => {
        setCoachToDelete(coachId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient
            .delete(`/coaches/${coachToDelete}`)
            .then(() => {
                setCoaches((prev) => prev.filter((c) => c.id !== coachToDelete));
                setIsDialogOpen(false);
                setCoachToDelete(null);
                showSuccessMessage("Coach deleted successfully!");
            })
            .catch((err) => {
                console.error("Delete failed:", err);
                setIsDialogOpen(false);
            });
    };

    const showSuccessMessage = (msg) => {
        setSuccessMessage(msg);
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => {
            setSuccessMessage("");
            successTimeoutRef.current = null;
        }, 3000);
    };

    const searchBar = (
        <SearchFilterBar
            value={searchQuery}
            onChange={handleSearchChange}
            onFilterClick={() => setShowDrawer(true)}
            placeholder="Search by name, specialty, or gym"
            showFilter={true}
            filterCount={
                (filters.city ? 1 : 0) +
                (filters.gym ? 1 : 0) +
                (filters.specialties.length > 0 ? 1 : 0)
            }
        />
    );

    return (
        <PageComponent
            title="All Coaches"
            searchBar={searchBar}
            buttons={
                isAdmin && (
                    <TButton color="green" to="/coaches/create" className="flex items-center">
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Create New Coach
                    </TButton>
                )
            }
        >
            {successMessage && (
                <div className="mb-4 px-4">
                    <SuccessAlert message={successMessage} />
                </div>
            )}

            <div className="container mx-auto py-4">
                {loading ? (
                    <LoadingDialog />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {coaches.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 italic mt-12">
                                    There are no coaches to display.
                                </div>
                            ) : (
                                coaches.map((coach) => (
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
                                                    ? coach.specialties.map((s) => s.name).join(", ")
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
                                                    to={`/coaches/${coach.id}/edit`}
                                                    className="px-4 py-2 rounded transition-transform transform hover:scale-105 active:scale-95"
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

                        {pagination.total > pagination.per_page && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded shadow-sm border border-gray-200">
                                    <button
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
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
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
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

                        <FilterDrawerAllCoaches
                            isOpen={showDrawer}
                            onClose={() => setShowDrawer(false)}
                            onApply={(newFilters) => setFilters(newFilters)}
                            onClear={() => setFilters({ city: "", gym: "", specialties: [] })}
                            initialFilters={filters}
                            availableCities={[
                                ...new Map(
                                    coaches
                                        .filter((c) => c.gym && c.gym.city_id && c.gym.cityName)
                                        .map((c) => [c.gym.city_id, { id: c.gym.city_id, name: c.gym.cityName }])
                                ).values(),
                            ]}
                            availableGyms={[
                                ...new Map(
                                    coaches
                                        .filter((c) => c.gym && c.gym.id && c.gym.name)
                                        .map((c) => [c.gym.id, c.gym])
                                ).values(),
                            ]}
                            availableSpecialties={[
                                ...new Map(
                                    coaches
                                        .flatMap(c => c.specialties || [])
                                        .map(s => [s.id, s])
                                ).values()
                            ]}
                        />
                    </>
                )}
            </div>
        </PageComponent>
    );
}