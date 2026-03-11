import { z } from "zod";

// ============================================
// MAPS VALIDATION SCHEMAS
// ============================================
// Validates request data for Google Maps API calls

// ============================================
// ADDRESS SUGGESTIONS SCHEMA
// ============================================
// Validates query params for Places Autocomplete API
export const addressSuggestionsSchema = z.object({
  query: z.object({
    input: z
      .string({
        required_error: "Search input is required",
      })
      .min(1, "Search input cannot be empty")
      .trim(),

    sessionToken: z
      .string()
      .optional()
      .describe("Session token for billing purposes"),
  }),
});

// ============================================
// COORDINATES SCHEMA
// ============================================
// Validates query params for Geocoding API
export const coordinatesSchema = z.object({
  query: z.object({
    address: z
      .string({
        required_error: "Address is required",
      })
      .min(3, "Address must be at least 3 characters")
      .trim(),
  }),
});

// ============================================
// DISTANCE & TIME SCHEMA
// ============================================
// Validates request body for Distance Matrix API
export const distanceTimeSchema = z.object({
  body: z.object({
    origin: z
      .string({
        required_error: "Origin is required",
      })
      .min(1, "Origin cannot be empty")
      .trim()
      .describe("Origin as 'lat,lng' or address"),

    destination: z
      .string({
        required_error: "Destination is required",
      })
      .min(1, "Destination cannot be empty")
      .trim()
      .describe("Destination as 'lat,lng' or address"),
  }),
});

// ============================================
// FARE CALCULATION SCHEMA
// ============================================
// Validates request body for fare calculation
export const fareCalculationSchema = z.object({
  body: z.object({
    origin: z
      .string({
        required_error: "Origin is required",
      })
      .min(1, "Origin cannot be empty")
      .trim(),

    destination: z
      .string({
        required_error: "Destination is required",
      })
      .min(1, "Destination cannot be empty")
      .trim(),

    vehicleType: z
      .enum(["CAR", "BIKE", "AUTO", "E_RICKSHAW", "ELECTRIC_SCOOTER"], {
        required_error: "Vehicle type is required",
        invalid_type_error: "Invalid vehicle type",
      })
      .optional()
      .default("CAR"),
  }),
});

// ============================================
// ROUTE SCHEMA
// ============================================
// Validates request body for Directions API
export const routeSchema = z.object({
  body: z.object({
    origin: z
      .string({
        required_error: "Origin is required",
      })
      .min(1, "Origin cannot be empty")
      .trim(),

    destination: z
      .string({
        required_error: "Destination is required",
      })
      .min(1, "Destination cannot be empty")
      .trim(),

    waypoints: z
      .array(z.string())
      .optional()
      .default([])
      .describe("Optional waypoints as array of 'lat,lng' or addresses"),
  }),
});
