import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axiosClient from "../../axios";
import { MapPinIcon } from "@heroicons/react/24/outline";
import ReactDOMServer from "react-dom/server";
import GymPopup from "./GymPopup"; // Create this component separately
import { createRoot } from "react-dom/client";
import * as turf from "@turf/turf";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapBoxMap = ({ gyms, cityId, selectedDistance, onVisibleGymCountChange }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const [cityCoords, setCityCoords] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const [userLocation, setUserLocation] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [showLegend, setShowLegend] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        axiosClient
            .get(`/cities/${cityId}`)
            .then(({ data }) => {
                if (data.latitude && data.longitude) {
                    const coords = [
                        parseFloat(data.longitude),
                        parseFloat(data.latitude),
                    ];
                    setCityCoords(coords);
                }
            })
            .catch((err) => console.error("Error fetching city data:", err));
    }, [cityId]);

    useEffect(() => {
        if (!mapContainerRef.current || !cityCoords) return;

        const validGyms = gyms.filter((g) => g.latitude && g.longitude);
        let filteredGyms = validGyms;

        if (selectedDistance > 0 && userLocation) {
            filteredGyms = validGyms.filter((g) => {
                const gymPoint = turf.point([parseFloat(g.longitude), parseFloat(g.latitude)]);
                const userPoint = turf.point([userLocation.lng, userLocation.lat]);
                const distance = turf.distance(userPoint, gymPoint, { units: "kilometers" });
                return distance <= selectedDistance;
            });
        }
        const geoJsonFeatures = filteredGyms.map((gym) => ({
            type: "Feature",
            properties: {
                id: gym.id,
                name: gym.name,
                cityName: gym.cityName ?? "Unknown",
                description: gym.description,
                openingHours: gym.openingHours,
                image_url: gym.image_url,
                latitude: gym.latitude,
                longitude: gym.longitude,
            },
            geometry: {
                type: "Point",
                coordinates: [parseFloat(gym.longitude), parseFloat(gym.latitude)],
            },
        }));
        if (onVisibleGymCountChange) {
            onVisibleGymCountChange(filteredGyms.length);
        }
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center: cityCoords,
            zoom: 12,
        });

        mapRef.current = map;
        setTimeout(() => {
            const ctrlContainer = document.querySelector('.mapboxgl-ctrl-bottom-right');
            if (ctrlContainer) {
                ctrlContainer.style.display = 'flex';
                ctrlContainer.style.flexDirection = 'column';
                ctrlContainer.style.alignItems = 'flex-end';
                ctrlContainer.style.gap = '8px';
                ctrlContainer.style.margin = '1rem';

                ctrlContainer.querySelectorAll('.mapboxgl-ctrl').forEach((el) => {
                    el.style.marginRight = '0';
                });
            }
        }, 0);
        setIsMapReady(true);

        let hoverPopup = null;
        let activePopup = null;

        map.on("load", () => {
            // 1. Add the GeoJSON source for clustering
            map.addSource("gyms", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: geoJsonFeatures,
                },
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
            });

            // 2. Cluster circles
            map.addLayer({
                id: "clusters",
                type: "circle",
                source: "gyms",
                filter: ["has", "point_count"],
                paint: {
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "#3B82F6", // blue
                        5,
                        "#FB923C", // orange
                        15,
                        "#EF4444", // red
                    ],
                    "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
                },
            });

            // 3. Cluster count labels
            map.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "gyms",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 14,
                },
            });

            // 4. Load custom gym icon
            map.loadImage("/icons/gym.png", (error, image) => {
                if (error) {
                    console.error("Error loading icon:", error);
                    return;
                }

                if (!map.hasImage("gym-icon")) {
                    map.addImage("gym-icon", image);
                }

                // 🛡️ SAFETY: Wait for the source before adding layers
                if (!map.getSource("gyms")) {
                    console.warn("Gyms source not ready yet.");
                    return;
                }

                // 5. Background circle
                map.addLayer({
                    id: "gym-background",
                    type: "circle",
                    source: "gyms",
                    filter: ["!", ["has", "point_count"]],
                    paint: {
                        "circle-radius": 10,
                        "circle-color": "#ffffff",
                        "circle-stroke-color": "#1E40AF",
                        "circle-stroke-width": 2,
                    },
                });

                // 6. Icon symbol layer
                map.addLayer({
                    id: "unclustered-point",
                    type: "symbol",
                    source: "gyms",
                    filter: ["!", ["has", "point_count"]],
                    layout: {
                        "icon-image": "gym-icon",
                        "icon-size": 0.8,
                        "icon-allow-overlap": true,
                    },
                });

                // 7. Click popup
                map.on("click", "unclustered-point", (e) => {
                    const props = e.features[0].properties;

                    const gym = {
                        id: props.id,
                        name: props.name,
                        city: props.cityName,
                        description: props.description,
                        openingHours: props.openingHours,
                        image_url: props.image_url,
                        latitude: props.latitude,
                        longitude: props.longitude,
                        cityId: cityId,
                    };

                    if (activePopup) activePopup.remove();

                    const popupNode = document.createElement("div"); // container for React
                    activePopup = new mapboxgl.Popup({
                        offset: 25,
                        anchor: "top",
                    })
                        .setLngLat(e.lngLat)
                        .setDOMContent(popupNode)
                        .addTo(map);

                    // ✅ Use React 18 createRoot after popup is ready
                    const root = createRoot(popupNode);
                    root.render(<GymPopup gym={gym} userLocation={userLocation} />);

                    // optional: reposition map for popup visibility
                    map.easeTo({
                        center: e.lngLat,
                        offset: [0, -100],
                    });
                });

                // 8. Hover effect
                map.on("mouseenter", "unclustered-point", (e) => {
                    const name = e.features[0].properties.name;
                    map.getCanvas().style.cursor = "pointer";

                    const coordinates = e.features[0].geometry.coordinates.slice();

                    if (hoverPopup) hoverPopup.remove();

                    hoverPopup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                        offset: 15,
                    })
                        .setLngLat(coordinates)
                        .setHTML(`<strong>${name}</strong>`)
                        .addTo(map);
                });

                map.on("mouseleave", "unclustered-point", () => {
                    map.getCanvas().style.cursor = "";
                    if (hoverPopup) {
                        hoverPopup.remove();
                        hoverPopup = null;
                    }
                });
            });

            // 9. Zoom into cluster on click
            map.on("click", "clusters", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["clusters"],
                });
                const clusterId = features[0].properties.cluster_id;
                map.getSource("gyms").getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err) return;
                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom,
                    });
                });
            });

            // 10. Close popup on map click
            map.on("click", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["unclustered-point"],
                });
                if (!features.length && activePopup) {
                    activePopup.remove();
                    activePopup = null;
                }
            });

            // 11. Cursor for clusters
            map.on("mouseenter", "clusters", () => {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "clusters", () => {
                map.getCanvas().style.cursor = "";
            });

            // 12. User location
            map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true,
                    },
                    trackUserLocation: true,
                    showUserHeading: true,
                }),
                "bottom-right"
            );
        });
        // console.log("🚀 useEffect TRIGGERED", { selectedDistance, userLocation });
        return () => map.remove();
    }, [cityCoords, gyms, selectedDistance, userLocation]);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                // console.log("✅ Got user location:", coords);
                setUserLocation(coords);
            },
            (err) => {
                console.error("🛑 Error getting location", err);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
            }
        );
    }, []);

    useEffect(() => {
        // console.log("📍 User location updated:", userLocation);
    }, [userLocation]);

    const handleResetView = () => {
        if (mapRef.current && cityCoords) {
            mapRef.current.flyTo({ center: cityCoords, zoom: 12 });
        }
    };

    return (

        <div className="relative w-full h-[40vh] rounded-lg shadow-md my-4">
            {isMapReady && (
                <button
                    onClick={handleResetView}
                    className="absolute z-10 flex items-center gap-2 bg-white text-gray-700 text-sm px-3 py-2 rounded-full shadow-md hover:bg-gray-100 transition min-w-[44px] min-h-[44px] right-4 bottom-4 md:top-4 md:bottom-auto"
                    title="Return to city center"
                >
                    <MapPinIcon className="w-5 h-5 text-blue-500" />
                    <span className="hidden sm:inline">Reset to City</span>
                </button>
            )}

            {!isMapReady && (
                <div className="text-center italic text-gray-500 absolute inset-0 flex items-center justify-center bg-white rounded-lg">
                    Loading map...
                </div>
            )}
            {isMobile && (
                <button
                    onClick={() => setShowLegend(prev => !prev)}
                    className="absolute top-4 left-4 z-20 mt-[110px]  bg-white text-blue-600 text-xs underline px-2 py-1 rounded shadow"
                >
                    {showLegend ? "Hide Legend" : "Show Legend"}
                </button>
            )}
            <div
                ref={mapContainerRef}
                className="w-full h-full"
                style={{ display: isMapReady ? "block" : "none" }}
            />
            {/* <div
                className="absolute bottom-[70px] right-2 text-xs text-gray-600 bg-white bg-opacity-90 px-2 py-0.5 rounded shadow-sm z-10"
                title="Click to center map on your location"
            >
                📍 Show my location
            </div> */}
            {/* Legend box – optional */}

            {(!isMobile || showLegend) && (
                <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 rounded px-3 py-2 text-sm shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Small Cluster</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                        <span>Medium Cluster</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Large Cluster</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <img src="/icons/gym.png" alt="Gym icon" className="h-4 w-4" />
                        <span>Individual Gym</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapBoxMap;
