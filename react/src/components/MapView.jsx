import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import FitMap from './FitMap';

const MapView = ({ gyms }) => {
    const validGyms = gyms.filter(gym =>
        gym.latitude !== undefined &&
        gym.longitude !== undefined &&
        !isNaN(gym.latitude) &&
        !isNaN(gym.longitude)
    );

    const customIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const defaultPosition = [55.0, 24.0];

    const mapCenter = validGyms.length > 0
        ? [validGyms[0].latitude, validGyms[0].longitude]
        : defaultPosition;

    // console.log('All gyms:', gyms);
    // console.log('Valid gyms:', validGyms);

    return (
        <div className="w-full overflow-hidden rounded-lg shadow-md mb-6">
            {gyms.length === 0 ? (
                <div className="text-center text-gray-500 italic">No gyms found in this city.</div>
            ) : (
                <MapContainer
                    center={mapCenter}
                    zoom={7}
                    scrollWheelZoom={true}
                    style={{ height: '400px', width: '100%' }}
                    maxBounds={[[85, -180], [-85, 180]]} // Prevent infinite scroll
                    maxBoundsViscosity={1.0} // Smooth boundary "bounce" effect
                    minZoom={5}
                    maxZoom={18}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {validGyms.map((gym) => (
                        <Marker
                            key={gym.id}
                            position={[gym.latitude, gym.longitude]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div>
                                    <strong>{gym.name}</strong><br />
                                    {gym.city}<br />
                                    <em>{gym.description}</em><br />
                                    <small>{gym.openingHours}</small>
                                </div>
                            </Popup>
                        </Marker>
                    ))}<FitMap gyms={gyms} />
                </MapContainer>)}
        </div>
    );
};

export default MapView;
