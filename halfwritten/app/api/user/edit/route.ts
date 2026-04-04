import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

const RESERVED_NAMES = [
  "admin",
  "support",
  "moderator",
  "official",
  "halfwritten",
  "team",
  "staff",
  "owner",
];

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingUser = await User.findOne({ clerkId: userId });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not onboarded yet." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const anonymousName = body.anonymousName?.trim().toLowerCase();
    const bio = body.bio?.trim() || "";

    if (!anonymousName) {
      return NextResponse.json(
        { success: false, message: "Anonymous name is required." },
        { status: 400 }
      );
    }

    if (!USERNAME_REGEX.test(anonymousName)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username must be 3-20 characters and contain only lowercase letters, numbers, and underscores.",
        },
        { status: 400 }
      );
    }

    if (RESERVED_NAMES.includes(anonymousName)) {
      return NextResponse.json(
        { success: false, message: "This username is reserved." },
        { status: 400 }
      );
    }

    const nameTaken = await User.findOne({
      anonymousName,
      _id: { $ne: existingUser._id },
    });

    if (nameTaken) {
      return NextResponse.json(
        { success: false, message: "This username is already taken." },
        { status: 400 }
      );
    }

    const usernameChanged = existingUser.anonymousName !== anonymousName;

    existingUser.anonymousName = anonymousName;
    existingUser.bio = bio;

    // Optional: if username changes, keep avatar synced
    if (usernameChanged) {
      existingUser.avatarSeed = anonymousName;
    }

    await existingUser.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: existingUser,
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}