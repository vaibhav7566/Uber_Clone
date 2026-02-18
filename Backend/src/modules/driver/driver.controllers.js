import { driverService }  from "./driver.services.js";
// ============================================

// DRIVER CONTROLLER - HTTP Request/Response Layer
// ============================================
// Handles HTTP requests and responses
// No business logic - just calls service layer
// Uses try-catch blocks for error handling
//
// Architecture Layers:
// 1. Controller (THIS FILE) → Handles HTTP requests/responses
// 2. Service → Contains business logic
// 3. Repository → Handles database operations
//
// Responsibilities:
// - Extract data from request (req.body, req.params, req.user)
// - Call appropriate service method
// - Send HTTP response with proper status code
// - Error handling (via try-catch blocks)

// ============================================
// CREATE DRIVER PROFILE
// ============================================
// Endpoint: POST /api/driver/profile
// Access: Private (DRIVER only)
// Purpose: Create driver profile after signup
//
// Request Headers:
//   Authorization: Bearer <jwt_token>
//
// Request Body Example:
// {
//     "languagePreference": "HINDI",
//     "city": "MUMBAI",
//     "aadharNumber": "123456789012",
//     "licenseNumber": "MH1234567890",
//     "rcNumber": "MH01AB1234",
//     "vehicleType": "CAR",
//     "vehicleModel": "Honda City",        // Optional
//     "vehicleColor": "White",             // Optional
//     "profilePicture": "https://..."      // Optional
// }
//
// Response (201 Created):
// {
//     "success": true,
//     "data": { driver profile with 70% completion },
//     "message": "Driver profile created successfully"
// }
//
// Error Responses:
// - 400: Validation error (invalid data)
// - 401: Unauthorized (no token or invalid token)
// - 403: Forbidden (not DRIVER role)
// - 500: Server error

export const createProfile = async (req, res) => {
  try {
    // ============================================
    // STEP 1: Extract data from request
    // ============================================
    // req.user is set by authenticate middleware
    // Contains: _id, name, email, phone, role
    const userId = req.user._id;

    // req.body contains profile data
    // Already validated by validate middleware
    const profileData = req.body;

    // ============================================
    // STEP 2: Call service to create profile
    // ============================================
    // Service handles business logic
    // Returns formatted driver profile
    const driver = await driverService.createProfile(userId, profileData);
    // ============================================
    // STEP 3: Send success response
    // ============================================
    // Status 201: Created (resource successfully created)
    res.status(201).json({
      success: true,
      data: driver,
      message: "Driver profile created successfully",
    });
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    // Log error for debugging
    console.error("Error in createProfile:", error);

    // Send error response
    // Status 500: Internal Server Error
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create driver profile",
    });
  }
};
