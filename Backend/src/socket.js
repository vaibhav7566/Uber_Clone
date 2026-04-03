import { Server } from "socket.io";
import User from "./modules/model/user.model.js";
import { Driver } from "./modules/model/driver.model.js";

let ioInstance = null;

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  return (
    /^https?:\/\/localhost:\d+$/i.test(origin) ||
    /^https:\/\/([a-z0-9-]+\.)*devtunnels\.ms$/i.test(origin)
  );
};

export const initializeSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Socket CORS blocked"), false);
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join", async (data) => {
      try {
        const userId = data?.userId || data?._id || data?.id;
        const userType = String(data?.userType || data?.role || "")
          .trim()
          .toLowerCase();

        if (!userId || !userType) {
          console.log("Invalid join payload:", data);
          return;
        }

        console.log(`Join received -> userId: ${userId}, userType: ${userType}, socketId: ${socket.id}`);

        if (userType === "rider") {
          const user = await User.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { new: true },
          );

          if (!user) {
            console.log(`Rider not found for userId: ${userId}`);
            return;
          }

          console.log(`Rider socketId updated: ${userId} -> ${socket.id}`);
        } else if (userType === "driver") {
          const user = await User.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { new: true },
          );

          if (!user) {
            console.log(`Driver user not found for userId: ${userId}`);
          }

          let driver = await Driver.findOneAndUpdate(
            { userId },
            { socketId: socket.id },
            { new: true },
          );

          if (!driver) {
            driver = await Driver.findByIdAndUpdate(
              userId,
              { socketId: socket.id },
              { new: true },
            );
          }

          if (!driver) {
            console.log(
              `Driver not found for identifier: ${userId}. Tried both Driver.userId and Driver._id`,
            );
            return;
          }

          console.log(
            `Driver socketId updated: driverId=${driver._id}, userId=${driver.userId} -> ${socket.id}`,
          );
        } else {
          console.log(`Unknown userType in join: ${userType}`);
        }
      } catch (error) {
        console.log("Join handler error:", error.message);
      }
    });

    socket.on("update-location-driver", async (data) => {
      try {
        const userId = data?.userId || data?._id || data?.id;
        const latitude = Number(data?.latitude ?? data?.lat);
        const longitude = Number(data?.longitude ?? data?.lng);

        console.log("Update location data: " + JSON.stringify(data));

        if (!userId || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          console.log("Invalid driver location payload:", data);
          return;
        }

        const driver = await Driver.findOneAndUpdate(
          { userId },
          {
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            socketId: socket.id,
          },
          { new: true },
        );

        if (!driver) {
          console.log(`Driver not found for userId: ${userId}`);
          return;
        }

        console.log(
          `Driver location updated: driverId=${driver._id}, userId=${driver.userId}, lat=${latitude}, lng=${longitude}`,
        );
      } catch (error) {
        console.log("Driver location update error:", error.message);
      }
    });


    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const sendMessageToSocketId = (socketId, messageObject) => {
 
  
  if (!ioInstance || !socketId || !messageObject) {
    return;
  }
  console.log(`Socket.js ==> Attempting to send message to socketId: ${socketId} with event: ${JSON.stringify(messageObject)}`);

  ioInstance.to(socketId).emit(messageObject.event, messageObject.data);
};
