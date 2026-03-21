import axios from "axios";
import { env } from "../../config/env.js";

// ============================================
// MAPS SERVICE - Business Logic Layer
// ============================================
// Handles all Google Maps API integrations
// Contains business logic for location services

class MapsService {
  constructor() {
    this.apiKey = env.MAPBOX_ACCESS_TOKEN;
    this.baseUrl = "https://api.mapbox.com";
  }

  formatDistance(distanceInMeters = 0) {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m`;
    }

    return `${(distanceInMeters / 1000).toFixed(1)} km`;
  }

  formatDuration(durationInSeconds = 0) {
    const minutes = Math.round(durationInSeconds / 60);

    if (minutes < 60) {
      return `${minutes} mins`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} mins`;
  }

  parseLatLng(location) {
    if (typeof location !== "string") {
      return null;
    }

    const coordinateRegex =
      /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
    const match = location.match(coordinateRegex);

    if (!match) {
      return null;
    }

    const lat = Number(match[1]);
    const lng = Number(match[2]);

    const isValidLat = lat >= -90 && lat <= 90;
    const isValidLng = lng >= -180 && lng <= 180;

    if (!isValidLat || !isValidLng) {
      return null;
    }

    return { lat, lng };
  }

  async geocodeAddress(address, options = {}) {
    const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;

    const params = {
      access_token: this.apiKey,
      autocomplete: options.autocomplete ?? false,
      limit: options.limit ?? 1,
      language: options.language ?? "en",
    };

    if (options.country !== null) {
      params.country = options.country ?? "IN";
    }

    const response = await axios.get(url, {
      params,
    });

    return response.data;
  }

  async resolveLocation(location) {
    if (typeof location !== "string") {
      throw new Error("Origin and destination must be strings");
    }

    const cleanedLocation = location.trim();

    if (!cleanedLocation) {
      throw new Error("Origin and destination cannot be empty");
    }

    const parsed = this.parseLatLng(cleanedLocation);

    if (parsed) {
      return parsed;
    }

    const coordinates = await this.getCoordinates(cleanedLocation);

    return {
      lat: coordinates.lat,
      lng: coordinates.lng,
    };
  }

  async fetchDirections(origin, destination, waypoints = []) {
    const originCoordinate = await this.resolveLocation(origin);
    const destinationCoordinate = await this.resolveLocation(destination);

    const waypointCoordinates = await Promise.all(
      waypoints.map((waypoint) => this.resolveLocation(waypoint))
    );

    const coordinatePath = [
      originCoordinate,
      ...waypointCoordinates,
      destinationCoordinate,
    ]
      .map((point) => `${point.lng},${point.lat}`)
      .join(";");

    const url = `${this.baseUrl}/directions/v5/mapbox/driving/${coordinatePath}`;
    const response = await axios.get(url, {
      params: {
        access_token: this.apiKey,
        alternatives: false,
        geometries: "geojson",
        overview: "full",
        steps: true,
      },
    });

    const route = response.data?.routes?.[0];

    if (!route) {
      throw new Error("No route found for the given points");
    }

    return route;
  }

  getRouteBounds(geometry) {
    const coordinates = geometry?.coordinates ?? [];

    if (!coordinates.length) {
      return null;
    }

    let minLat = coordinates[0][1];
    let maxLat = coordinates[0][1];
    let minLng = coordinates[0][0];
    let maxLng = coordinates[0][0];

    for (const [lng, lat] of coordinates) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }

