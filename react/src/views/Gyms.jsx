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

import SuccessAlert from '../components/core/SuccessAlert';

export default function Gyms() {
    const { cityId } = useParams();
    const [city, setCity] = useState(null);

    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [isAdmin, setIsAdmin] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGyms, setFilteredGyms] = useState([]);

    const [showMap, setShowMap] = useState(false);
    const mapSectionRef = useRef(null);

    const [selectedDistance, setSelectedDistance] = useState(0); // 0 = show all
    const [visibleGymCount, setVisibleGymCount] = useState(null);


    const [successMessage, setSuccessMessage] = useState('');
    const successTimeoutRef = useRef(null);
    const showSuccessMessage = (msg) => {
        console.log("SUCCESS ALERT TRIGGERED:", msg);
        setSuccessMessage(msg);
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => {
            setSuccessMessage('');
            successTimeoutRef.current = null;
        }, 3000);
    };
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

        Promise.all([
            axiosClient.get(`cities/${cityId}/gyms`),
            axiosClient.get(`/cities/${cityId}`)
        ])
            .then(([gymsRes, cityRes]) => {
                setGyms(gymsRes.data);
                setFilteredGyms(gymsRes.data);
                setCity(cityRes.data);
            })
            .catch((err) => {
                console.error("Error fetching gyms or city:", err);
            })
            .finally(() => setLoading(false));
    }, [cityId]);

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
        <div className="relative w-full sm:max-w-xs">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search gyms..."
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full text-sm"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
    );

    return (
        <PageComponent
            title={city ? `Gyms in "${city.name}"` : "Loading Gyms..."}
            searchBar={searchBar}
            buttons={
                isAdmin && (
                    <TButton
                        color="green"
                        to={`/cities/${cityId}/gyms/create`}
                        className="w-full sm:w-auto justify-center"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Create new Gym
                    </TButton>
                )
            }
        >
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog />
                </div>
            ) : (
                <>
                    {/* Show Map Button */}
                    {!showMap && (
                        <div className="flex justify-end px-4 mb-4">
                            <button
                                onClick={handleToggleMap}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-sm transition"
                            >
                                Show Map
                            </button>
                        </div>
                    )}

                    {showMap && (
                        <>
                            <div className="flex justify-end px-4 mb-2">
                                <button
                                    onClick={handleToggleMap}
                                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-sm transition"
                                >
                                    Hide Map
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between px-4 mb-2 gap-2 sm:items-center">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Distance filter:</label>
                                    <select
                                        className="text-sm border rounded px-3 py-1 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedDistance}
                                        onChange={(e) => setSelectedDistance(parseFloat(e.target.value))}
                                    >
                                        <option value={0}>All</option>
                                        <option value={1}>Within 1 km</option>
                                        <option value={3}>Within 3 km</option>
                                        <option value={5}>Within 5 km</option>
                                    </select>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {visibleGymCount !== null
                                        ? `${visibleGymCount} gym${visibleGymCount !== 1 ? "s" : ""} shown`
                                        : "Loading..."}
                                </p>
                            </div>

                            <div
                                ref={mapSectionRef}
                                className="transition-all duration-300 ease-in-out overflow-hidden rounded-lg"
                            >
                                <MapBoxMap
                                    gyms={filteredGyms}
                                    cityId={cityId}
                                    selectedDistance={selectedDistance}
                                    onVisibleGymCountChange={setVisibleGymCount}
                                />
                            </div>
                        </>
                    )}

                    {/* Success Alert */}
                    {successMessage && (
                        <div className="mb-4 px-4">
                            <SuccessAlert message={successMessage} />
                        </div>
                    )}

                    {/* Gym Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {filteredGyms.map((gym) => (
                            <GymListItem
                                key={gym.id}
                                gym={gym}
                                onDeleteClick={onDeleteClick}
                                isAdmin={isAdmin}
                                cityId={cityId}
                                onSuccess={showSuccessMessage}
                            />
                        ))}
                    </div>
                </>
            )}
        </PageComponent>
    );

}
