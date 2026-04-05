import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const targetUser = await User.findById(params.id);
    console.log(targetUser)

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    let isFollowing = false;
    let isOwnProfile = false;

    if (userId) {
      const currentUser = await User.findOne({ clerkId: userId });

      if (currentUser) {
        isOwnProfile =
          currentUser._id.toString() === targetUser._id.toString();

        isFollowing =
          currentUser.following?.some(
            (id: any) => id.toString() === targetUser._id.toString()
          ) || false;
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: targetUser._id,
        anonymousName: targetUser.anonymousName,
        bio: targetUser.bio,
        avatarSeed:
          targetUser.avatarSeed ||
          targetUser.anonymousName ||
          "halfwritten",
        followersCount: targetUser.followers?.length || 0,
        followingCount: targetUser.following?.length || 0,
      },
      isFollowing,
      isOwnProfile,
    });
  } catch (error) {
    console.error("Get public user error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}