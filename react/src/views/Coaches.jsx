import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import LoadingDialog from "../components/core/LoadingDialog";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";
import { PencilIcon, EnvelopeIcon, PlusCircleIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon, BriefcaseIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";

export default function Coaches() {
    const { cityId, gymId } = useParams();

    const [coaches, setCoaches] = useState([]); // Original coaches from the API
    const [filteredCoaches, setFilteredCoaches] = useState([]); // Filtered coaches based on search
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [coachToDelete, setCoachToDelete] = useState(null);

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

    // Fetch coaches from the API
    const fetchCoaches = () => {
        setLoading(true);
        axiosClient.get(`/cities/${cityId}/gyms/${gymId}/coaches`) // Include gymId and cityId
            .then(({ data }) => {
                setCoaches(data);
                setFilteredCoaches(data); // Set filteredCoaches to all coaches initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching coaches:", error);
                setLoading(false);
            });
    };

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
        const query = ev.target.value;
        setSearchQuery(query);

        const filtered = coaches.filter(coach => {
            // Check if the query matches anywhere in the name or surname (case insensitive)
            const fullName = `${coach.name} ${coach.surname}`.toLowerCase();
            return fullName.includes(query.toLowerCase()) ||
                coach.specialty.toLowerCase().includes(query.toLowerCase());
        });

        setFilteredCoaches(filtered);
    };

    const searchBar = (
        <div className="relative w-full sm:max-w-xs">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search coaches by name and specialty"
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full text-sm"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
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
                {loading && <LoadingDialog />}

                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {filteredCoaches.map((coach) => (
                            <div
                                key={coach.id}
                                className="w-full max-w-md p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-4 md:p-6 dark:bg-gray-800 dark:border-gray-700"
                            >
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                                    <span className="text-gray-900 font-medium">{`Name: ${coach.name} ${coach.surname}`}</span>
                                </h3>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center space-x-1">
                                        <BriefcaseIcon className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-900 font-medium">{`Specialty: ${coach.specialty}`}</span>
                                    </div>
                                    {isAdmin && (
                                        <>
                                            <TButton to={`/cities/${cityId}/gyms/${gymId}/coaches/${coach.id}/update`}>
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
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        <ConfirmationDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            title="Delete Coach"
                            message="Are you sure you want to delete this coach? This action cannot be undone."
                            onConfirm={confirmDelete}
                        />
                    </div>
                )}
            </div>
        </PageComponent >
    );
}
