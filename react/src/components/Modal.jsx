// Modal.jsx
import { Dialog } from '@headlessui/react';

const Modal = ({ isOpen, closeModal }) => {
    return (
        <Dialog open={isOpen} onClose={closeModal}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Dialog.Panel className="bg-white rounded-lg p-6 w-96">
                    <Dialog.Title className="text-2xl font-bold mb-4">Welcome to sports activities Website!</Dialog.Title>
                    <Dialog.Description as="div" className="mb-4">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Manage your profile settings</li>
                            <li>Access gyms in your desired locations</li>
                            <li>Find and connect with local coaches</li>
                            <li>Explore the latest sports activities and events</li>
                        </ul>
                    </Dialog.Description>



                    <button
                        onClick={closeModal}
                        className="mt-4 p-2 bg-blue-500 text-white rounded"
                    >
                        Close
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default Modal;