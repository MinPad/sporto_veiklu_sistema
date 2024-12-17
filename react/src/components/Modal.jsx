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
        // <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
        //     <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        //         <h2 className="text-2xl font-bold mb-4">Additional Features</h2>
        //         <ul className="text-gray-700 space-y-2">
        //             <li>• Manage your profile settings</li>
        //             <li>• Access gyms in your desired locations</li>
        //             <li>• Find and connect with local coaches</li>
        //             <li>• Explore the latest sports activities and events</li>
        //         </ul>
        //         <div className="flex justify-end mt-6">
        //             <button
        //                 onClick={() => setIsModalOpen(false)}
        //                 className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md px-6 py-2"
        //             >
        //                 Close
        //             </button>
        //         </div>
        //     </div>
        // </div>
    );
};

export default Modal;