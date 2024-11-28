import PageComponent from '../components/PageComponent';
import GymListItem from '../components/GymListItem';
import LoadingDialog from "../components/core/LoadingDialog";
import { PlusCircleIcon } from '@heroicons/react/24/outline';
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

    const onDeleteClick = (gymId) => {
        setGyms(gyms.filter(gym => gym.id !== gymId)); // Remove deleted gym from the state
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
        // setLoading(true);
        // const url = cityId ? `cities/${cityId}/gyms` : `gyms`;
        // axiosClient
        //     .get(url)
        //     .then(({ data }) => {
        //         setGyms(data);
        //         setLoading(false);
        //     })
        //     .catch((error) => {
        //         console.error("Error fetching gyms:", error);
        //         setLoading(false);
        //     });
    }, [cityId]); // Re-run effect when cityId changes

    const fetchGyms = () => {
        setLoading(true);
        axiosClient.get(`cities/${cityId}/gyms`)
            .then(({ data }) => {
                setGyms(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching gyms:", error);
                setLoading(false);
            });
    };

    return (
        <PageComponent title="Gyms"
            buttons={
                isAdmin && (
                    <TButton color="green" to={`/cities/${cityId}/gyms/create`}>
                        <PlusCircleIcon className="h-6 w-6 mr-2" />
                        Create new
                    </TButton>
                )
            }
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
                    {gyms.map(gym => (
                        <GymListItem
                            gym={gym}
                            key={gym.id}
                            onDeleteClick={onDeleteClick}
                            isAdmin={isAdmin}
                            cityId={cityId}
                        />
                    ))}
                </div>
            )}

        </PageComponent>
    );
}
