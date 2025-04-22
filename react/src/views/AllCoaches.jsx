import { useEffect, useState, useRef } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import {
    MagnifyingGlassIcon,
    PlusCircleIcon,
    PencilIcon,
    TrashIcon,
    BriefcaseIcon
} from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import { useStateContext } from '../contexts/ContexProvider';
import LoadingDialog from "../components/core/LoadingDialog";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import { useNavigate } from "react-router-dom";

import SuccessAlert from '../components/core/SuccessAlert';

export default function AllCoaches() {
    const [coaches, setCoaches] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [coachToDelete, setCoachToDelete] = useState(null);

    const { userRole } = useStateContext();
    const isAdmin = userRole === 'Admin';
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState('');
    const successTimeoutRef = useRef(null);
    const showSuccessMessage = (msg) => {
        // console.log("SUCCESS ALERT TRIGGERED:", msg);
        setSuccessMessage(msg);
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => {
            setSuccessMessage('');
            successTimeoutRef.current = null;
        }, 3000);
    };

    useEffect(() => {
        setLoading(true);
        axiosClient.get('/coaches')
            .then(async ({ data }) => {
                const enrichedCoaches = await Promise.all(
                    data.map(async (coach) => {
                        if (coach.gymId) {
                            try {
                                const { data: gymData } = await axiosClient.get(`/gyms/${coach.gymId}`);
                                return { ...coach, gym: gymData };
                            } catch {
                                return { ...coach, gym: null };
                            }
                        } else {
                            return { ...coach, gym: null };
                        }
                    })
                );

                setCoaches(enrichedCoaches);
                setFilteredCoaches(enrichedCoaches);
            })
            .catch((error) => {
                console.error("Error fetching coaches:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSearchChange = (ev) => {
        const query = ev.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = coaches.filter(coach => {
            const fullName = `${coach.name} ${coach.surname}`.toLowerCase();
            const specialties = coach.specialties?.map(s => s.name.toLowerCase()).join(', ') || '';
            const gym = coach.gym?.name?.toLowerCase() || "";
            return fullName.includes(query) || specialties.includes(query) || gym.includes(query);
        });

        setFilteredCoaches(filtered);
    };

    const handleDeleteClick = (coachId) => {
        setCoachToDelete(coachId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`/coaches/${coachToDelete}`)
            .then(() => {
                const updated = filteredCoaches.filter(c => c.id !== coachToDelete);
                setFilteredCoaches(updated);
                setCoaches(prev => prev.filter(c => c.id !== coachToDelete));
                setIsDialogOpen(false);
                setCoachToDelete(null);
                showSuccessMessage("Coach deleted successfully!");
            })
            .catch(err => {
                console.error("Delete failed:", err);
                setIsDialogOpen(false);
            });
    };

    const searchBar = (
        <div className="relative w-full sm:max-w-xs">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name, specialty, or gym"
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full text-sm"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
    );

    return (
        <PageComponent
            title="All Coaches"
            searchBar={searchBar}
            buttons={isAdmin && (
                <TButton
                    color="green"
                    to="/coaches/create"
                    className="flex items-center"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Create New Coach
                </TButton>
            )}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredCoaches.map(coach => (
                            <div
                                key={coach.id}
                                className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col justify-between dark:bg-gray-800"
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
                                            to={`/coaches/${coach.id}/edit`}
                                            className="flex-1"
                                        >
                                            <PencilIcon className="w-5 h-5 mr-2" />
                                            Edit
                                        </TButton>

                                        {/* Optional: Add a "View Details" button here if you build a details page later */}
                                        {/* <TButton
                                            to={`/coaches/${coach.id}/details`}
                                            className="flex-1"
                                            color="indigo"
                                        >
                                            <EyeIcon className="w-5 h-5 mr-2" />
                                            View Details
                                        </TButton> */}

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
        </PageComponent>
    );

}
