import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async() => {
 try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected successfully -->", mongoose.connection.host);  // represents that you are connected to local or atlas database.
 } catch (err) {
    console.log("MongoDB connection failed! --> ", err.message);
    console.error(err.stack);
    process.exit(1);
 }
}

export default connectDB;