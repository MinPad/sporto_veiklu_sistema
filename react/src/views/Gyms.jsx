import PageComponent from '../components/PageComponent';
import GymListItem from '../components/GymListItem';
import LoadingDialog from "../components/core/LoadingDialog";
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import TButton from '../components/core/TButton';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";

export default function Gyms() {
    const { cityId } = useParams();
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [isAdmin, setIsAdmin] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGyms, setFilteredGyms] = useState([]);

    const onDeleteClick = (gymId) => {
        const updatedGyms = gyms.filter(gym => gym.id !== gymId);
        setGyms(updatedGyms);
        setFilteredGyms(updatedGyms);
    };

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
        <PageComponent title="Gyms"
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
                    <LoadingDialog /> {/* Use the LoadingDialog here */}
                </div>
            ) : (
                // <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                //     {gyms.slice(0, 3).map(gym => ( // pasirenkam kiek norime isvesti gym is array
                //         <GymListItem gym={gym} key={gym.id} onDeleteClick={onDeleteClick} />
                //     ))}
                // </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {filteredGyms.map(gym => (
                        <GymListItem
                            gym={gym}
                            key={gym.id}
                            onDeleteClick={onDeleteClick}
                            // onDeleteClick={handleDeleteClick}
                            isAdmin={isAdmin}
                            cityId={cityId}
                        />
                    ))}
                </div>
            )}
        </PageComponent>
    );
}
