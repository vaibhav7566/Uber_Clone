import { mapsService } from "./maps.services.js";

// ============================================
// MAPS CONTROLLER - HTTP Request/Response Layer
// ============================================

/**
 * @swagger
 * tags:
 *   name: Maps
 *   description: Google Maps API integration for location services
 */

// ============================================
// GET ADDRESS SUGGESTIONS
// ============================================
// Uses Google Places Autocomplete API
// Returns location predictions as user types
async function getAddressSuggestions(req, res) {
  try {
    const { input, sessionToken } = req.query;

    const suggestions = await mapsService.getAddressSuggestions(
      input,
      sessionToken
    );

    return res.status(200).json({
      success: true,
      message: "Address suggestions fetched successfully",
      data: suggestions,
    });
  } catch (error) {
    console.error("Error in getAddressSuggestions:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch address suggestions",
    });
  }
}

// ============================================
// GET COORDINATES FROM ADDRESS
// ============================================
// Uses Google Geocoding API
// Converts address string to lat/lng coordinates
async function getCoordinates(req, res) {
  try {
    const { address } = req.query;

    const coordinates = await mapsService.getCoordinates(address);

    return res.status(200).json({
      success: true,
      message: "Coordinates fetched successfully",
      data: coordinates,
    });
  } catch (error) {
    console.error("Error in getCoordinates:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch coordinates",
    });
  }
}

// ============================================
// GET DISTANCE AND TIME
// ============================================
// Uses Google Distance Matrix API
// Returns distance and duration between two points
async function getDistanceTime(req, res) {
  try {
    const { origin, destination } = req.body;

    const result = await mapsService.getDistanceTime(origin, destination);

    return res.status(200).json({
      success: true,
      message: "Distance and time calculated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getDistanceTime:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate distance and time",
    });
  }
}

// ============================================
// CALCULATE FARE
// ============================================
// Uses Distance Matrix API + Custom fare logic
// Returns fare breakdown for different vehicle types
async function calculateFare(req, res) {
  try {
    const { origin, destination, vehicleType } = req.body;

    const fareDetails = await mapsService.calculateFare(
      origin,
      destination,
      vehicleType
    );

    return res.status(200).json({
      success: true,
      message: "Fare calculated successfully",
      data: fareDetails,
    });
  } catch (error) {
    console.error("Error in calculateFare:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate fare",
    });
  }
}

// ============================================
// GET ROUTE
// ============================================
// Uses Google Directions API
// Returns detailed route with polyline for map rendering
async function getRoute(req, res) {
  try {
    const { origin, destination, waypoints } = req.body;

    const route = await mapsService.getRoute(origin, destination, waypoints);

    return res.status(200).json({
      success: true,
      message: "Route fetched successfully",
      data: route,
    });
  } catch (error) {
    console.error("Error in getRoute:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch route",
    });
  }
}

// ============================================
// EXPORT CONTROLLERS
// ============================================
export {
  getAddressSuggestions,
  getCoordinates,
  getDistanceTime,
  calculateFare,
  getRoute,
};
