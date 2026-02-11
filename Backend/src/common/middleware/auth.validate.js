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
