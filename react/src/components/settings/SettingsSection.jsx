import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import CollapsibleSection from '../../components/CollapsibleSection';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../axios';

const SettingsSection = forwardRef(({
    userSettings,
    setUserSettings,
    showSuccessMessage,
    setCurrentUser,
    hasUnsavedSettings,
    setHasUnsavedSettings,
    isEditing,
    setIsEditing
}, ref) => {
    const [disableWelcomeModal, setDisableWelcomeModal] = useState(false);

    const originalDisableWelcomeModal = useRef(userSettings.disable_welcome_modal || false);

    useEffect(() => {
        if (userSettings) {
            setDisableWelcomeModal(userSettings.disable_welcome_modal || false);
            originalDisableWelcomeModal.current = userSettings.disable_welcome_modal || false; // Keep ref synced if backend changes
        }
    }, [userSettings]);

    // Allow Profile.jsx to call resetChanges()
    useImperativeHandle(ref, () => ({
        resetChanges: () => {
            setDisableWelcomeModal(originalDisableWelcomeModal.current);
            setHasUnsavedSettings(false);
            setIsEditing(false);
        }
    }));

    const handleToggleChange = (e) => {
        const isChecked = e.target.checked;
        setDisableWelcomeModal(isChecked);
        setHasUnsavedSettings(true);
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.patch('/user/settings', {
                disable_welcome_modal: disableWelcomeModal
            });

            const updatedUser = response.data.data;

            setUserSettings((prev) => ({
                ...prev,
                disable_welcome_modal: updatedUser.disable_welcome_modal
            }));

            setCurrentUser((prev) => ({
                ...prev,
                disable_welcome_modal: updatedUser.disable_welcome_modal
            }));

            setHasUnsavedSettings(false);
            setIsEditing(false);
            showSuccessMessage('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    return (
        <form onSubmit={handleSave} className="w-full max-w-xl p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6">General Settings</h2>

            <CollapsibleSection title="Welcome Modal Settings" icon={<Cog6ToothIcon className="w-5 h-5" />}>
                <div className="flex items-center space-x-4 mt-2">
                    <input
                        type="checkbox"
                        id="disableWelcomeModal"
                        checked={disableWelcomeModal}
                        onChange={handleToggleChange}
                        className="rounded border-gray-300 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="disableWelcomeModal" className="text-sm">
                        Don't show Welcome Modal after login
                    </label>
                </div>
            </CollapsibleSection>

            {isEditing && (
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </form>
    );
});

export default SettingsSection;