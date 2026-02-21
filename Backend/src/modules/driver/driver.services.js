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
    await driver.populate("userId", "name email phone role"); // Ye line driver document ke userId field ko populate kar rahi hai. Populate ka matlab hai ki userId field mein jo ObjectId stored hai, uske corresponding User document ko fetch (matlab response me dikha do) karke uske name, email, phone, aur role fields ko driver document ke userId field mein embed kar dena.  Matlab: userId se → Complete info (sirf API response ke liye, DB same rehta hai!) 🔥

    // ============================================
    // STEP 4: Return formatted response
    // ============================================
    // NOTE: User role will remain RIDER until admin verifies
    // Role will be upgraded to DRIVER when isVerified = true
    return this.formatDriverResponse(driver);
  }

  // ============================================
  // GET PROFILE COMPLETION DETAILS
  // ============================================
  // Purpose: Show driver what fields are missing
  //
  // Flow:
  // 1. Find driver profile
  // 2. Get missing fields from model method
  // 3. Return completion details
  //
  // Parameters:
  //   - userId: ObjectId of User
  //
  // Returns: Object with completion percentage, missing fields, and status
  //
  // Throws:
  //   - Error if profile not found
  async getProfileCompletion(userId) {
    // ============================================
    // STEP 1: Find driver profile
    // ============================================
    // Find driver where userId matches
    // Populate userId with User data (name, email, phone, role)
    // Returns null if not found
    const driver = await Driver.findOne({ userId }).populate(
      "userId",
      "name email phone role",
    ); // Ye line database mein Driver collection ko query kar rahi hai, jahan userId field userId parameter ke barabar ho. Agar aisa driver profile milta hai, to uske userId field ko populate kar diya jata hai, jiska matlab hai ki userId field mein jo ObjectId stored hai, uske corresponding User document ko fetch karke uske name, email, phone, aur role fields ko driver document ke userId field mein embed kar dena. Agar aisa driver profile nahi milta hai, to driver variable null ho jayega.

    if (!driver) {
      // Profile not found
      throw new Error("Driver profile not found");
    }

    // ============================================
    // STEP 2: Return completion details
    // ============================================
    return {
      completionPercentage: driver.status.profileCompletionPercentage, // 0-100
      missingFields: driver.getMissingFields(), // Array of missing optional fields
      canGoOnline: driver.canGoOnline(), // Boolean (can driver go online?)
      isVerified: driver.status.isVerified, // Boolean (is admin verified?)
    };
  }

  // ============================================
  // UPDATE DRIVER STATUS (ONLINE/OFFLINE)
  // ============================================
  // Purpose: Toggle driver availability
  //
  // Flow:
  // 1. Find driver profile
  // 2. Check if driver can go online (profile >= 70% + verified)
  // 3. Update status in database
  // 4. Return updated profile
  //
  // Parameters:
  //   - userId: ObjectId of User
  //   - isOnline: Boolean (true = online, false = offline)
  //
  // Returns: Updated formatted driver profile
  //
  // Throws:
  //   - Error if profile not found
  //   - Error if profile < 70% complete
  //   - Error if not verified by admin
  async updateStatus(userId, isOnline) {
    // ============================================
    // STEP 1: Find driver profile
    // ============================================
    // Find driver where userId matches
    // Populate userId with User data (name, email, phone, role)
    // Returns null if not found
    const driver = await Driver.findOne({ userId }).populate(
      "userId",
      "name email phone role",
    );

    if (!driver) {
      // Profile not found → cannot update status
      throw new Error("Driver profile not found");
    }

    // ============================================
    // STEP 2: Check if driver can go online
    // ============================================
    // Only check if driver is trying to go online
    // No restrictions for going offline
    if (isOnline && !driver.canGoOnline()) {
      // Driver cannot go online → check why

      // Reason 1: Profile not complete enough
      if (driver.status.profileCompletionPercentage < 70) {
        throw new Error("Profile must be at least 70% complete to go online");
      }

      // Reason 2: Not verified by admin
      if (!driver.status.isVerified) {
        throw new Error(
          "Your profile is pending verification. Please wait for admin approval.",
        );
      }
    }

    // ============================================
    // STEP 3: Update status in database
    // ============================================
    // Find driver by userId and update isOnline field
    // $set: Update only isOnline field
    // new: true → Return updated document
    const updatedDriver = await Driver.findOneAndUpdate(
      { userId }, // Find condition
      { $set: { "status.isOnline": isOnline } }, // Update isOnline field
      { new: true }, // Return updated document
    ).populate("userId", "name email phone role");

    // ============================================
    // STEP 4: Return formatted response
    // ============================================
    return this.formatDriverResponse(updatedDriver);
  }

  // ============================================
  // GET DRIVER PROFILE
  // ============================================
  // Purpose: Get driver's own profile
  //
  // Flow:
  // 1. Find driver by userId via repository
  // 2. If not found → throw error
  // 3. Return formatted profile with masked Aadhar
  //
  // Parameters:
  //   - userId: ObjectId of User
  //
  // Returns: Formatted driver profile
  //
  // Throws:
  //   - Error if profile not found
  async getProfile(userId) {
    // ============================================
    // STEP 1: Find driver by userId
    // ============================================
    // Find driver where userId matches
    // Populate userId with User data (name, email, phone, role)
    // Returns null if not found
    const driver = await Driver.findOne({ userId }).populate(
      "userId",
      "name email phone role",
    );

    // ============================================
    // STEP 2: Check if driver exists
    // ============================================
    if (!driver) {
      // Profile not found → user needs to create profile first
      throw new Error(
        "Driver profile not found. Please create your profile first.",
      );
    }

    // ============================================
    // STEP 3: Return formatted response
    // ============================================
    return this.formatDriverResponse(driver);
  }

  // ============================================
  // UPDATE DRIVER PROFILE
  // ============================================
  // Purpose: Update driver profile (optional fields)
  //
  // Flow:
  // 1. Check if profile exists
  // 2. Structure update data (only provided fields)
  // 3. Update in database via repository
  // 4. Profile completion % recalculated automatically
  // 5. Return updated profile
  //
  // Parameters:
  //   - userId: ObjectId of User
  //   - updateData: Object with fields to update
  //
  // Returns: Updated formatted driver profile
  //
  // Throws:
  //   - Error if profile not found
  async updateProfile(userId, updateData) {
    // ============================================
    // STEP 1: Check if profile exists
    // ============================================
    // Find driver where userId matches
    // Populate userId with User data (name, email, phone, role)
    const existingProfile = await Driver.findOne({ userId }).populate(
      "userId",
      "name email phone role",
    );

    if (!existingProfile) {
      // Profile not found → cannot update non-existent profile
      throw new Error(
        "Driver profile not found. Please create your profile first.",
      );
    }

    // ============================================
    // STEP 2: Structure update data
    // ============================================
    // Only update fields that are provided in request
    // Use dot notation for nested fields
    // Example: 'personalInfo.city' instead of { personalInfo: { city } }
    const updates = {};

    // Personal info updates
    if (updateData.languagePreference) {
      updates["personalInfo.languagePreference"] =
        updateData.languagePreference;
    }
    if (updateData.city) {
      updates["personalInfo.city"] = updateData.city;
    }
    if (updateData.profilePicture) {
      updates["personalInfo.profilePicture"] = updateData.profilePicture;
    }

    // Document updates
    if (updateData.licenseExpiry) {
      updates["documents.licenseExpiry"] = updateData.licenseExpiry;
    }
    if (updateData.rcExpiry) {
      updates["documents.rcExpiry"] = updateData.rcExpiry;
    }

    // Vehicle info updates
    if (updateData.vehicleNumber) {
      updates["vehicleInfo.vehicleNumber"] = updateData.vehicleNumber;
    }
    if (updateData.vehicleModel) {
      updates["vehicleInfo.vehicleModel"] = updateData.vehicleModel;
    }
    if (updateData.vehicleColor) {
      updates["vehicleInfo.vehicleColor"] = updateData.vehicleColor;
    }

    // ============================================
    // STEP 3: Update profile in database
    // ============================================
    // Find driver by userId and update
    // $set: Only update specified fields, keep others unchanged
    // new: true → Return updated document
    // runValidators: true → Validate updated data against schema
    const updatedDriver = await Driver.findOneAndUpdate(
      { userId }, // Find condition
      { $set: updates }, // Update operation
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validations
      },
    ).populate("userId", "name email phone role");

    // ============================================
    // STEP 4: Return formatted response
    // ============================================
    return this.formatDriverResponse(updatedDriver);
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
        phone: driver.userId.phone,
      },

      // Personal information
      personalInformation: {
        languagePreference: driver.personalInformation.languagePreference,
        city: driver.personalInformation.city,
        profilePicture: driver.personalInformation.profilePicture,
        aadharNumber: driver.getMaskedAadhar(), // MASKED: XXXX XXXX 9012
      },

      // Documents
      documents: {
        licenseNumber: driver.documents.licenseNumber,
        licenseExpiry: driver.documents.licenseExpiry,
        rcNumber: driver.documents.rcNumber,
        rcExpiry: driver.documents.rcExpiry,
      },

      // Vehicle information
      vehicleInfo: {
        vehicleType: driver.vehicleInfo.vehicleType,
        vehicleNumber: driver.vehicleInfo.vehicleNumber,
        vehicleModel: driver.vehicleInfo.vehicleModel,
        vehicleColor: driver.vehicleInfo.vehicleColor,
      },

      // Status
      status: {
        isOnline: driver.status.isOnline,
        isVerified: driver.status.isVerified,
        profileCompletionPercentage: driver.status.profileCompletionPercentage,
      },

      // Statistics
      stats: {
        rating: driver.stats.rating,
        totalRides: driver.stats.totalRides,
      },

      // Timestamps
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    };
  }
}

export const driverService = new DriverService();
