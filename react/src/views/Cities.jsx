import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import LoadingDialog from "../components/core/LoadingDialog";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";
import { PlusCircleIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";

export default function Cities() {
    const [cities, setCities] = useState([]); // Original cities from the API
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
    const [filteredCities, setFilteredCities] = useState([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cityToDelete, setCityToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === "Admin") {
                setIsAdmin(true);
            }
        }

        fetchCities();
    }, []);

    // Fetch cities from the API
    const fetchCities = () => {
        setLoading(true);
        axiosClient.get("/cities")
            .then(({ data }) => {
                setCities(data);
                setFilteredCities(data); // Set filteredCities to all cities initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching cities:", error);
                setLoading(false);
            });
    };

    // Handle search input changes
    const handleSearchChange = (ev) => {
        const query = ev.target.value;
        setSearchQuery(query);

        // Filter cities based on the search query
        const filtered = cities.filter(city =>
            city.name.toLowerCase().startsWith(query.toLowerCase())
        );
        setFilteredCities(filtered); // Update the filtered cities list
    };

    const handleDeleteClick = (cityId) => {
        setCityToDelete(cityId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`cities/${cityToDelete}`)
            .then(() => {
                setCities((prevCities) => prevCities.filter(city => city.id !== cityToDelete));
                setFilteredCities((prevCities) => prevCities.filter(city => city.id !== cityToDelete));
                setIsDialogOpen(false);
                setCityToDelete(null);
            })
            .catch((error) => {
                console.error("Error deleting city:", error);
                setIsDialogOpen(false);
            });
    };

    // Search bar component
    const searchBar = (
        <div className="relative w-full max-w-xs">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search cities..."
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
    );

    return (
        <PageComponent
            title="Cities"
            buttons={
                isAdmin && (
                    <TButton color="green" to="/cities/create">
                        <PlusCircleIcon className="h-6 w-6 mr-2" />
                        Create new City
                    </TButton>
                )
            }
            searchBar={searchBar} // Pass the search bar here
        >
            <div className="container mx-auto py-4">
                {loading && <LoadingDialog />}

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCities.map((city) => (
                            <div
                                key={city.id}
                                className="w-full max-w-md p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-4 md:p-6 dark:bg-gray-800 dark:border-gray-700"
                            >
                                <h3 className="text-lg font-semibold text-gray-700">{city.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <a href={`/cities/${city.id}/gyms`} className="flex items-center text-blue-500 hover:text-blue-700">
                                        <EyeIcon className="h-5 w-5 mr-2" /> View Gyms
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
                        ))}
                        <ConfirmationDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            title="Delete City"
                            message="Are you sure you want to delete this city? This action cannot be undone."
                            onConfirm={confirmDelete}
                        />
                    </div>
                )}
            </div>
        </PageComponent>
    );
}
