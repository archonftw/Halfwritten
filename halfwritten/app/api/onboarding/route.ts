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

export async function POST(req: Request) {
  try {
    await connectDB();
    //Finding userID of logged In user using clerk auth
    const { userId } = await auth();


    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user: No access" },
        { status: 401 }
      );
    }
    const existingUser = await User.findOne({ clerkId: userId });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "You are already onboarded." },
        { status: 400 }
      );
    }

    const body = await req.json();

    const anonymousName = String(body.anonymousName || "")
      .trim()
      .toLowerCase();

    const bio = String(body.bio || "").trim().slice(0, 160);

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

    const existingName = await User.findOne({ anonymousName });

    if (existingName) {
      return NextResponse.json(
        { success: false, message: "This username is already taken." },
        { status: 400 }
      );
    }

    const user = await User.create({
      clerkId: userId,
      anonymousName,
      bio,
      avatarSeed: anonymousName,
      followers: [],
      following: [],
      isOnboarded: true,
      usernameUpdatedAt: null,
    });

    return NextResponse.json({
      success: true,
      message: "Onboarding complete.",
      user: {
        _id: user._id,
        clerkId: user.clerkId,
        anonymousName: user.anonymousName,
        bio: user.bio,
        avatarSeed: user.avatarSeed,
        followers: user.followers,
        following: user.following,
        isOnboarded: user.isOnboarded,
        usernameUpdatedAt: user.usernameUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}