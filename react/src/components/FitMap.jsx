import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FitMap = ({ gyms }) => {
    const map = useMap();

    useEffect(() => {
        if (gyms.length > 0) {
            const bounds = gyms
                .filter(gym => gym.latitude && gym.longitude)
                .map(gym => [gym.latitude, gym.longitude]);

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [30, 30] });
            }
        }
    }, [gyms]);

    return null;
};

export default FitMap;
