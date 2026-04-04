import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    // Public anonymous identity
    anonymousName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
    },

    // Optional public bio
    bio: {
      type: String,
      default: "",
      maxlength: 120,
    },

    // For avatar generators later (DiceBear, etc.)
    avatarSeed: {
      type: String,
      default: "",
    },

    // Social graph
    followers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
following: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

    // Optional: for future username change limits
    usernameUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;