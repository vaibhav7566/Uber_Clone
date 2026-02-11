import express from "express";
import { loginController, signupController } from "./auth.contollers.js";
import { validate } from "../../common/middleware/auth.validate.js";

const router = express.Router();

router.post("/signup", validate("signup"), signupController); // this route handles user registration. It will be defined in the auth.controller.js file.
router.post("/login", validate("login"), loginController); // this route handles user login. It will be defined in the auth.controller.js file.

export default router;
