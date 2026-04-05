import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not signed in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const targetUserId = String(body.targetUserId || "").trim();

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: "Target user ID is required" },
        { status: 400 }
      );
    }

    const currentUser = await User.findOne({ clerkId: userId });
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (currentUser._id.toString() === targetUser._id.toString()) {
      return NextResponse.json(
        { success: false, message: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    currentUser.following = currentUser.following || [];
    targetUser.followers = targetUser.followers || [];

    const isAlreadyFollowing = currentUser.following.some(
      (id: any) => id.toString() === targetUser._id.toString()
    );

    if (isAlreadyFollowing) {
      currentUser.following = currentUser.following.filter(
        (id: any) => id.toString() !== targetUser._id.toString()
      );

      targetUser.followers = targetUser.followers.filter(
        (id: any) => id.toString() !== currentUser._id.toString()
      );
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    const isFollowingNow = currentUser.following.some(
      (id: any) => id.toString() === targetUser._id.toString()
    );

    return NextResponse.json({
      success: true,
      isFollowing: isFollowingNow,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
      message: isFollowingNow
        ? "User followed successfully"
        : "User unfollowed successfully",
    });
  } catch (err) {
    console.error("Follow/unfollow error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}