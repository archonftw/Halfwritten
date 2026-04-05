import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    anonymousName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },

    avatarSeed: {
      type: String,
      default: "",
    },

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

    usernameUpdatedAt: {
      type: Date,
      default: null,
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;