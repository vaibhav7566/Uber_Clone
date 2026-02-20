import express from "express";
import { authenticate, authorizeRole } from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/auth.validate.js";
import { createDriverProfileSchema } from "./driver.validation.js";
import { createProfile, getProfileCompletion } from "./driver.controllers.js";

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
    '/me/completion',
    authenticate,                // Middleware 1: Verify JWT token
    authorizeRole('DRIVER'),     // Middleware 2: Only DRIVER role allowed
    getProfileCompletion        // Controller function
);

export default router;
