import PageComponent from '../components/PageComponent';
import GymListItem from '../components/GymListItem';
import LoadingDialog from "../components/core/LoadingDialog";
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import TButton from '../components/core/TButton';
import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";

import MapBoxMap from '../components/map/MapBoxMap';
import SuccessAlert from '../components/core/SuccessAlert';
import SearchFilterBar from "../components/core/SearchFilterBar";
import FilterDrawerGym from '../components/core/FilterDrawerGym';

export default function Gyms() {
    // console.log('Gyms page loaded')
    const { cityId } = useParams();
    const [city, setCity] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        specialties: [],
        minRating: 0,
        pricing: 'all',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [showMap, setShowMap] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedDistance, setSelectedDistance] = useState(0);
    const [visibleGymCount, setVisibleGymCount] = useState(null);
    const mapSectionRef = useRef(null);
    const successTimeoutRef = useRef(null);
    const [availableSpecialties, setAvailableSpecialties] = useState([]);

    const showSuccessMessage = (msg) => {
        setSuccessMessage(msg);
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => {
            setSuccessMessage('');
            successTimeoutRef.current = null;
        }, 3000);
    };
    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const { data } = await axiosClient.get('/specialties', {
                    headers: {
                        'X-Public-Request': 'true'
                    }
                });
                const formattedSpecialties = Array.isArray(data)
                    ? data.map(spec => ({
                        value: spec.id,
                        label: spec.name,
                    }))
                    : [];
                setAvailableSpecialties(
                    formattedSpecialties.sort((a, b) => a.label.localeCompare(b.label))
                );

            } catch (error) {
                console.error('Error fetching specialties:', error);
            }
        };

        fetchSpecialties();
    }, []);
    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === "Admin") {
                setIsAdmin(true);
            }
        }

        axiosClient.get(`/cities/${cityId}`, {
            headers: {
                'X-Public-Request': 'true'
            }
        })
            .then((cityRes) => setCity(cityRes.data))
            .catch((err) => console.error("Error fetching city:", err));
    }, [cityId]);

    useEffect(() => {
        fetchGyms(currentPage);
    }, [currentPage, filters, searchQuery, cityId]);

    const fetchGyms = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/cities/${cityId}/gyms`, {
            headers: {
                'X-Public-Request': 'true'
            },
            params: {
                page,
                per_page: 6,
                specialties: filters.specialties.length > 0 ? filters.specialties : undefined,
                min_rating: Number(filters.minRating) > 0 ? Number(filters.minRating) : undefined,
                pricing: filters.pricing !== 'all' ? filters.pricing : undefined,
                search: searchQuery || undefined,
            }
        })
            .then(({ data }) => {
                setGyms(data.data || []);
                setPagination(data.meta || {});
            })
            .catch((err) => console.error("Error fetching gyms:", err))
            .finally(() => setLoading(false));
    };

    const handleSearchChange = (ev) => {
        setSearchQuery(ev.target.value);
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

    const handleClearFilters = () => {
        setFilters({
            specialties: [],
            minRating: 0,
            pricing: 'all'
        });
    };

    const onDeleteClick = (gymId) => {
        const updatedGyms = gyms.filter(gym => gym.id !== gymId);
        setGyms(updatedGyms);
    };

    const activeFilterCount =
        (filters.specialties.length > 0 ? 1 : 0) +
        (filters.minRating > 0 ? 1 : 0) +
        (filters.pricing !== 'all' ? 1 : 0);

    const searchBar = (
        <SearchFilterBar
            value={searchQuery}
            onChange={handleSearchChange}
            onFilterClick={() => setShowDrawer(true)}
            placeholder="Search gyms..."
            showFilter={true}
            filterCount={activeFilterCount}
        />
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
                    {/* Map Toggle */}
                    {gyms.length > 0 && (
                        <div className="flex justify-end px-4 mb-4">
                            <button
                                onClick={handleToggleMap}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-sm transition"
                            >
                                {showMap ? 'Hide Map' : 'Show Map'}
                            </button>
                        </div>
                    )}

                    {showMap && (
                        <>
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
                                    gyms={gyms}
                                    cityId={cityId}
                                    selectedDistance={selectedDistance}
                                    onVisibleGymCountChange={setVisibleGymCount}
                                />
                            </div>
                        </>
                    )}


                    {successMessage && (
                        <div className="mb-4 px-4">
                            <SuccessAlert message={successMessage} />
                        </div>
                    )}

                    {/* Gym Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {gyms.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 italic mt-12">
                                There are no gyms to display.
                            </div>
                        ) : (
                            gyms.map((gym) => (
                                <GymListItem
                                    key={gym.id}
                                    gym={gym}
                                    onDeleteClick={onDeleteClick}
                                    isAdmin={isAdmin}
                                    cityId={cityId}
                                    onSuccess={showSuccessMessage}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.total > pagination.per_page && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded shadow-sm border border-gray-200">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={pagination.current_page <= 1}
                                    className={`px-4 py-2 rounded ${pagination.current_page <= 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
                                    disabled={pagination.current_page >= pagination.last_page}
                                    className={`px-4 py-2 rounded ${pagination.current_page >= pagination.last_page
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <FilterDrawerGym
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                onApply={(newFilters) => setFilters(newFilters)}
                onClear={handleClearFilters}
                initialFilters={filters}
                availableSpecialties={availableSpecialties}
            />
        </PageComponent>
    );
}
