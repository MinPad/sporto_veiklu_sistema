import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axiosClient from "../axios";
import LoadingDialog from "../components/core/LoadingDialog";
import { jwtDecode } from "jwt-decode";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom'

import SettingsList from '../components/settings/SettingsList.jsx';
import PersonalizationSection from '../components/settings/PersonalizationSection.jsx';
import PublicProfileSection from '../components/settings/PublicProfileSection.jsx';

const Profile = () => {

    const settingsList = [
        { title: 'Public Profile', id: 'publicProfile' },
        { title: 'Settings', id: 'settings' },
        { title: 'Personalization', id: 'personalization' },
        { title: 'Health Report', id: 'healthReport' },
    ];

    const [activeSetting, setActiveSetting] = useState('personalization');

    const handleSettingsClick = (setting) => {
        setActiveSetting(setting.id);
    };


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

    const handleSavePersonalization = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('motivational_text', motivationalText);
            if (avatar) formData.append('avatar', avatar);
            if (coverPhoto) formData.append('cover_photo', coverPhoto);

            await axiosClient.post(`/users/${userId}/personalization`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Personalization saved!');
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving personalization:", err);
            setError("Failed to save personalization.");
        }
    };


    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.patch(`/users/${userId}`, {
                name,
                email
            });

            alert('Public profile saved!');
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving profile:", err);
            setError("Failed to save profile.");
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

    const [avatar, setAvatar] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [motivationalText, setMotivationalText] = useState('');


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

                                    <SettingsList
                                        settingsList={settingsList}
                                        activeSetting={activeSetting}
                                        onClick={handleSettingsClick}
                                    />

                                </div>
                            </div>
                            <div className="col-span-2">
                                {activeSetting === 'publicProfile' && (
                                    <PublicProfileSection
                                        isEditing={isEditing}
                                        setIsEditing={setIsEditing}
                                        handleSave={handleSaveProfile}
                                        handleDeleteClick={handleDeleteClick}
                                        name={name}
                                        setName={setName}
                                        email={email}
                                        setEmail={setEmail}
                                    />
                                )}
                                {activeSetting === 'settings' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-indigo-900">Settings</h2>
                                        {/* Settings Content */}
                                        <p>Configure your application settings here.</p>
                                    </div>
                                )}
                                {activeSetting === 'personalization' && (
                                    <PersonalizationSection
                                        handleSave={handleSavePersonalization}
                                        isEditing={isEditing}
                                        setIsEditing={setIsEditing}
                                        avatar={avatar}
                                        setAvatar={setAvatar}
                                        coverPhoto={coverPhoto}
                                        setCoverPhoto={setCoverPhoto}
                                        motivationalText={motivationalText}
                                        setMotivationalText={setMotivationalText}
                                    />
                                )}
                                {activeSetting === 'healthReport' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-indigo-900">Health Report</h2>
                                        {/* Health Report Content */}
                                        <p>View your recent health stats and reports.</p>
                                    </div>
                                )}


                                {/* <div className="bg-white p-6 rounded-lg shadow"> */}

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