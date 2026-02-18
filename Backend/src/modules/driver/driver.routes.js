import express from "express";
import authenticate from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/auth.validate.js";
import { createDriverProfileSchema } from "./driver.validation.js";
import { createProfile } from "./driver.controllers.js";

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

export default router;
