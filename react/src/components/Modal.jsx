import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useStateContext } from '../contexts/ContexProvider';

const Modal = ({ isOpen, closeModal }) => {
    const [disableForever, setDisableForever] = useState(false);
    const { currentUser, userToken } = useStateContext();

    const motivationalText = currentUser?.motivational_text;
    const userName = currentUser?.name;
    const isGuest = !userToken;

    const defaultMotivationalQuotes = [
        "Push yourself, because no one else is going to do it for you.",
        "Success starts with self-discipline.",
        "Stay strong, the results will speak for themselves.",
        "Every day is a fresh start to chase your goals.",
        "The only bad workout is the one that didn’t happen."
    ];

    // Pick a random fallback quote if needed
    const randomFallbackQuote = defaultMotivationalQuotes[
        Math.floor(Math.random() * defaultMotivationalQuotes.length)
    ];

    return (
        <Dialog open={isOpen} onClose={() => closeModal(disableForever)}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Dialog.Panel className="bg-white rounded-lg p-6 w-96 dark:bg-gray-800 dark:text-white">

                    <Dialog.Title className="text-2xl font-bold mb-4">
                        {isGuest
                            ? 'Welcome to sports activities Website!'
                            : `Welcome back${userName ? `, ${userName}` : ''}!`}
                    </Dialog.Title>

                    <Dialog.Description as="div" className="mb-4">
                        {/* Only show motivational text for logged-in users */}
                        {!isGuest && (
                            <p className="italic text-green-600 mb-4">
                                {motivationalText || randomFallbackQuote}
                            </p>
                        )}

                        {/* Show bullet points only for guests */}
                        {isGuest && (
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                <li>Manage your profile settings</li>
                                <li>Access gyms in your desired locations</li>
                                <li>Find and connect with local coaches</li>
                                <li>Explore the latest sports activities and events</li>
                            </ul>
                        )}
                    </Dialog.Description>

                    {/* Only for guest users */}
                    {isGuest && (
                        <div className="flex items-center mt-4">
                            <input
                                id="disable-forever"
                                type="checkbox"
                                checked={disableForever}
                                onChange={(e) => setDisableForever(e.target.checked)}
                                className="rounded border-gray-300 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 mr-2"
                            />
                            <label htmlFor="disable-forever" className="text-sm text-gray-700 dark:text-gray-300">
                                Don't show this again
                            </label>
                        </div>
                    )}

                    <button
                        onClick={() => closeModal(disableForever)}
                        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                    >
                        Close
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default Modal;
