import express from "express";
import {
  authenticate,
  authorizeRole,
} from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/auth.validate.js";
import {
  approveDriverSchema,
  createDriverProfileSchema,
  rejectDriverSchema,
  updateDriverProfileSchema,
  updateStatusSchema,
} from "./driver.validation.js";
import {
  approveDriver,
  createProfile,
  getPendingDrivers,
  getProfile,
  getProfileCompletion,
  rejectDriver,
  updateProfile,
  updateStatus,
} from "./driver.controllers.js";

const router = express.Router();

// ============================================
// DRIVER ROUTES
// ============================================
// All routes require authentication and DRIVER role
// Base path: /api/driver (mounted in app.js)
//
// Route Flow:
// 1. Request comes in
// 2. authenticate middleware → Verify JWT token
// 3. authorizeRole middleware → Check if user has DRIVER role
// 4. validate middleware → Validate request data (if applicable)
// 5. Controller function → Handle request
//
// Middleware Order Matters:
// - authenticate MUST come before authorizeRole (need user data first)
// - validate MUST come before controller (validate data first)

router.post(
  "/register",
  authenticate, // Middleware 1: Verify JWT token
  validate(createDriverProfileSchema), // Middleware 2: Validate request body
  createProfile, // Controller function
);

// ============================================
// GET PROFILE COMPLETION DETAILS
// ============================================
// GET /api/driver/me/completion
// Access: Private (DRIVER only)
// Purpose: See what fields are missing
//
// Middleware Chain:
// 1. authenticate → Verify JWT token, set req.user
// 2. authorizeRole('DRIVER') → Check if user.role === 'DRIVER'
// 3. getProfileCompletion → Handle request
//
// Test in Postman:
// Method: GET
// URL: http://localhost:5000/api/driver/me/completion
// Headers:
//   {
//     "Authorization": "Bearer <driver_token>"
//   }
router.get(
  "/me/completion",
  authenticate, // Middleware 1: Verify JWT token
  authorizeRole("DRIVER"), // Middleware 2: Only DRIVER role allowed
  getProfileCompletion, // Controller function
);

// ============================================
// UPDATE DRIVER STATUS (ONLINE/OFFLINE)
// ============================================
// PATCH /api/driver/me/status
// Access: Private (DRIVER only)
// Purpose: Toggle availability
//
// Middleware Chain:
// 1. authenticate → Verify JWT token, set req.user
// 2. authorizeRole('DRIVER') → Check if user.role === 'DRIVER'
// 3. validate(updateStatusSchema) → Validate request body
// 4. updateStatus → Handle request
//
// Test in Postman:
// Method: PATCH
// URL: http://localhost:5000/api/driver/me/status
// Headers:
//   {
//     "Authorization": "Bearer <driver_token>",
//     "Content-Type": "application/json"
//   }
// Body (JSON):
//   {
//     "isOnline": true
//   }
router.patch(
  "/me/status",
  authenticate, // Middleware 1: Verify JWT token
  authorizeRole("DRIVER"), // Middleware 2: Only DRIVER role allowed
  validate(updateStatusSchema), // Middleware 3: Validate request body
  updateStatus, // Controller function
);

// ============================================
// GET DRIVER PROFILE
// ============================================
// GET /api/driver/me
// Access: Private (DRIVER only)
// Purpose: Get logged-in driver's profile
//
// Middleware Chain:
// 1. authenticate → Verify JWT token, set req.user
// 2. authorizeRole('DRIVER') → Check if user.role === 'DRIVER'
// 3. getProfile → Handle request
//
// Test in Postman:
// Method: GET
// URL: http://localhost:5000/api/driver/me
// Headers:
//   {
//     "Authorization": "Bearer <driver_token>"
//   }
router.get(
  "/me",
  authenticate, // Middleware 1: Verify JWT token
  authorizeRole("DRIVER"), // Middleware 2: Only DRIVER role allowed
  getProfile, // Controller function
);

