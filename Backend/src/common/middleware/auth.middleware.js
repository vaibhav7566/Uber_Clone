import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import User from "../../modules/model/user.model.js";

const authenticate = async (req, res, next) => {
  //     req = {
  //   headers: { authorization: "Bearer eyJhb..." },
  //   body: {},
  //   params: {},
  //   user: undefined   ❌ (not set yet)
  // }

  // When you log in, the server gives you a token (like a JWT token). This token is basically proof of who you are. Now, when the frontend sends a request to a secure part of your app, it takes that token and puts it in the Authorization header. The header looks like this: "Bearer <your-token>". "Bearer" means it's carrying a token for identity. When the server gets this request, it checks if the token is valid. If it is, the server knows who you are and lets you proceed. But the frontend is the one that sets this header every time it makes a secure request.

  const authHeader = req.headers.authorization; // authorization: Bearer eyJhbGTOKENIUzI1NiIsInR5cCI6IkpXVCJ9...

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part after "Bearer "

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET); // Verify the token using the secret key

    const user = await User.findById(decoded._id); // Find the user in the database using the ID from the token

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Invalid token.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
      });
    }

    req.user = user; // Attach the user object to the request for use in controllers
    next(); // Proceed to the next middleware or route controller
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token or expired token.",
    });
  }
};



const authorizeRole = (...allRequiredRoles) => {   // This function takes in a list of roles that are allowed to access a particular route. It returns a middleware function that checks if the authenticated user's role is included in the list of allowed roles. If the user's role is not included, it responds with a 403 Forbidden status and an appropriate message. If the user's role is included, it allows the request to proceed to the next middleware or route handler.
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allRequiredRoles.includes(req.user.role)) {  // Check if the user's role is included in the list of allowed roles
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${allRequiredRoles.join(", ")} can access this resource`,
      });
    }

    next(); // If the user's role is included, proceed to the next middleware or route handler
  };
};

export default authenticate;
