import { Driver } from "../model/driver.model.js";


// ============================================
// DRIVER SERVICE - Business Logic Layer
// ============================================
// Contains all driver-related business logic
// Controllers call these functions
// Handles validation, data transformation, and orchestration
//
// Architecture Layers:
// 1. Controller (HTTP layer) → Handles requests/responses
// 2. Service (Business logic) → Validates and orchestrates
// 3. Repository (Database layer) → Executes database queries
//
// This is the Service layer (middle layer)

class DriverService {
  // ============================================
  // CREATE DRIVER PROFILE
  // ============================================
  // Purpose: Create driver profile after user signup
  //
  // Flow:
  // 1. Check if driver profile already exists
  // 2. If exists → throw error (one profile per user)
  // 3. Upgrade user role to DRIVER
  // 4. Structure data according to model schema
  // 5. Create profile in database via repository
  // 6. Profile completion % auto-calculated by model hook
  // 7. Return formatted driver data with masked Aadhar
  //
  // Parameters:
  //   - userId: ObjectId of User
  //   - profileData: Object with driver information
  //
  // Returns: Formatted driver profile
  //
  // Throws:
  //   - Error if profile already exists
  async createProfile(userId, profileData) {
    // ============================================
    // STEP 1: Check if profile already exists
    // ============================================
    const count = await Driver.countDocuments({ userId });

    if (count > 0) {
      throw new Error("Driver profile already exists");
    }

    // ============================================
    // STEP 2: Structure data according to model schema
    // ============================================
    const driverData = {
      userId,

      personalInfo: {
        languagePreference: profileData.languagePreference,
        city: profileData.city,
        aadharNumber: profileData.aadharNumber,
        profilePicture: profileData.profilePicture || null,
      },

      documents: {
        licenseNumber: profileData.licenseNumber,
        licenseExpiry: profileData.licenseExpiry || null,
        rcNumber: profileData.rcNumber,
        rcExpiry: profileData.rcExpiry || null,
      },

      vehicleInfo: {
        vehicleType: profileData.vehicleType,
        vehicleNumber: profileData.vehicleNumber || null,
        vehicleModel: profileData.vehicleModel || null,
        vehicleColor: profileData.vehicleColor || null,
      },
    };

    // ============================================
    // STEP 3: Create profile in database
    // ============================================
    const driver = new Driver(driverData);
    await driver.save();
    await driver.populate("userId", "name email phone role");

    // ============================================
    // STEP 4: Return formatted response
    // ============================================
    // NOTE: User role will remain RIDER until admin verifies
    // Role will be upgraded to DRIVER when isVerified = true
    return this.formatDriverResponse(driver);
  }

}


export const driverService = new DriverService();