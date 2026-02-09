import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js"; // This will allow us to access the environment variables defined in the .env file, such as the secret key for JWT.

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"], // this will ensure that the name field is required when creating a new user document. If the name field is missing, it will throw an error with the message "Name is required".
      trim: true, // removes extra spaces from the beginning and end of the string.
      minlength: [2, "Name must be atleast 2 characters"],
      maxlength: [50, "Name cannot exceeds 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be atleast 6 characters"],
      select: false, // this will prevent the password from being returned in any query results by default.
    },
    role: {
      type: String,
      enum: {
        values: ["RIDER", "DRIVER"],
        message: "Role must be either RIDER or DRIVER",
      },
      default: "RIDER",
    },
    isActive: {  // this field is used to soft delete a user. Instead of actually deleting the user from the database, we can set this field to false to indicate that the user is no longer active.
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // this will automatically add createdAt and updatedAt fields to the schema, which will store the date and time when a document is created and last updated, respectively.
  },
);

userSchema.index({ email: 1 }); // creates an index on the email field to improve query performance when searching for users by email.

userSchema.pre("save", async function () {  // this is a pre-save hook that will run before a user document is saved to the database. It checks if the password field has been modified, and if so, it hashes the password using bcrypt before saving it to the database.
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10); // the second argument (10) is the salt rounds, which determines how many times the password will be hashed. A higher number means more security but also more time to hash the password.
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () 
{ 
  return jwt.sign( 
    {
      _id: this._id,
      role: this.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
};

const User = mongoose.model("User", userSchema);

export default User;