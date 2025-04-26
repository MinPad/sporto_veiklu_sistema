import { useEffect, useState } from "react";
import { getDirectionsUrl } from "../../utils/geo";
import axiosClient from "../../axios";

const GymPopup = ({ gym, userLocation }) => {
    const [directionsUrl, setDirectionsUrl] = useState(null);
    const [travelInfo, setTravelInfo] = useState(null);

    useEffect(() => {
        if (!gym?.latitude || !gym?.longitude || !userLocation) return;

        const lat = parseFloat(gym.latitude);
        const lng = parseFloat(gym.longitude);

        const url = getDirectionsUrl(userLocation.lat, userLocation.lng, lat, lng);
        setDirectionsUrl(url);

        axiosClient
            .get(`/mapbox/distance`, {
                params: {
                    origin: `${userLocation.lng},${userLocation.lat}`,
                    destination: `${lng},${lat}`,
                },
            })
            .then(({ data }) => {
                if (data.distance_km && data.duration_min) {
                    setTravelInfo(data);
                }
            })
            .catch((err) => {
                console.error("❌ Distance fetch error:", err);
            });

    }, [gym?.latitude, gym?.longitude, userLocation]);


    return (
        <div className="text-sm font-sans leading-tight max-w-[220px] min-h-[210px]">
            <img
                src={gym.image_url}
                alt={gym.name}
                className="w-full h-20 object-cover rounded mb-1"
                style={{ imageRendering: "auto" }} // Avoids pixelation
            />
            <strong className="text-base">{gym.name}</strong><br />
            <span className="text-gray-600">{gym.city}</span><br />
            <em className="text-gray-700">{gym.description}</em><br />
            <small className="text-gray-500">{gym.openingHours}</small><br />

            {/* Distance placeholder to prevent jump */}
            <div className="text-xs text-gray-700 mt-1 min-h-[32px] leading-snug">
                {travelInfo ? (
                    <>🚗 {travelInfo.distance_km} km – approx. {travelInfo.duration_min} min drive</>
                ) : (
                    <span className="text-gray-400 italic block whitespace-pre">
                        Loading route...
                        {"\n"}approx. 00.0 km – 00 min drive
                    </span>
                )}
            </div>

            {directionsUrl && (
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 inline-block"
                >
                    ➤ Get Directions
                </a>
            )}
            <a
                href={`/cities/${gym.cityId}/gyms/${gym.id}/details`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 inline-block"
            >
                🔍 View Details
            </a>

        </div>

    );
};

export default GymPopup;
