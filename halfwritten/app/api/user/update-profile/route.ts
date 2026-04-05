import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import DBconnect from "@/lib/db";
import User from "@/models/user";
import Post from "@/models/post";

export async function PATCH(req: Request) {
  try {
    await DBconnect();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { anonymousName, bio, avatarSeed } = body;

    if (!anonymousName || !anonymousName.trim()) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const cleanName = anonymousName.trim();
    const finalAvatarSeed = avatarSeed?.trim() || cleanName;
    const authorImage = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalAvatarSeed)}`;

    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          anonymousName: cleanName,
          bio: bio || "",
          avatarSeed: finalAvatarSeed,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update all old posts of this user
    await Post.updateMany(
      { authorId: userId },
      {
        $set: {
          authorName: cleanName,
          authorImage,
        },
      }
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}