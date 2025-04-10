import React, { useState, useEffect } from 'react';

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

                {/* Avatar Upload + Preview */}
                <div>
                    <label className="block text-sm font-medium">Profile Avatar</label>

                    {(!avatarRemoved && (avatar || currentAvatarUrl)) && (
                        <div className="mt-2 flex items-center space-x-4">
                            <img
                                src={avatar ? URL.createObjectURL(avatar) : currentAvatarUrl}
                                alt="Avatar Preview"
                                className="w-24 h-24 object-cover rounded-full border border-gray-300"
                            />
                            {/* Only allow removing if avatar is not newly selected */}
                            {!avatarRemoved && currentAvatarUrl && (
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
                            )}
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setAvatar(e.target.files[0]);
                            setRemoveAvatar(false); // In case they previously chose to remove
                        }}
                        className="block w-full text-sm text-gray-700 
                            file:mr-4 file:py-2 file:px-4 
                            file:border-0 file:text-sm file:font-semibold 
                            file:bg-indigo-50 file:text-indigo-700 
                            hover:file:bg-indigo-100 mt-2"
                    />
                </div>

                {/* Cover Photo Upload */}
                {/* <div>
                    <label className="block text-sm font-medium">Cover Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverPhoto(e.target.files[0])}
                        className="block w-full text-sm text-gray-700 
                            file:mr-4 file:py-2 file:px-4 
                            file:border-0 file:text-sm file:font-semibold 
                            file:bg-indigo-50 file:text-indigo-700 
                            hover:file:bg-indigo-100"
                    />
                </div> */}

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
