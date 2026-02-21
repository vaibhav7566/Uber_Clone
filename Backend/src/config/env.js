import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["PORT", "AUTHOR_NAME","MONGODB_URI","JWT_SECRET","JWT_EXPIRES_IN","ENCRYPTION_KEY"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const env = {
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "your-32-character-secret-key!!aa",
  PORT: process.env.PORT || 4000,
  AUTHOR_NAME: process.env.AUTHOR_NAME,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};
