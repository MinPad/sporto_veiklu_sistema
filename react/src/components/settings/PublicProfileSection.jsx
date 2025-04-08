import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import TButton from '../core/TButton';

const PublicProfileSection = ({
    isEditing,
    setIsEditing,
    handleSave,
    handleDeleteClick,
    name,
    setName,
    email,
    setEmail
}) => {
    return (
        <div className="w-full max-w-md p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4 text-[#202142] dark:text-white">
                    <h2 className="text-xl font-semibold">Public Profile Edit</h2>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
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
                    <h2 className="text-xl font-semibold text-indigo-900 dark:text-white">Public Profile View</h2>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={name}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            value={email}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
    );
};

export default PublicProfileSection;
