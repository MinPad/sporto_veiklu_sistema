import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axiosClient from "../axios";
import LoadingDialog from "../components/core/LoadingDialog";
import { jwtDecode } from "jwt-decode";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom'
const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();
    // Profile fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch the currently authenticated user's data
        axiosClient.get('/user')
            .then(({ data }) => {
                const { name, email } = data.data;
                setName(name || '');
                setEmail(email || '');
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching user data:", err);
                setError("Failed to load profile data.");
                setLoading(false);
            });
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.sub);
        }
    }, []);

    const handleSave = async () => {
        try {
            const updatedProfile = {
                name,
                email,
            };
            console.log(updatedProfile);
            console.log(`/users/${userId}`);
            // debugger;
            axiosClient.patch(`/user/${userId}`, updatedProfile);
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile.");
        }
    };
    const [userIdToDelete, setUserToDelete] = useState(null);

    const handleDeleteClick = () => {
        setUserToDelete(userId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`/users/${userIdToDelete}`)
            .then(() => {
                // alert('Profile deleted successfully!');
                localStorage.removeItem('TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                navigate(`/signup`);
                setIsDialogOpen(false);
                setUserToDelete(null);
            })
            .catch((error) => {
                console.error("Error deleting profile:", error);
                setIsDialogOpen(false);
            });
    };
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <>
            <Header />
            {loading && <LoadingDialog />}
            {!loading && (
                <div className="bg-gray-200 min-h-screen">
                    <div className="container mx-auto py-8 px-4 md:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="col-span-1 md:border-r border-gray-300 md:pr-8">
                                <div className="sticky top-20">
                                    <h2 className="text-2xl font-semibold mb-4">Settings</h2>
                                    <a href="#" className="block px-4 py-2 font-bold bg-white text-indigo-900 border rounded-full hover:bg-indigo-100">
                                        Public Profile
                                    </a>
                                </div>
                            </div>
                            <div className="col-span-2">
                                {/* <div className="bg-white p-6 rounded-lg shadow"> */}
                                <div className="w-full max-w-md p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                                    {isEditing ? (
                                        <form onSubmit={handleSave} className="space-y-4 text-[#202142]">
                                            <h2 className="text-xl font-semibold text-indigo-900">Profile Edit</h2>
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                                    Email address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    type="submit"
                                                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="text-indigo-700 bg-white border border-indigo-700 hover:bg-indigo-100 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-semibold text-indigo-900">Profile View</h2>
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                                    Name
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    value={name}
                                                    readOnly
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                                    Email address
                                                </label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    value={email}
                                                    readOnly
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    Edit
                                                </button>
                                                <TButton
                                                    onClick={handleDeleteClick}
                                                    circle
                                                    link
                                                    color="red"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </TButton>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Delete Profile"
                message="Are you sure you want to delete your profile? This action cannot be undone."
                onConfirm={confirmDelete}
            />
        </>
    );
};

export default Profile;