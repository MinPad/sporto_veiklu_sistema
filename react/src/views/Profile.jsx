import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import axiosClient from "../axios";
import LoadingDialog from "../components/core/LoadingDialog";
import { jwtDecode } from "jwt-decode";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

import SettingsList from '../components/settings/SettingsList.jsx';
import PersonalizationSection from '../components/settings/PersonalizationSection.jsx';
import PublicProfileSection from '../components/settings/PublicProfileSection.jsx';
import MySportsEventsSection from '../components/settings/MySportsEventsSection.jsx';

import { useStateContext } from '../contexts/ContexProvider';
import { useLocation, useNavigationType } from 'react-router-dom';

import { useUnsavedChangesPrompt } from '../hooks/useUnsavedChangesPrompt';


const Profile = () => {
    const { setCurrentUser } = useStateContext();
    const { currentUser } = useStateContext();

    const settingsList = [
        { title: 'Public Profile', id: 'publicProfile' },
        { title: 'Settings', id: 'settings' },
        { title: 'Personalization', id: 'personalization' },
        { title: 'Health Report', id: 'healthReport' },
        { title: 'My Sports Events', id: 'mySportsEvents' },
    ];

    const [activeSetting, setActiveSetting] = useState('mySportsEvents');
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');


    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Profile fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [motivationalText, setMotivationalText] = useState('');
    const [userId, setUserId] = useState(null);
    const [userIdToDelete, setUserToDelete] = useState(null);

    const [avatarRemoved, setAvatarRemoved] = useState(false);
    const [avatarPreviewRestored, setAvatarPreviewRestored] = useState(false);
    const [originalAvatarUrl, setOriginalAvatarUrl] = useState('');

    const [pendingSetting, setPendingSetting] = useState(null);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

    const location = useLocation();
    const navigationType = useNavigationType();
    const [nextLocation, setNextLocation] = useState(null);
    const [blockNavigation, setBlockNavigation] = useState(false);

    const handleSettingsClick = (setting) => {
        if (hasUnsavedChanges) {
            setPendingSetting(setting);
            setShowUnsavedDialog(true);
        } else {
            setActiveSetting(setting.id);
        }
    };

    const handleConfirmLeave = () => {
        setShowUnsavedDialog(false);
        setMotivationalText(currentUser?.motivational_text || '');
        setAvatar(null);
        setAvatarRemoved(false);
        setName(currentUser?.name || '');
        setEmail(currentUser?.email || '');
        // If switching sections internally
        if (pendingSetting) {
            setActiveSetting(pendingSetting.id);
            setPendingSetting(null);
        }

        // If trying to navigate to another page
        if (nextLocation && typeof nextLocation.retry === 'function') {
            nextLocation.retry();
        }

        setNextLocation(null);
    };

    useEffect(() => {
        if (activeSetting === 'personalization' && avatarRemoved && !avatarPreviewRestored) {
            setAvatarRemoved(false);
            setCurrentAvatarUrl(originalAvatarUrl);
            setAvatarPreviewRestored(true);
        }
    }, [activeSetting, avatarRemoved, avatarPreviewRestored, originalAvatarUrl]);

    useEffect(() => {
        if (activeSetting !== 'personalization') {
            setAvatarPreviewRestored(false);
        }
    }, [activeSetting]);


    useEffect(() => {
        if (currentUser && currentUser.id) {
            const { name, email, avatar_url, motivational_text } = currentUser;
            setName(name || '');
            setEmail(email || '');
            setCurrentAvatarUrl(avatar_url || '');
            setOriginalAvatarUrl(avatar_url || '');
            setMotivationalText(motivational_text || '');
            setLoading(false);
        }
    }, [currentUser]);

    if (error) return <div className="text-red-500">{error}</div>;

    const handleSavePersonalization = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('motivational_text', motivationalText !== undefined ? motivationalText : '');
            if (avatar) formData.append('avatar', avatar);
            if (coverPhoto) formData.append('cover_photo', coverPhoto);
            if (avatarRemoved && !avatar) formData.append('remove_avatar', true);
            const response = await axiosClient.post(`/users/${currentUser.id}/personalization`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUser = response.data.data;
            setCurrentUser(updatedUser);
            setCurrentAvatarUrl(updatedUser.avatar_url || '');
            setOriginalAvatarUrl(updatedUser.avatar_url || '');
            setAvatar(null);
            setAvatarRemoved(false);
            setAvatarPreviewRestored(false);
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

    const handleDeleteClick = () => {
        setUserToDelete(userId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        axiosClient.delete(`/users/${userIdToDelete}`)
            .then(() => {
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
    const hasUnsavedPersonalization = useMemo(() => {
        const currentMotivation = currentUser?.motivational_text || '';
        return (
            motivationalText.trim() !== currentMotivation.trim() ||
            avatar !== null ||
            avatarRemoved
        );
    }, [motivationalText, currentUser?.motivational_text, avatar, avatarRemoved]);


    const hasUnsavedPublicProfile = useMemo(() => {
        return (
            name !== currentUser?.name ||
            email !== currentUser?.email
        );
    }, [name, email, currentUser?.name, currentUser?.email]);
    const hasUnsavedChanges = useMemo(() => {
        switch (activeSetting) {
            case 'personalization':
                return hasUnsavedPersonalization;
            case 'publicProfile':
                return hasUnsavedPublicProfile;
            default:
                return false;
        }
    }, [activeSetting, hasUnsavedPersonalization, hasUnsavedPublicProfile]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);
    useUnsavedChangesPrompt(hasUnsavedChanges, (tx) => {
        setShowUnsavedDialog(true);
        setNextLocation(tx);
    });

    return (
        <>
            <Header />
            {loading && <LoadingDialog />}
            {!loading && (
                <div className="bg-gray-200 min-h-[calc(100vh-64px)] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                        {/* Sidebar */}
                        <div className="border-b md:border-b-0 md:border-r border-gray-300 p-6">
                            <div className="sticky top-4">
                                <h2 className="text-2xl font-semibold mb-4">Settings</h2>
                                <SettingsList
                                    settingsList={settingsList}
                                    activeSetting={activeSetting}
                                    onClick={handleSettingsClick}
                                />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-2 overflow-y-auto p-6">
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
                                    currentAvatarUrl={currentAvatarUrl}
                                    setCurrentAvatarUrl={setCurrentAvatarUrl}
                                    coverPhoto={coverPhoto}
                                    setCoverPhoto={setCoverPhoto}
                                    motivationalText={motivationalText}
                                    setMotivationalText={setMotivationalText}
                                    avatarRemoved={avatarRemoved}
                                    setAvatarRemoved={setAvatarRemoved}
                                />
                            )}
                            {activeSetting === 'healthReport' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-900">Health Report</h2>
                                    <p>View your recent health stats and reports.</p>
                                </div>
                            )}
                            {activeSetting === 'mySportsEvents' && (
                                <MySportsEventsSection />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialogs */}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Delete Profile"
                message="Are you sure you want to delete your profile? This action cannot be undone."
                onConfirm={confirmDelete}
            />
            <ConfirmationDialog
                isOpen={showUnsavedDialog}
                onClose={() => setShowUnsavedDialog(false)}
                title="Unsaved Changes"
                message="You have unsaved changes in this section. Are you sure you want to leave without saving?"
                onConfirm={handleConfirmLeave}
            />
        </>
    );

};

export default Profile;