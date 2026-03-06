import express from "express";
import { loginController, signupController, getCurrentUserController } from "./auth.controllers.js";
import { validate } from "../../common/middleware/auth.validate.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signupController); // User registration
router.post("/login", validate(loginSchema), loginController); // User login
router.get("/me", authenticate, getCurrentUserController); // Get current logged-in user

export default router;