    return {
      northeast: { lat: maxLat, lng: maxLng },
      southwest: { lat: minLat, lng: minLng },
    };
  }

  // ============================================
  // GET ADDRESS SUGGESTIONS (Places Autocomplete API)
  // ============================================
  // Purpose: Get location predictions as user types
  //
  // Flow:
  // 1. Call Google Places Autocomplete API
  // 2. Parse and format suggestions
  // 3. Return array of suggestions with place_id
  //
  // Parameters:
  //   - input: String - User's search query
  //
  // Returns: Array of address suggestions
  async getAddressSuggestions(input) {
    try {
      const cleanedInput = input.trim();

      const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(cleanedInput)}.json`;
      const params = {
        access_token: this.apiKey,
        autocomplete: true,
        limit: 8,
        language: "en",
        country: "IN",
        fuzzyMatch: true,
        routing: true,
        types: "poi,address,place,locality,neighborhood",
      };

      const response = await axios.get(url, { params });
      const data = response.data;

      const suggestions = (data.features || []).map((feature) => ({
        placeId: feature.id,
        description: feature.place_name,
        mainText: feature.text || feature.place_name,
        secondaryText: feature.place_name
          ? feature.place_name.replace(`${feature.text}, `, "")
          : "",
        coordinates: {
          lat: feature.center[1],
          lng: feature.center[0],
        },
      }));

      return suggestions;
    } catch (error) {
      throw new Error(`Failed to get address suggestions: ${error.message}`);
    }
  }

  // ============================================
  // GET COORDINATES (Geocoding API)
  // ============================================
  // Purpose: Convert address to lat/lng coordinates
  //
  // Flow:
  // 1. Call Google Geocoding API
  // 2. Extract lat/lng from response
  // 3. Return coordinates object
  //
  // Parameters:
  //   - address: String - Full address to geocode
  //
  // Returns: Object with lat, lng, formatted_address
  async getCoordinates(address) {
    try {
      const cleanedAddress = address.trim();

      let data = await this.geocodeAddress(cleanedAddress, {
        autocomplete: false,
        limit: 1,
        country: "IN",
      });

      if (!data.features || data.features.length === 0) {
        data = await this.geocodeAddress(cleanedAddress, {
          autocomplete: false,
          limit: 1,
          country: null,
        });
      }

      if (data.features && data.features.length > 0) {
        const result = data.features[0];
        return {
          lat: result.center[1],
          lng: result.center[0],
          formattedAddress: result.place_name,
        };
      }

      throw new Error("No results found for the given address");
    } catch (error) {
      throw new Error(`Failed to get coordinates: ${error.message}`);
    }
  }

  // ============================================
  // GET DISTANCE AND TIME (Distance Matrix API)
  // ============================================
  // Purpose: Calculate distance and time between two points
  //
  // Flow:
  // 1. Call Google Distance Matrix API
  // 2. Extract distance and duration
  // 3. Return formatted result
  //
  // Parameters:
  //   - origin: String - "lat,lng" or address
  //   - destination: String - "lat,lng" or address
  //
  // Returns: Object with distance, duration
  async getDistanceTime(origin, destination) {
    try {
      const route = await this.fetchDirections(origin, destination);

      return {
        distance: {
          text: this.formatDistance(route.distance),
          value: Math.round(route.distance),
        },
        duration: {
          text: this.formatDuration(route.duration),
          value: Math.round(route.duration),
        },
      };
    } catch (error) {
      throw new Error(`Failed to calculate distance and time: ${error.message}`);
    }
  }

  // ============================================
  // CALCULATE FARE
  // ============================================
  // Purpose: Calculate ride fare based on distance, time, vehicle type
  //
  // Flow:
  // 1. Get distance and time from Distance Matrix API
  // 2. Apply fare calculation logic
  // 3. Return fare breakdown
  //
  // Parameters:
  //   - origin: String - "lat,lng" or address
  //   - destination: String - "lat,lng" or address
  //   - vehicleType: String - CAR, BIKE, AUTO, etc.
  //
  // Returns: Object with fare breakdown
  async calculateFare(origin, destination, vehicleType = "CAR") {
    try {
      // Step 1: Get distance and time
      const { distance, duration } = await this.getDistanceTime(
        origin,
        destination
      );

      // Step 2: Define pricing structure
      const pricing = {
        CAR: {
          baseFare: 50,
          perKm: 12,
          perMin: 2,
        },
        BIKE: {
          baseFare: 30,
          perKm: 8,
          perMin: 1.5,
        },
        AUTO: {
          baseFare: 40,
          perKm: 10,
          perMin: 1.8,
        },
        E_RICKSHAW: {
          baseFare: 25,
          perKm: 6,
          perMin: 1,
        },
        ELECTRIC_SCOOTER: {
          baseFare: 35,
          perKm: 9,
          perMin: 1.5,
        },
      };

      const vehiclePricing = pricing[vehicleType] || pricing.CAR;

      // Step 3: Calculate fare
      const distanceKm = distance.value / 1000;
      const durationMin = duration.value / 60;

      const distanceFare = distanceKm * vehiclePricing.perKm;
      const timeFare = durationMin * vehiclePricing.perMin;
      const subtotal = vehiclePricing.baseFare + distanceFare + timeFare;

      // Apply taxes and fees
      const gst = subtotal * 0.05; // 5% GST
      const platformFee = 10;
      const total = subtotal + gst + platformFee;

      return {
        vehicleType,
        distance: distance.text,
        duration: duration.text,
        breakdown: {
          baseFare: vehiclePricing.baseFare,
          distanceFare: Math.round(distanceFare * 100) / 100,
          timeFare: Math.round(timeFare * 100) / 100,
          subtotal: Math.round(subtotal * 100) / 100,
          gst: Math.round(gst * 100) / 100,
          platformFee,
          total: Math.round(total * 100) / 100,
        },
      };
    } catch (error) {
      throw new Error(`Failed to calculate fare: ${error.message}`);
    }
  }

  // ============================================
  // GET ROUTE (Directions API)
  // ============================================
  // Purpose: Get detailed route with polyline for map rendering
  //
  // Flow:
  // 1. Call Google Directions API
  // 2. Extract route details, polyline
  // 3. Return formatted route
  //
  // Parameters:
  //   - origin: String - "lat,lng" or address
  //   - destination: String - "lat,lng" or address
  //   - waypoints: Array - Optional waypoints
  //
  // Returns: Object with route details and polyline
  async getRoute(origin, destination, waypoints = []) {
    try {
      const route = await this.fetchDirections(origin, destination, waypoints);
      const steps = (route.legs || []).flatMap((leg) =>
        (leg.steps || []).map((step) => ({
          distance: {
            text: this.formatDistance(step.distance),
            value: Math.round(step.distance),
          },
          duration: {
            text: this.formatDuration(step.duration),
            value: Math.round(step.duration),
          },
          instruction:
            step.maneuver?.instruction || step.name || "Continue straight",
        }))
      );

      return {
        distance: {
          text: this.formatDistance(route.distance),
          value: Math.round(route.distance),
        },
        duration: {
          text: this.formatDuration(route.duration),
          value: Math.round(route.duration),
        },
        polyline: route.geometry,
        geometry: route.geometry,
        steps,
        bounds: this.getRouteBounds(route.geometry),
      };
    } catch (error) {
      throw new Error(`Failed to get route: ${error.message}`);
    }
  }
}

export const mapsService = new MapsService();
