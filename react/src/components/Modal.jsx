// Modal.jsx
import { Dialog } from '@headlessui/react';

const Modal = ({ isOpen, closeModal }) => {
    return (
        <Dialog open={isOpen} onClose={closeModal}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Dialog.Panel className="bg-white rounded-lg p-6 w-96">
                    <Dialog.Title className="text-2xl font-bold mb-4">Welcome to sports activities Website!</Dialog.Title>
                    <Dialog.Description className="mb-4">
                        <p>• Manage your profile settings</p>
                        <p>• Access gyms in your desired locations</p>
                        <p>• Find and connect with local coaches</p>
                        <p>• Explore the latest sports activities and events</p>
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