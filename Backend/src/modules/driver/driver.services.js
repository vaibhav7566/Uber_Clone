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
    const count = await Driver.countDocuments({ userId }); // Ye line user find karke count bata rahi hai - basically ye check kar rahi hai ki userId wala driver profile already exist karta hai ya nahi.

    if (count > 0) {
      throw new Error("Driver profile already exists");
    }

    console.log("Received profile data:", profileData);
    // ============================================
    // STEP 2: Structure data according to model schema
    // ============================================
    const driverData = {
      userId,

      personalInformation: {
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
    const driver = new Driver(driverData); // Ye line driverData ko use karke ek naya Driver document create kar rahi hai. Abhi ye document database mein save nahi hua hai, bas ek instance ban gaya hai.
    await driver.save(); // Ye line driver document ko database mein save kar rahi hai. Jab ye line execute hoti hai, tabhi database mein ek naya record create hota hai.
    await driver.populate("userId", "name email phone role"); // Ye line driver document ke userId field ko populate kar rahi hai. Populate ka matlab hai ki userId field mein jo ObjectId stored hai, uske corresponding User document ko fetch karke uske name, email, phone, aur role fields ko driver document ke userId field mein embed kar dena.

    // ============================================
    // STEP 4: Return formatted response
    // ============================================
    // NOTE: User role will remain RIDER until admin verifies
    // Role will be upgraded to DRIVER when isVerified = true
    return this.formatDriverResponse(driver);
  }





  // ============================================
    // FORMAT DRIVER RESPONSE
    // ============================================
    // Purpose: Format driver data for API response
    // Masks Aadhar number for security
    // Includes user basic info
    //
    // Parameters:
    //   - driver: Driver document from database
    //
    // Returns: Formatted object for API response
    //
    // Security:
    //   - Aadhar is masked (XXXX XXXX 9012)
    //   - Only necessary user fields included
    formatDriverResponse(driver) {
        return {
            // Driver ID
            _id: driver._id,

            // User basic info (from populated userId)
            user: {
                _id: driver.userId._id,
                name: driver.userId.name,
                email: driver.userId.email,
                phone: driver.userId.phone
            },

            // Personal information
            personalInformation: {
                languagePreference: driver.personalInformation.languagePreference,
                city: driver.personalInformation.city,
                profilePicture: driver.personalInformation.profilePicture,
                aadharNumber: driver.getMaskedAadhar()  // MASKED: XXXX XXXX 9012
            },

            // Documents
            documents: {
                licenseNumber: driver.documents.licenseNumber,
                licenseExpiry: driver.documents.licenseExpiry,
                rcNumber: driver.documents.rcNumber,
                rcExpiry: driver.documents.rcExpiry
            },

            // Vehicle information
            vehicleInfo: {
                vehicleType: driver.vehicleInfo.vehicleType,
                vehicleNumber: driver.vehicleInfo.vehicleNumber,
                vehicleModel: driver.vehicleInfo.vehicleModel,
                vehicleColor: driver.vehicleInfo.vehicleColor
            },

            // Status
            status: {
                isOnline: driver.status.isOnline,
                isVerified: driver.status.isVerified,
                profileCompletionPercentage: driver.status.profileCompletionPercentage
            },

            // Statistics
            stats: {
                rating: driver.stats.rating,
                totalRides: driver.stats.totalRides
            },

            // Timestamps
            createdAt: driver.createdAt,
            updatedAt: driver.updatedAt
        };
    }

}





export const driverService = new DriverService();