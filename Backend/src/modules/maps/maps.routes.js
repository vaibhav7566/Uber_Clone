import express from "express";
import { authenticate } from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/auth.validate.js";
import {
  getAddressSuggestions,
  getCoordinates,
  getDistanceTime,
  calculateFare,
  getRoute,
} from "./maps.controllers.js";
import {
  addressSuggestionsSchema,
  coordinatesSchema,
  distanceTimeSchema,
  fareCalculationSchema,
  routeSchema,
} from "./maps.validation.js";

const router = express.Router();

// ============================================
// MAPS ROUTES
// ============================================
// Base path: /api/maps (mounted in app.js)
// All routes require authentication
//
// Google Maps APIs Integration:
// 1️⃣ Places API → Location suggestions
// 2️⃣ Geocoding API → Address ↔ Coordinates
// 3️⃣ Directions API → Route + Distance
// 4️⃣ Distance Matrix API → Fare calculation
// 5️⃣ Maps JavaScript API → Frontend map render

// ============================================
// GET ADDRESS SUGGESTIONS (Places API)
// ============================================
// GET /api/maps/suggestions?input=kolkata
// Access: Private (Authenticated users)
// Purpose: Get location suggestions as user types
//
// Middleware Chain:
// 1. authenticate → Verify JWT token
// 2. validate(addressSuggestionsSchema) → Validate query params
// 3. getAddressSuggestions → Handle request
//
// Test in Postman:
// Method: GET
// URL: http://localhost:5000/api/maps/suggestions?input=kolkata&sessionToken=abc123
// Headers:
//   {
//     "Authorization": "Bearer <token>"
//   }
router.get(
  "/suggestions",
  authenticate,
  validate(addressSuggestionsSchema),
  getAddressSuggestions
);

// ============================================
// GET COORDINATES (Geocoding API)
// ============================================
// GET /api/maps/coordinates?address=Kolkata,India
// Access: Private (Authenticated users)
// Purpose: Convert address to lat/lng coordinates
//
// Middleware Chain:
// 1. authenticate → Verify JWT token
// 2. validate(coordinatesSchema) → Validate query params
// 3. getCoordinates → Handle request
//
// Test in Postman:
// Method: GET
// URL: http://localhost:5000/api/maps/coordinates?address=Kolkata,India
// Headers:
//   {
//     "Authorization": "Bearer <token>"
//   }
router.get(
  "/coordinates",
  authenticate,
  validate(coordinatesSchema),
  getCoordinates
);

// ============================================
// GET DISTANCE & TIME (Distance Matrix API)
// ============================================
// POST /api/maps/distance-time
// Access: Private (Authenticated users)
// Purpose: Calculate distance and time between two points
//
// Middleware Chain:
// 1. authenticate → Verify JWT token
// 2. validate(distanceTimeSchema) → Validate request body
// 3. getDistanceTime → Handle request
//
// Test in Postman:
// Method: POST
// URL: http://localhost:5000/api/maps/distance-time
// Headers:
//   {
//     "Authorization": "Bearer <token>",
//     "Content-Type": "application/json"
//   }
// Body (JSON):
//   {
//     "origin": "22.5726,88.3639",
//     "destination": "22.5744,88.3629"
//   }
router.post(
  "/distance-time",
  authenticate,
  validate(distanceTimeSchema),
  getDistanceTime
);

// ============================================
// CALCULATE FARE (Distance Matrix + Pricing Logic)
// ============================================
// POST /api/maps/calculate-fare
// Access: Private (Authenticated users)
// Purpose: Calculate ride fare based on distance, time, and vehicle type
//
// Middleware Chain:
// 1. authenticate → Verify JWT token
// 2. validate(fareCalculationSchema) → Validate request body
// 3. calculateFare → Handle request
//
// Test in Postman:
// Method: POST
// URL: http://localhost:5000/api/maps/calculate-fare
// Headers:
//   {
//     "Authorization": "Bearer <token>",
//     "Content-Type": "application/json"
//   }
// Body (JSON):
//   {
//     "origin": "22.5726,88.3639",
//     "destination": "22.5744,88.3629",
//     "vehicleType": "CAR"
//   }
router.post(
  "/calculate-fare",
  authenticate,
  validate(fareCalculationSchema),
  calculateFare
);

// ============================================
// GET ROUTE (Directions API)
// ============================================
// POST /api/maps/route
// Access: Private (Authenticated users)
// Purpose: Get detailed route with polyline for map rendering
//
// Middleware Chain:
// 1. authenticate → Verify JWT token
// 2. validate(routeSchema) → Validate request body
// 3. getRoute → Handle request
//
// Test in Postman:
// Method: POST
// URL: http://localhost:5000/api/maps/route
// Headers:
//   {
//     "Authorization": "Bearer <token>",
//     "Content-Type": "application/json"
//   }
// Body (JSON):
//   {
//     "origin": "22.5726,88.3639",
//     "destination": "22.5744,88.3629",
//     "waypoints": ["22.5730,88.3635"]
//   }
router.post(
  "/route",
  authenticate,
  validate(routeSchema),
  getRoute
);

// ============================================
// EXPORT ROUTER
// ============================================
export default router;
