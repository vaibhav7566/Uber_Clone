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
// Mapbox APIs Integration:
// 1️⃣ Geocoding API → Location suggestions
// 2️⃣ Geocoding API → Address ↔ Coordinates
// 3️⃣ Directions API → Route + Distance + Time
// 4️⃣ Custom pricing logic → Fare calculation
// 5️⃣ Mapbox GL JS / React Mapbox GL → Frontend map render

// ============================================
// GET ADDRESS SUGGESTIONS (Geocoding Autocomplete)
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
// URL: http://localhost:5000/api/maps/suggestions?input=kolkata
// Headers:
//   {
//     "Authorization": "Bearer <token>"
//   }


// {
//     "success": true,
//     "message": "Address suggestions fetched successfully",
//     "data": [
//         {
//             "placeId": "locality.236530283",
//             "description": "Awadhpuri, Bhopal, Bhopal, Madhya Pradesh, India",
//             "mainText": "Awadhpuri",
//             "secondaryText": "Bhopal, Bhopal, Madhya Pradesh, India",
//             "coordinates": {
//                 "lat": 23.229387,
//                 "lng": 77.4858
//             }
//         },
//         {
//             "placeId": "address.6481036084346654",
//             "description": "Vallabh nagar awadhpuri ، 462022 Bhopal، India",
//             "mainText": "Vallabh nagar awadhpuri",
//             "secondaryText": "Vallabh nagar awadhpuri ، 462022 Bhopal، India",
//             "coordinates": {
//                 "lat": 23.227904,
//                 "lng": 77.490136
//             }
//         },
//         {
//             "placeId": "address.575979964590810",
//             "description": "Awadhpuri Rd ، 462023 Bhopal، India",
//             "mainText": "Awadhpuri Rd",
//             "secondaryText": "Awadhpuri Rd ، 462023 Bhopal، India",
//             "coordinates": {
//                 "lat": 23.232325,
//                 "lng": 77.449311
//             }
//         },
//         {
//             "placeId": "address.7280512744983986",
//             "description": "Bhopal Bypass Road ، 462022 Bhopal، India",
//             "mainText": "Bhopal Bypass Road",
//             "secondaryText": "Bhopal Bypass Road ، 462022 Bhopal، India",
//             "coordinates": {
//                 "lat": 23.252634,
//                 "lng": 77.511114
//             }
//         },
//         {
//             "placeId": "locality.666126955",
//             "description": "Bhopalpura, Vijainagar, Anupgarh, Rajasthan, India",
//             "mainText": "Bhopalpura",
//             "secondaryText": "Vijainagar, Anupgarh, Rajasthan, India",
//             "coordinates": {
//                 "lat": 29.005093,
//                 "lng": 73.56606
//             }
//         },
//         {
//             "placeId": "address.862183103647808",
//             "description": "Near Bhopal ، 462026 Bhopal، India",
//             "mainText": "Near Bhopal",
//             "secondaryText": "Near Bhopal ، 462026 Bhopal، India",
//             "coordinates": {
//                 "lat": 23.207311,
//                 "lng": 77.456276
//             }
//         },
//         {
//             "placeId": "address.8314858118379190",
//             "description": "Opp. Bhopal ، 462016 Bhopal، India",
//             "mainText": "Opp. Bhopal",
//             "secondaryText": "Opp. Bhopal ، 462016 Bhopal، India",
//             "coordinates": {
//                 "lat": 23.2276,
//                 "lng": 77.434553
//             }
//         }
//     ]
// }
router.get(
  "/suggestions",
  authenticate,
  validate(addressSuggestionsSchema),
  getAddressSuggestions
);

// ============================================
// GET COORDINATES (Forward Geocoding)
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
// GET DISTANCE & TIME (Directions API)
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
//     "origin": "Bhopal,India",
//     "destination": "Indore,India"
//   }
router.post(
  "/distance-time",
  authenticate,
  validate(distanceTimeSchema),
  getDistanceTime
);

// ============================================
// CALCULATE FARE (Directions + Pricing Logic)
// ============================================
// POST /api/maps/calculate-fare
// Access: Private (Authenticated users)
// Purpose: Calculate ride fare based on distance and time for all vehicle types
//
// Middleware Chain:
// 1. authenticate → Verify JWT token
// 2. validate(fareCalculationSchema) → Validate query params
// 3. calculateFare → Handle request
//
// Test in Postman:
// Method: POST
// URL: http://localhost:5000/api/maps/calculate-fare/distance/time?origin=Bhopal,India&destination=Indore,India
// Headers:
//   {
//     "Authorization": "Bearer <token>"
//   }
router.post(
  "/calculate-fare/distance/time",
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
