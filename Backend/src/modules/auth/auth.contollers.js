import { authService } from "./auth.service.js";

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 100
 *           example:
 *             name: "John Doe"
 *             email: "john@example.com"
 *             phone: "9876543210"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         role:
 *                           type: string
 *                         isActive:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Validation error or email/phone already registered
 */

async function signupController(req, res) {
  try {
    const userData = req.body;
    const result = await authService.signup(userData);

    // console.log("Signup successful for user:", result.user.email); // Log the email of the newly registered user

    return res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
}



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Login with email or phone number and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address (optional if phone is provided)
 *               phone:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *                 description: Phone number (optional if email is provided)
 *               password:
 *                 type: string
 *                 minLength: 1
 *           example:
 *             email: "john@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         role:
 *                           type: string
 *                         isActive:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid credentials or validation error
 */

async function loginController(req, res) {
  try {
    const { email, phone, password } = req.body;
    const identifer = email || phone; // Email ya phone dono me se koi ek chahiye

    const result = await authService.login(identifer, password);

    // console.log("Login result:", result); // Debug log to check the login result

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}

export { signupController, loginController };

// Ye file controller layer hai jo HTTP request aur response handle karti hai.

// signupController:

// req.body se user ka data leta hai.

// authService.signup() ko call karta hai (business logic ke liye).

// Agar success ho → 201 status + success response bhejta hai.

// Agar error aaye → 400 status + error message bhejta hai.

// loginController:

// req.body se email aur password leta hai.

// authService.login() ko call karta hai.

// Success par 200 status + user data + token return karta hai.

// Error par 400 status + error message return karta hai.

// Controller ka kaam sirf request lena aur response dena hai.

// Actual logic (DB, password, token) service layer me hai.
