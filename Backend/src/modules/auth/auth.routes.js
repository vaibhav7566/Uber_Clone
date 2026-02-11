import express from "express";
import { loginController, signupController } from "./auth.contollers.js";

const router = express.Router();

router.post("/signup",signupController) // this route handles user registration. It will be defined in the auth.controller.js file.
router.post("/login",loginController) // this route handles user login. It will be defined in the auth.controller.js file.

export default router;