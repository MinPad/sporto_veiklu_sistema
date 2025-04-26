import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import LoadingDialog from "../components/core/LoadingDialog";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";
import { EnvelopeIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === "Admin") {
                setIsAdmin(true);
            }
        }

        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/users?page=${page}`)
            .then(({ data }) => {
                const userList = data.data || [];
                const meta = data.meta || {};
                setUsers(userList);
                setFilteredUsers(userList);
                setPagination(meta);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            })
            .finally(() => setLoading(false));
    };

    const handleSearchChange = (ev) => {
        const query = ev.target.value;
        setSearchQuery(query);

        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.id.toString().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`users/${userToDelete}`)
            .then(() => {
                const updated = filteredUsers.filter(user => user.id !== userToDelete);
                setFilteredUsers(updated);
                setUsers(prev => prev.filter(user => user.id !== userToDelete));
                setIsDialogOpen(false);
                setUserToDelete(null);
            })
            .catch(error => {
                console.error("Error deleting user:", error);
                setIsDialogOpen(false);
            });
    };

    const searchBar = (
        <div className="relative w-full sm:w-[340px]">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users by name, email, or ID"
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full text-sm"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
    );

    return (
        <PageComponent
            title="Users"
            searchBar={searchBar}
        >
            <div className="container mx-auto py-4">
                {loading ? (
                    <LoadingDialog />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 italic mt-12">
                                    No users found.
                                </div>
                            ) : (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                ID {user.id} | <span className="text-gray-900 font-medium">{user.name}</span>
                                            </h3>
                                            <a
                                                href={`mailto:${user.email}`}
                                                className="flex items-center text-sm text-blue-600 hover:underline"
                                            >
                                                <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-500" />
                                                {user.email}
                                            </a>
                                        </div>

                                        {isAdmin && (
                                            <div className="mt-4 flex justify-end">
                                                <TButton
                                                    onClick={() => handleDeleteClick(user.id)}
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
                            title="Delete User"
                            message="Are you sure you want to delete this user? This action cannot be undone."
                            onConfirm={confirmDelete}
                        />

                        {/* Pagination Controls */}
                        {filteredUsers.length > 0 && pagination.total > pagination.per_page && (
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