// ============================================
// UPDATE DRIVER PROFILE
// ============================================
// PATCH /api/driver/me
// Access: Private (DRIVER only)
// Purpose: Update optional fields
//
// Middleware Chain:
// 1. authenticate → Verify JWT token, set req.user
// 2. authorizeRole('DRIVER') → Check if user.role === 'DRIVER'
// 3. validate(updateDriverProfileSchema) → Validate request body
// 4. updateProfile → Handle request
//
// Test in Postman:
// Method: PATCH
// URL: http://localhost:5000/api/driver/me
// Headers:
//   {
//     "Authorization": "Bearer <driver_token>",
//     "Content-Type": "application/json"
//   }
// Body (JSON):
//   {
//     "vehicleModel": "Honda City",
//     "vehicleColor": "White",
//     "profilePicture": "https://example.com/pic.jpg"
//   }
router.patch(
  "/me",
  authenticate, // Middleware 1: Verify JWT token
  authorizeRole("DRIVER"), // Middleware 2: Only DRIVER role allowed
  validate(updateDriverProfileSchema), // Middleware 3: Validate request body
  updateProfile, // Controller function
);



// ============================================
// ADMIN ROUTES - Driver Approval Management
// ============================================
// All routes require ADMIN role
// Base path: /api/driver


// GET /api/driver/admin/pending
// Access: Private (ADMIN only)
// Purpose: List all pending driver registrations
// Middleware Chain:
// 1. authenticate → Verify JWT token, set req.user
// 2. authorizeRole('ADMIN') → Check if user.role === 'ADMIN'
// 3. getPendingDrivers → Handle request
// Test in Postman:
// Method: GET
// URL: http://localhost:5000/api/driver/admin/pending
// Headers:
//   {
//     "Authorization": "Bearer <admin_token>"
//   }
router.get(
  "/admin/pending",
  authenticate,
  authorizeRole("ADMIN"),
  getPendingDrivers
);



// POST /api/driver/admin/approve
// Access: Private (ADMIN only)
// Purpose: Approve a pending driver registration 
// Middleware Chain:
// 1. authenticate → Verify JWT token, set req.user
// 2. authorizeRole('ADMIN') → Check if user.role === 'ADMIN'
// 3. validate(approveDriverSchema) → Validate request body
// 4. approveDriver → Handle request
// Test in Postman: 
// Method: POST
// URL: http://localhost:5000/api/driver/admin/approve
// Headers:
//   {
//     "Authorization": "Bearer <admin_token>",
//     "Content-Type": "application/json"
//   }  
// Body (JSON):
//   {
//     "driverId": "60f5a3b8c2a1a4567890def1",
//     "adminNotes": "All documents verified. Approved."   <--- "optional"
//   }
// bhai admin jab click karega approve pe to driver ka status pending se approved ho jayega aur driver ko ek email bhi jayega jisme likha hoga ki aapka registration approve ho gaya hai. Agar admin koi note add karta hai to wo note bhi email me include hoga.
router.post(
  "/admin/approve",
  authenticate,
  authorizeRole("ADMIN"),
  validate(approveDriverSchema),  // ← Create this schema
  approveDriver
);



// POST /api/driver/admin/reject
// Access: Private (ADMIN only)
// Purpose: Reject a pending driver registration  
// Middleware Chain:
// 1. authenticate → Verify JWT token, set req.user
// 2. authorizeRole('ADMIN') → Check if user.role === 'ADMIN'
// 3. validate(rejectDriverSchema) → Validate request body
// 4. rejectDriver → Handle request
// Test in Postman:   
// Method: POST
// URL: http://localhost:5000/api/driver/admin/reject
// Headers:
//   {
//     "Authorization": "Bearer <admin_token>",
//     "Content-Type": "application/json"
//   }
// Body (JSON):
//   {
//     "driverId": "60f5a3b8c2a1a4567890def1",
//     "reason": "Documents are not clear. Please resubmit with clearer copies."
//   }
// jab admin reject pe click karega to driver ka status pending se rejected ho jayega aur driver ko ek email bhi jayega jisme likha hoga ki aapka registration reject ho gaya hai. Email me rejection reason bhi include hoga jo admin ne provide kiya hoga.

router.post(
  "/admin/reject",
  authenticate,
  authorizeRole("ADMIN"),
  validate(rejectDriverSchema),  // ← Create this schema
  rejectDriver
);




// ============================================
// EXPORT ROUTER
// ============================================
// Router will be mounted in app.js at /api/driver
// Example: app.use('/api/driver', driverRoutes)

export default router;
