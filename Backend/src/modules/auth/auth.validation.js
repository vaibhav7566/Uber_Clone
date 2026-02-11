import { email, z } from "zod";

// ============================================
// SIGNUP VALIDATION SCHEMA
// ============================================
// Validates user registration data
// All fields in req.body will be checked against these rules

// Result: If validation fails, user gets clear error message
// Example: "Email must be a valid email address"

export const signupSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be at most 50 characters long")
      .trim(),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Please provide a valid email address")
      .trim(),

    phone: z
      .string({
        required_error: "Phone number is required",
      })
      .regex(/^[0-9]{10}$/, "Phone number must be 10 digits long")
      .trim(),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be at most 100 characters long"),

    // Role removed - will be set to RIDER by default in controller
  }),
});

// ============================================
// LOGIN VALIDATION SCHEMA
// ============================================
// Validates login credentials
// User can login with either email OR phone + password

// Result: Ensures at least one identifier (email or phone) is present

export const loginSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .email("Please provide a valid email address")
        .trim()
        .optional()
        .or(z.literal("")), // Allow empty string if phone is provided

      phone: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone number must be 10 digits long")
        .trim()
        .optional()
        .or(z.literal("")), // Allow empty string if email is provided

      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long")
        .trim(),
    })
    .refine(
      // .refine() — Custom Validation Logic
      (data) => {
        const hasEmail = data.email && data.email.trim().length > 0;
        const hasPhone = data.phone && data.phone.trim().length > 0;

        return hasEmail || hasPhone;
      },
      {
        message: "Either email or phone number must be provided",
        path: ["email", "phone"], // Show error on both fields}),  path tells Zod which field the error belongs to. Without path The error is attached to the whole object (general error). Frontend may not know which field caused the problem.
      },
    ),
});
