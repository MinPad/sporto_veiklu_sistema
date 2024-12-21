// App.jsx
import { useState } from 'react';
import Modal from './components/Modal';
import PageComponent from './components/PageComponent';
import { useLocation } from "react-router-dom";
import UnauthorizedModal from "./components/UnauthorizedModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal open by default
  const closeModal = () => setIsModalOpen(false);
  const location = useLocation();
  // console.log("testas", location);
  // const showUnauthorizedModal = location.state?.showUnauthorizedModal || false;
  // const [isModalOpen, setIsModalOpen] = useState(showUnauthorizedModal);

  // const closeModal = () => setIsModalOpen(false);
  // return (
  //   <PageComponent title="Dashboard">
  //     <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  //       <button
  //         onClick={() => setIsModalOpen(true)} // Button to open the modal
  //         className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
  //       >
  //         <span>Show Info</span>
  //       </button>

  //       {/* Modal Component */}
  //       <Modal isOpen={isModalOpen} closeModal={closeModal} />
  //     </div>
  //   </PageComponent>
  // );
  return (
    <PageComponent title="Dashboard">
      {/* Welcome section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center">
        <div className="flex-1 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-4">Welcome to sports activities Website!</h2>
          <p className="text-gray-700">
            Here you can manage your profile, access gyms in wanted cities, and find coaches. Use the navigation menu on top to explore.
          </p>
        </div>
        <img
          src="https://img.freepik.com/free-vector/flat-people-doing-outdoor-activities_52683-66636.jpg?t=st=1734438549~exp=1734442149~hmac=842011bbc6c69c4fda241034b19abc48fe40dfb8a976a18580a58dad9b6e4a66&w=740"
          alt="Sports illustration"
          className="h-40 md:h-48 lg:h-64"
        />
      </div>

      {/* "Show Info" button */}
      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md px-6 py-2 mb-8"
      >
        Show Info
      </button> */}

      <Modal isOpen={isModalOpen} closeModal={closeModal} />
      {/* {isModalOpen && (
        <UnauthorizedModal isOpen={isModalOpen} closeModal={closeModal} />
      )} */}
    </PageComponent>
  );
}



