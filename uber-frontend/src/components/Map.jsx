import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const ROUTE_SOURCE_ID = "route-source";
const ROUTE_LAYER_ID = "route-layer";

const Map = ({
  setPickup,
  setDestination,
  showControls = true,
  interactionMode = "map",
  setInteractionMode,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const navControlRef = useRef(new mapboxgl.NavigationControl());
  const navControlAddedRef = useRef(false);

  const pickupRef = useRef(null);
  const destinationRef = useRef(null);

  const pickupMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);

  const setPickupRef = useRef(setPickup);
  const setDestinationRef = useRef(setDestination);
  const interactionModeRef = useRef(interactionMode);
  const setInteractionModeRef = useRef(setInteractionMode);

  useEffect(() => {
    setPickupRef.current = setPickup;
    setDestinationRef.current = setDestination;
  }, [setPickup, setDestination]);

  useEffect(() => {
    interactionModeRef.current = interactionMode;
    setInteractionModeRef.current = setInteractionMode;
  }, [interactionMode, setInteractionMode]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) {
      return;
    }

    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token not found. Set VITE_MAPBOX_ACCESS_TOKEN.");
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.4126, 23.2599],
      zoom: 12,
      interactive: true,
    });

    map.addControl(navControlRef.current, "top-right");
    navControlAddedRef.current = true;
    mapRef.current = map;

    const locateRider = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;

          console.log("Rider current coordinates:", { lng, lat });

          if (riderMarkerRef.current) {
            riderMarkerRef.current.remove();
          }

          riderMarkerRef.current = new mapboxgl.Marker({ color: "red" })
            .setLngLat([lng, lat])
            .addTo(map);

          map.flyTo({
            center: [lng, lat],
            zoom: 14,
            essential: true,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.warn("Location permission denied by user.");
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            console.warn("Location information is unavailable.");
          } else if (error.code === error.TIMEOUT) {
            console.warn("Location request timed out.");
          } else {
            console.warn("Unknown geolocation error:", error.message);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    };

    map.once("load", locateRider);

    const clearRoute = () => {
      if (!mapRef.current) {
        return;
      }

      if (mapRef.current.getLayer(ROUTE_LAYER_ID)) {
        mapRef.current.removeLayer(ROUTE_LAYER_ID);
      }

      if (mapRef.current.getSource(ROUTE_SOURCE_ID)) {
        mapRef.current.removeSource(ROUTE_SOURCE_ID);
      }
    };

    const reverseGeocode = async (lng, lat) => {
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
      );
      url.searchParams.set("access_token", mapboxgl.accessToken);
      url.searchParams.set("limit", "1");

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Reverse geocode failed: ${response.status}`);
      }

      const data = await response.json();
      return data?.features?.[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    const drawRoute = async (pickupCoords, destinationCoords) => {
      try {
        const url = new URL(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${destinationCoords[0]},${destinationCoords[1]}`,
        );
        url.searchParams.set("access_token", mapboxgl.accessToken);
        url.searchParams.set("geometries", "geojson");
        url.searchParams.set("overview", "full");

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`Directions failed: ${response.status}`);
        }

        const data = await response.json();
        const geometry = data?.routes?.[0]?.geometry;

        if (!geometry) {
          throw new Error("No route returned from Directions API");
        }

        clearRoute();

        map.addSource(ROUTE_SOURCE_ID, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry,
          },
        });

        map.addLayer({
          id: ROUTE_LAYER_ID,
          type: "line",
          source: ROUTE_SOURCE_ID,
          paint: {
            "line-color": "#111827",
            "line-width": 5,
            "line-opacity": 0.9,
          },
        });
      } catch (error) {
        console.error("drawRoute error:", error);
      }
    };

    const handleMapClick = async (event) => {
      if (interactionModeRef.current === "input") {
        if (typeof setInteractionModeRef.current === "function") {
          setInteractionModeRef.current("map");
        }
        return;
      }

      if (typeof setInteractionModeRef.current === "function") {
        setInteractionModeRef.current("map");
      }

      const lng = event.lngLat.lng;
      const lat = event.lngLat.lat;
      const coords = [lng, lat];

      try {
        if (!pickupRef.current) {
          pickupRef.current = coords;

          if (pickupMarkerRef.current) {
            pickupMarkerRef.current.remove();
          }

          pickupMarkerRef.current = new mapboxgl.Marker({ color: "black" })
            .setLngLat(coords)
            .addTo(map);

          const pickupAddress = await reverseGeocode(lng, lat);
          if (typeof setPickupRef.current === "function") {
            setPickupRef.current(pickupAddress, { lng, lat });
          }
          return;
        }

        if (!destinationRef.current) {
          destinationRef.current = coords;

          if (destinationMarkerRef.current) {
            destinationMarkerRef.current.remove();
          }

          destinationMarkerRef.current = new mapboxgl.Marker({ color: "blue" })
            .setLngLat(coords)
            .addTo(map);

          const destinationAddress = await reverseGeocode(lng, lat);
          if (typeof setDestinationRef.current === "function") {
            setDestinationRef.current(destinationAddress, { lng, lat });
          }

          await drawRoute(pickupRef.current, destinationRef.current);
          return;
        }

        destinationRef.current = null;

        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.remove();
          destinationMarkerRef.current = null;
        }

        clearRoute();

        if (typeof setDestinationRef.current === "function") {
          setDestinationRef.current("", null);
        }

        pickupRef.current = coords;

        if (pickupMarkerRef.current) {
          pickupMarkerRef.current.remove();
        }

        pickupMarkerRef.current = new mapboxgl.Marker({ color: "black" })
          .setLngLat(coords)
          .addTo(map);

        const nextPickupAddress = await reverseGeocode(lng, lat);
        if (typeof setPickupRef.current === "function") {
          setPickupRef.current(nextPickupAddress, { lng, lat });
        }
      } catch (error) {
        console.error("Map click error:", error);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      clearRoute();

      if (riderMarkerRef.current) {
        riderMarkerRef.current.remove();
        riderMarkerRef.current = null;
      }

      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }

      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }

      pickupRef.current = null;
      destinationRef.current = null;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      navControlAddedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (showControls && !navControlAddedRef.current) {
      mapRef.current.addControl(navControlRef.current, "top-right");
      navControlAddedRef.current = true;
      return;
    }

    if (!showControls && navControlAddedRef.current) {
      mapRef.current.removeControl(navControlRef.current);
      navControlAddedRef.current = false;
    }
  }, [showControls]);

  return <div ref={mapContainerRef} className="pointer-events-auto w-full h-full" />;
};

export default Map;