import { authService } from "./auth.service.js";

async function signupController(req, res) {
  try {
    const userData = req.body;
    const result = await authService.signup(userData);

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

function loginController(req, res) {
  try {
    const { email, phone, password } = req.body;
    const identifer = email || phone; // Email ya phone dono me se koi ek chahiye

    const result = authService.login(identifer, password);

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
