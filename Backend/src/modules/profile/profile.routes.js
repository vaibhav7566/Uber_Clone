import express from "express";
import { getWelcome } from "./profile.contollers.js";
import authenticate from "../../common/middleware/auth.middleware.js";

const router = express.Router();

router.get("/:userId/welcome", authenticate, getWelcome); // This route will handle GET requests to /api/profile/:userId/welcome and will call the getWelcome controller function to fetch the welcome message for the user with the specified userId.

export default router;