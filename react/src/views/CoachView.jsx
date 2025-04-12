import { useEffect, useState } from 'react';
import axiosClient from '../axios';

export default function CoachView({ coach, cityId }) {
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGyms(coach.id, cityId);
    }, [coach.id, cityId]);

    const fetchGyms = (coachId, cityId) => {
        setLoading(true);
        axiosClient
            .get(`/cities/${cityId}/gyms`)
            .then(({ data }) => {
                const gymsWhereCoachWorks = data.filter(gym => gym.coaches.some(c => c.id === coachId));
                setGyms(gymsWhereCoachWorks);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching gyms:', error);
                setLoading(false);
            });
    };

    return (
        <div className="coach-details">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{`Name: ${coach.name} ${coach.surname}`}</span>
                <div className="flex items-center space-x-1">
                    <BriefcaseIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 font-medium">{`Specialty: ${coach.specialty}`}</span>
                </div>
            </h3>

            <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700">Gyms where Coach works:</h4>
                {loading ? (
                    <p>Loading gyms...</p>
                ) : (
                    <ul>
                        {gyms.length > 0 ? (
                            gyms.map(gym => (
                                <li key={gym.id} className="text-gray-900">
                                    {gym.name}
                                </li>
                            ))
                        ) : (
                            <p>No gyms found for this coach.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
