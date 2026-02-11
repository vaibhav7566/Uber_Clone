import User from "../model/user.model.js";

class AuthService {
  async signup(userData) {
    try {
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }],
      });
      if (existingUser) {
        if (existingUser.email === userData.email) {
          throw new Error("Email already exists");
        }
        if (existingUser.phone === userData.phone) {
          throw new Error("Phone number already exists");
        }
      }

      const user = await User.create(userData);

      const token = user.generateAuthToken();

      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(identifier, password) {
    try {
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      }).select("+password");

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new Error("Invalid credentials password invalid");
      }

      if (!user.isActive) {
        throw new Error("Account is deactivated. Please contact support.");
      }

      const token = user.generateAuthToken();

      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();

// AuthService ek service layer hai jo signup aur login logic handle karta hai.

// signup():

// Pehle check karta hai ki email ya phone already exist karta hai ya nahi.

// Agar exist karta hai → error throw karta hai.

// Naya user create karta hai.

// User ke model se JWT token generate karta hai.

// Response me safe user data + token return karta hai.

// login():

// Email ke basis par user find karta hai (password ke saath).

// Password verify karta hai.

// Check karta hai user active hai ya nahi.

// Token generate karta hai.

// Response me user data + token return karta hai.

// Password hashing, comparison aur token generation model methods ke through ho raha hai.

// Service sirf business logic handle kar rahi hai, HTTP ka kaam controller karega.
