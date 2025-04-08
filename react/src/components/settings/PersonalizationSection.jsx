import React, { useState, useEffect } from 'react';

const PersonalizationSection = ({
    handleSave,
    isEditing,
    setIsEditing,
    avatar,
    setAvatar,
    coverPhoto,
    setCoverPhoto,
    motivationalText,
    setMotivationalText,
}) => {
    const [theme, setTheme] = useState('light');

    // Load theme from localStorage on mount
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

    return (
        <div className="w-full max-w-xl p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={handleSave} className="space-y-6 text-[#202142] dark:text-white">
                <h2 className="text-xl font-semibold">Profile Personalization</h2>

                {/* Theme Toggle */}
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium">
                        Choose your theme
                    </label>
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

                {/* Avatar Upload */}
                <div>
                    <label className="block text-sm font-medium">Profile Avatar</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files[0])}
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>

                {/* Cover Photo Upload */}
                <div>
                    <label className="block text-sm font-medium">Cover Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverPhoto(e.target.files[0])}
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>

                {/* Motivational Text */}
                <div>
                    <label htmlFor="motivation" className="block text-sm font-medium">
                        Motivational Text / Greeting
                    </label>
                    <textarea
                        id="motivation"
                        rows="3"
                        value={motivationalText}
                        onChange={(e) => setMotivationalText(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
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
