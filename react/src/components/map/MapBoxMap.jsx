import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axiosClient from "../../axios";
import { MapPinIcon } from '@heroicons/react/24/outline';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapBoxMap = ({ gyms, cityId }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const [cityCoords, setCityCoords] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);

    useEffect(() => {
        axiosClient.get(`/cities/${cityId}`)
            .then(({ data }) => {
                if (data.latitude && data.longitude) {
                    const coords = [parseFloat(data.longitude), parseFloat(data.latitude)];
                    setCityCoords(coords);
                }
            })
            .catch(err => console.error("Error fetching city data:", err));
    }, [cityId]);

    useEffect(() => {
        if (!mapContainerRef.current || !cityCoords) return;

        const validGyms = gyms.filter(g => g.latitude && g.longitude);

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center: cityCoords,
            zoom: 12,
        });

        mapRef.current = map;
        setIsMapReady(true);

        // Add markers
        validGyms.forEach((gym) => {
            new mapboxgl.Marker()
                .setLngLat([gym.longitude, gym.latitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(`
                        <strong>${gym.name}</strong><br />
                        ${gym.city || 'Unknown City'}<br />
                        <em>${gym.description || ''}</em><br />
                        <small>${gym.openingHours || ''}</small>
                    `)
                )
                .addTo(map);
        });

        return () => map.remove();
    }, [cityCoords, gyms]);

    const handleResetView = () => {
        if (mapRef.current && cityCoords) {
            mapRef.current.flyTo({ center: cityCoords, zoom: 12 });
        }
    };

    return (
        <div className="relative w-full h-[40vh] rounded-lg shadow-md my-4">
            {/* ✅ Reset Button – Responsive */}
            {isMapReady && (
                <button
                    onClick={handleResetView}
                    className="
      absolute z-10 flex items-center gap-2
      bg-white text-gray-700 text-sm
      px-3 py-2 rounded-full shadow-md
      hover:bg-gray-100 transition
      min-w-[44px] min-h-[44px]
      right-4 bottom-4 md:top-4 md:bottom-auto
    "
                    title="Return to city center"
                >
                    <MapPinIcon className="w-5 h-5 text-blue-500" />
                    <span className="hidden sm:inline">Reset to City</span>
                </button>
            )}


            {/* ✅ Loading overlay */}
            {!isMapReady && (
                <div className="text-center italic text-gray-500 absolute inset-0 flex items-center justify-center bg-white rounded-lg">
                    Loading map...
                </div>
            )}

            {/* ✅ Map container */}
            <div
                ref={mapContainerRef}
                className="w-full h-full"
                style={{ display: isMapReady ? 'block' : 'none' }}
            />
        </div>
    );
};

export default MapBoxMap;
