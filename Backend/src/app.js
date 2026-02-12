import express from "express";
import authRoutes from "./modules/auth/auth.routes.js"; 
import profileRoutes from "./modules/profile/profile.routes.js";

const app = express();

app.use(express.json()); // this middleware is used to parse the incoming request body as JSON. It allows us to access the data sent in the request body using req.body in our route handlers.
app.use(express.urlencoded({ extended: true })); // this middleware is used to parse the incoming request body as URL-encoded data(form data). It allows us to access the data sent in the request body using req.body in our route handlers. The extended option allows for rich objects and arrays to be encoded into the URL-encoded format, which can be useful for complex data structures.

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth",authRoutes); // this line mounts the authRoutes on the /api/auth path. This means that any requests made to /api/auth will be handled by the authRoutes.
app.use("/api/profile",profileRoutes); // this line mounts the profileRoutes on the /api/profile path. This means that any requests made to /api/profile will be handled by the profileRoutes.
export default app;
