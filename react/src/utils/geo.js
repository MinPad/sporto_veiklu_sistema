export function getDirectionsUrl(originLat, originLng, destinationLat, destinationLng) {
    if (!originLat || !originLng || !destinationLat || !destinationLng) return null;

    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}`;
}
