import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import { initializeSocket } from "./socket.js";


const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(
        `Server is running at port ${env.PORT} by ${env.AUTHOR_NAME}`,
      );
    });

    initializeSocket(server);
  } catch (error) {
    console.log("Failed to start server!", error.message);
  }
};

startServer();
