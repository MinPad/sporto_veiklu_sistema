import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import LoadingDialog from "../components/core/LoadingDialog";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";
import { EnvelopeIcon, PlusCircleIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";

export default function Users() {
    const [users, setUsers] = useState([]); // Original users from the API
    const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users based on search
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === "Admin") {
                setIsAdmin(true);
            }
        }

        fetchUsers();
    }, []);

    // Fetch users from the API
    const fetchUsers = () => {
        setLoading(true);
        axiosClient.get("/users")
            .then(({ data }) => {
                setUsers(data);
                setFilteredUsers(data); // Set filteredUsers to all users initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    };
    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`users/${userToDelete}`)
            .then(() => {
                setUsers((prevUsers) => prevUsers.filter(user => user.id !== userToDelete));
                setFilteredUsers((prevUsers) => prevUsers.filter(user => user.id !== userToDelete));
                setIsDialogOpen(false);
                setUserToDelete(null);
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                setIsDialogOpen(false);
            });
    };
    // console.log("users", users);
    const handleSearchChange = (ev) => {
        const query = ev.target.value;
        setSearchQuery(query);

        const filtered = users.filter(user =>
            user.name.toLowerCase().startsWith(query.toLowerCase()) ||
            user.email.toLowerCase().startsWith(query.toLowerCase()) ||
            user.id.toString().startsWith(query)
        );
        setFilteredUsers(filtered);
    };
    const searchBar = (
        <div className="relative w-80"> {/* Fixed width */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users by name, email and id..."
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
    );


    return (
        <PageComponent
            title="Users"
            searchBar={searchBar} // Pass the search bar here
        >
            <div className="container mx-auto py-4">
                {loading && <LoadingDialog />}

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="w-full max-w-md p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-4 md:p-6 dark:bg-gray-800 dark:border-gray-700"
                            >
                                <h3 className="text-lg font-semibold text-gray-700">
                                    <span className="text-blue-500">{"ID " + user.id}</span>
                                    <span className="mx-2 text-gray-500">|</span>
                                    <span className="text-gray-900 font-medium">{"Name: " + user.name}</span>
                                </h3>
                                <div className="flex justify-between items-center mt-2">
                                    <a href={`mailto:${user.email}`} className="flex items-center text-blue-500 hover:text-blue-700">
                                        <EnvelopeIcon className="h-5 w-5 mr-2" /> {user.email}
                                    </a>
                                    {isAdmin && (
                                        <TButton
                                            onClick={() => handleDeleteClick(user.id)}
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
                            title="Delete User"
                            message="Are you sure you want to delete this user? This action cannot be undone."
                            onConfirm={confirmDelete}
                        />
                    </div>
                )}
            </div>
        </PageComponent>
    );
}
