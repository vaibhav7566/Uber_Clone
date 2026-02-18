import express from "express";
import { getWelcome } from "./profile.controllers.js";
import authenticate from "../../common/middleware/auth.middleware.js";

const router = express.Router();

router.get("/:userId/welcome", authenticate, getWelcome); //   dynamic input for userId in the URL. This allows us to fetch the welcome message for a specific user based on their userId. The authenticate middleware is used to ensure that only authenticated users can access this route.
  // This route will handle GET requests to /api/profile/:userId/welcome and will call the getWelcome controller function to fetch the welcome message for the user with the specified userId.

export default router;