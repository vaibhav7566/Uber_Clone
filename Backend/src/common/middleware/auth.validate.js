export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });

      next();
    } catch (error) {
      console.log("Validation error caught:", error);
      return {
        status: 400,
        message: "Validation failed",
        error: error.errors || error.message,
      };
    }
  };
};

/*
========================================================
VALIDATE MIDDLEWARE - DETAILED SUMMARY
========================================================

Purpose:
This is a reusable validation middleware that checks 
incoming request data against a given Zod schema 
before allowing it to reach the controller.

How It Works:

1. The validate function accepts a Zod schema 
   (e.g., signupSchema, loginSchema).

2. It returns an Express middleware function 
   (req, res, next).

3. When a request comes in:
   - It runs schema.parseAsync() on req.body.
   - Zod validates the data based on defined rules.

4. If validation is successful:
   - No error is thrown.
   - next() is called.
   - Request moves to the controller.

5. If validation fails:
   - Zod throws an error.
   - The catch block handles the error.
   - A 400 (Bad Request) response is returned.
   - The response contains:
       success: false
       message: "Validation failed"
       errors: detailed validation errors

Why This Middleware Is Important:

- Prevents invalid data from reaching controllers.
- Protects database and internal services from bad input.
- Keeps controllers clean and focused on business logic.
- Provides structured and consistent error responses.
- Reusable for multiple routes and schemas.

In Simple Terms:
This middleware acts like a security gate.
If the request data is valid → allow it inside.
If invalid → reject it immediately.
========================================================
*/
