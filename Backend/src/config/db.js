import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async() => {
 try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected successfully -->", mongoose.connection.host);
 } catch (error) {
    console.log("MongoDB connection failed! --> ", error.message);
    process.exit(1);
 }
}

export default connectDB;