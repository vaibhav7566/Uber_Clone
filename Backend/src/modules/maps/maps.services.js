import axios from "axios";
import { env } from "../../config/env.js";

// ============================================
// MAPS SERVICE - Business Logic Layer
// ============================================
// Handles all Google Maps API integrations
// Contains business logic for location services

class MapsService {
  constructor() {
    // Google Maps API Key from environment variables
    this.apiKey = env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = "https://maps.googleapis.com/maps/api";
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
  //   - sessionToken: String - Session token for billing
  //
  // Returns: Array of address suggestions
  async getAddressSuggestions(input, sessionToken) {
    try {
      // TODO: Implement Google Places Autocomplete API call
      // const url = `${this.baseUrl}/place/autocomplete/json?input=${input}&key=${this.apiKey}&sessiontoken=${sessionToken}`;
      // const response = await fetch(url);
      // const data = await response.json();

      // Dummy data for now
      const suggestions = [
        {
          placeId: "ChIJZ_YISduC4joRM0Ar6I8I",
          description: `${input}, Kolkata, West Bengal, India`,
          mainText: input,
          secondaryText: "Kolkata, West Bengal, India",
        },
        {
          placeId: "ChIJZ_YISduC4joRM0Ar6I8J",
          description: `${input} Park, Kolkata, India`,
          mainText: `${input} Park`,
          secondaryText: "Kolkata, India",
        },
      ];

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
      const url = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
      const response = await axios.get(url);
      const data = response.data;

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const coordinates = {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formattedAddress: result.formatted_address,
        };
        return coordinates;
      } else {
        throw new Error('No results found for the given address');
      }
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
      // TODO: Implement Google Distance Matrix API call
      // const url = `${this.baseUrl}/distancematrix/json?origins=${origin}&destinations=${destination}&key=${this.apiKey}`;
      // const response = await fetch(url);
      // const data = await response.json();

      // Dummy data for now
      const result = {
        distance: {
          text: "5.2 km",
          value: 5200, // meters
        },
        duration: {
          text: "15 mins",
          value: 900, // seconds
        },
      };

      return result;
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
      // TODO: Implement Google Directions API call
      // let url = `${this.baseUrl}/directions/json?origin=${origin}&destination=${destination}&key=${this.apiKey}`;
      // if (waypoints.length > 0) {
      //   url += `&waypoints=${waypoints.join('|')}`;
      // }
      // const response = await fetch(url);
      // const data = await response.json();

      // Dummy data for now
      const route = {
        distance: {
          text: "5.2 km",
          value: 5200,
        },
        duration: {
          text: "15 mins",
          value: 900,
        },
        polyline: "dummy_encoded_polyline_string",
        steps: [
          {
            distance: { text: "0.5 km", value: 500 },
            duration: { text: "2 mins", value: 120 },
            instruction: "Head north on Main St",
          },
          {
            distance: { text: "2.0 km", value: 2000 },
            duration: { text: "5 mins", value: 300 },
            instruction: "Turn right onto Park Ave",
          },
        ],
        bounds: {
          northeast: { lat: 22.5744, lng: 88.3639 },
          southwest: { lat: 22.5726, lng: 88.3629 },
        },
      };

      return route;
    } catch (error) {
      throw new Error(`Failed to get route: ${error.message}`);
    }
  }
}

export const mapsService = new MapsService();
