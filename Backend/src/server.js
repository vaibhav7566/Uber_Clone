import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(
        `Server is running at port ${env.PORT} by ${env.AUTHOR_NAME}`,
      );
    });
  } catch (error) {
    console.log("Failed to start server!", error.message);
  }
};

startServer();
