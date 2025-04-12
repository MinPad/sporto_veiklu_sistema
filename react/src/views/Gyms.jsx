import PageComponent from '../components/PageComponent';
import GymListItem from '../components/GymListItem';
import LoadingDialog from "../components/core/LoadingDialog";
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import TButton from '../components/core/TButton';
import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";

import MapView from '../components/MapView';
import MapBoxMap from '../components/map/MapBoxMap';

export default function Gyms() {
    const { cityId } = useParams();
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [isAdmin, setIsAdmin] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGyms, setFilteredGyms] = useState([]);

    const [showMap, setShowMap] = useState(false);
    const mapSectionRef = useRef(null);

    const onDeleteClick = (gymId) => {
        const updatedGyms = gyms.filter(gym => gym.id !== gymId);
        setGyms(updatedGyms);
        setFilteredGyms(updatedGyms);
    };

    // useEffect(() => {
    //     document.title = "Gyms | System of Sports Activities";
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === "Admin") {
                setIsAdmin(true);
            }
        }
        fetchGyms();
    }, [cityId]);

    const fetchGyms = () => {
        setLoading(true);
        axiosClient.get(`cities/${cityId}/gyms`)
            .then(({ data }) => {
                setGyms(data);
                setFilteredGyms(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching gyms:", error);
                setLoading(false);
            });
    };

    const handleSearchChange = (ev) => {
        const query = ev.target.value;
        setSearchQuery(query);

        const filtered = gyms.filter(gym =>
            gym.name.toLowerCase().startsWith(query.toLowerCase())
        );
        setFilteredGyms(filtered);
    };

    const handleToggleMap = () => {
        setShowMap(prev => {
            const newVal = !prev;
            if (newVal && mapSectionRef.current) {
                setTimeout(() => {
                    mapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            return newVal;
        });
    };
    const searchBar = (
        <div className="relative w-full max-w-xs">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search gyms..."
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
    );


    return (
        <PageComponent
            title="Gyms"
            buttons={
                isAdmin && (
                    <TButton color="green" to={`/cities/${cityId}/gyms/create`}>
                        <PlusCircleIcon className="h-6 w-6 mr-2" />
                        Create new Gym
                    </TButton>
                )
            }
            searchBar={searchBar}
        >
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog />
                </div>
            ) : (
                <>
                    <div className="sticky bottom-4 z-40 flex justify-center md:justify-end mb-4 px-4">
                        <button
                            onClick={handleToggleMap}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-sm transition duration-150"
                        >
                            {showMap ? 'Hide Map' : 'Show Map'}
                        </button>
                    </div>

                    {showMap && (
                        <div
                            ref={mapSectionRef}
                            className="transition-all duration-300 ease-in-out overflow-hidden rounded-lg"
                        >
                            <MapBoxMap gyms={filteredGyms} cityId={cityId} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {filteredGyms.map(gym => (
                            <GymListItem
                                key={gym.id}
                                gym={gym}
                                onDeleteClick={onDeleteClick}
                                isAdmin={isAdmin}
                                cityId={cityId}
                            />
                        ))}
                    </div>
                </>
            )}
        </PageComponent>
    );
}
