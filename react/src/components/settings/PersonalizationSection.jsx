import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
    UserIcon,
    AdjustmentsHorizontalIcon,
    MoonIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import CollapsibleSection from '../../components/CollapsibleSection';

const PersonalizationSection = ({
    handleSave,
    isEditing,
    setIsEditing,
    avatar,
    setAvatar,
    currentAvatarUrl,
    setCurrentAvatarUrl,
    coverPhoto,
    setCoverPhoto,
    motivationalText,
    setMotivationalText,
    avatarRemoved,
    setAvatarRemoved,
    form,
    setForm,
    updatedAt,
}) => {

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const handleThemeChange = (e) => {
        const isDark = e.target.checked;
        const newTheme = isDark ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', isDark);
    };

    const handleAvatarRemove = () => {
        setAvatar(null);
        setRemoveAvatar(true);
    };

    return (
        <div className="w-full max-w-xl p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={handleSave} className="space-y-6 text-[#202142] dark:text-white">
                <h2 className="text-xl font-semibold">Profile Personalization</h2>

                <div className="text-sm bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800 mb-4">
                    Your preferences help us recommend the most suitable sports events and training activities for your fitness goals. These fields are optional — you can update them anytime.
                </div>

                {/* Collapsible Sections */}
                <CollapsibleSection title="Fitness Information" icon={<UserIcon className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium">Height (cm)</label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={form.height || ''}
                                onChange={(e) => setForm({ ...form, height: e.target.value })}
                                min="50"
                                max="300"
                                placeholder="e.g., 175"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium">Weight (kg)</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={form.weight || ''}
                                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                min="20"
                                max="300"
                                placeholder="e.g., 70"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Training Preferences" icon={<AdjustmentsHorizontalIcon className="w-5 h-5" />}>
                    <div className="space-y-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Fitness Goals</label>
                            <Select
                                isMulti
                                name="goals"
                                options={[
                                    { value: 'Weight Loss', label: 'Weight Loss' },
                                    { value: 'Muscle Gain', label: 'Muscle Gain' },
                                    { value: 'Endurance', label: 'Endurance' },
                                    { value: 'Flexibility', label: 'Flexibility' },
                                    { value: 'Cardio Health', label: 'Cardio Health' },
                                    { value: 'Stress Relief', label: 'Stress Relief' },
                                    { value: 'Rehabilitation', label: 'Rehabilitation' }
                                ]}
                                value={form.goals}
                                onChange={(selected) => setForm({ ...form, goals: selected })}
                                classNamePrefix="select"
                                placeholder="Select goals"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                        <div>
                            <label htmlFor="experience_level" className="block text-sm font-medium mb-1">Experience Level</label>
                            <select
                                id="experience_level"
                                name="experience_level"
                                value={form.experience_level}
                                onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">-- Select Level --</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="App Preferences" icon={<MoonIcon className="w-5 h-5" />}>
                    <div className="mt-2">
                        <label htmlFor="theme" className="block text-sm font-medium">Choose your theme</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <input
                                type="checkbox"
                                id="theme"
                                checked={theme === 'dark'}
                                onChange={handleThemeChange}
                                className="rounded border-gray-300 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-sm">Dark mode</span>
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Profile Customization" icon={<PhotoIcon className="w-5 h-5" />}>
                    <div className="space-y-4 mt-2">
                        {/* Avatar Upload */}
                        <div>
                            <label className="block text-sm font-medium">Profile Avatar</label>
                            {(!avatarRemoved && (avatar || currentAvatarUrl)) && (
                                <div className="mt-2 flex items-center space-x-4">
                                    <img
                                        src={avatar ? URL.createObjectURL(avatar) : currentAvatarUrl}
                                        alt="Avatar Preview"
                                        className="w-24 h-24 object-cover rounded-full border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAvatar(null);
                                            setCurrentAvatarUrl('');
                                            setAvatarRemoved(true);
                                        }}
                                        className="text-sm text-red-500 hover:underline"
                                    >
                                        Remove Avatar
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setAvatar(e.target.files[0]);
                                    setAvatarRemoved(false);
                                }}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-2"
                            />
                        </div>
                        {/* Motivational Text */}
                        <div>
                            <label htmlFor="motivation" className="block text-sm font-medium">Motivational Text / Greeting</label>
                            <textarea
                                id="motivation"
                                rows="3"
                                value={motivationalText}
                                onChange={(e) => setMotivationalText(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6">
                    {updatedAt && (
                        <p className="text-xs text-gray-500">
                            Last updated: {new Date(updatedAt).toLocaleString()}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );

};

export default PersonalizationSection;
