import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import driverRoutes from "./modules/driver/driver.routes.js";

import swaggerUi from "swagger-ui-express"; //swagger-ui-express: A middleware that serves the generated Swagger documentation as an interactive web interface.
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(express.json()); // this middleware is used to parse the incoming request body as JSON. It allows us to access the data sent in the request body using req.body in our route handlers.
app.use(express.urlencoded({ extended: true })); // this middleware is used to parse the incoming request body as URL-encoded data(form data). It allows us to access the data sent in the request body using req.body in our route handlers. The extended option allows for rich objects and arrays to be encoded into the URL-encoded format, which can be useful for complex data structures.

// Swagger documentation route
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: "/api-docs/json",
    },
  }),
);

// Alternative JSON spec endpoint
app.get("/api-docs/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes); // this line mounts the authRoutes on the /api/auth path. This means that any requests made to /api/auth will be handled by the authRoutes.
app.use("/api/profile", profileRoutes); // this line mounts the profileRoutes on the /api/profile path. This means that any requests made to /api/profile will be handled by the profileRoutes.
app.use("/api/driver", driverRoutes); // this line mounts the driverRoutes on the /api/driver path. This means that any requests made to /api/driver will be handled by the driverRoutes. 
export default app;
