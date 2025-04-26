import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import LoadingDialog from "../components/core/LoadingDialog";
import axiosClient from "../axios";
import { PlusCircleIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import { useStateContext } from '../contexts/ContexProvider';

import SearchFilterBar from "../components/core/SearchFilterBar";

export default function Cities() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cityToDelete, setCityToDelete] = useState(null);

    const { userRole } = useStateContext();
    const isAdmin = userRole === 'Admin';

    useEffect(() => {
        fetchCities(currentPage);
    }, [currentPage]);

    const fetchCities = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/cities`, {
            params: {
                page,
                per_page: 9,
                search: searchQuery || undefined,
            }
        })
            .then(({ data }) => {
                setCities(data.data);
                setPagination(data.meta);
            })
            .catch(error => {
                console.error("Error fetching cities:", error);
            })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchCities(1);
    }, [searchQuery]);

    const handleSearchChange = (ev) => {
        setSearchQuery(ev.target.value);
        setCurrentPage(1);
    };

    const handleDeleteClick = (cityId) => {
        setCityToDelete(cityId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`cities/${cityToDelete}`)
            .then(() => {
                fetchCities(currentPage);
                setIsDialogOpen(false);
                setCityToDelete(null);
            })
            .catch((error) => {
                console.error("Error deleting city:", error);
                setIsDialogOpen(false);
            });
    };

    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const openFilterDrawer = () => {
        // Trigger modal or drawer logic
    };
    const searchBar = (
        <SearchFilterBar
            value={searchQuery}
            onChange={handleSearchChange}
            onFilterClick={() => console.log("Open filter modal/drawer")}
            placeholder="Search cities..."
            showFilter={false}
        />
    );
    return (
        <PageComponent
            title="Cities"
            buttons={
                isAdmin && (
                    <TButton color="green" to="/cities/create" className="w-full sm:w-auto justify-center">
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Create new City
                    </TButton>
                )
            }
            searchBar={searchBar}
        >
            <div className="container mx-auto py-4">
                {loading ? (
                    <LoadingDialog />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCities.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 italic mt-12">
                                    No cities found.
                                </div>
                            ) : (
                                filteredCities.map((city) => (
                                    <div
                                        key={city.id}
                                        className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                                    >
                                        <h3 className="text-lg font-bold text-gray-800">{city.name}</h3>
                                        <div className="flex justify-between items-center mt-3">
                                            <a href={`/cities/${city.id}/gyms`} className="flex items-center text-blue-600 text-sm hover:underline">
                                                <EyeIcon className="h-5 w-5 mr-2" />
                                                View Gyms
                                            </a>
                                            {isAdmin && (
                                                <TButton
                                                    onClick={() => handleDeleteClick(city.id)}
                                                    circle
                                                    link
                                                    color="red"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </TButton>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <ConfirmationDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            title="Delete City"
                            message="Are you sure you want to delete this city? This action cannot be undone."
                            onConfirm={confirmDelete}
                        />

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
                    </>
                )}
            </div>
        </PageComponent>
    );
}
