import { useState, useEffect, useRef } from 'react';
import Modal from './components/Modal';
import PageComponent from './components/PageComponent';
import { useLocation } from "react-router-dom";
import { useStateContext } from "./contexts/ContexProvider";
import axiosClient from './axios';

export default function App() {
  const { currentUser, userToken } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const welcomeModalShown = useRef(false); // <-- NEW: tracks session

  useEffect(() => {
    const decideModal = () => {
      if (userToken) {
        if (currentUser?.id !== undefined) {
          if (!currentUser.disable_welcome_modal) {
            if (!sessionStorage.getItem('welcomeModalShown')) {
              setIsModalOpen(true);
              sessionStorage.setItem('welcomeModalShown', 'true');
            }
          }
        }
      } else {
        const guestDisabled = localStorage.getItem('disableWelcomeModal');
        if (guestDisabled !== 'true') {
          setIsModalOpen(true);
        }
      }
    };

    decideModal();
  }, [currentUser, userToken]);


  const closeModal = (disableForever = false) => {
    setIsModalOpen(false);

    if (userToken && currentUser?.id) {
      if (disableForever) {
        axiosClient.patch('/user/settings', {
          disable_welcome_modal: true,
        }).catch((err) => {
          console.error('Failed to update user setting:', err);
        });
      }
    } else {
      if (disableForever) {
        localStorage.setItem('disableWelcomeModal', 'true');
      }
    }
  };

  return (
    <PageComponent title="Dashboard">
      {/* Welcome section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center dark:bg-gray-800 dark:text-white">
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

      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </PageComponent>
  );
}
