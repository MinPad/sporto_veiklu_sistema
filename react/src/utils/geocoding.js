import axios from 'axios';

export const geocodeAddress = async (address) => {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const encoded = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${accessToken}`;

    try {
        const res = await axios.get(url);
        const [lng, lat] = res.data.features[0].center;
        return { latitude: lat, longitude: lng };
    } catch (err) {
        console.error("Failed to geocode:", err);
        return null;
    }
};
