import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Post from "@/models/post";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const posts = await Post.find({ authorId: params.id }).sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      likesCount: post.likedBy?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
    });
  } catch (error) {
    console.error("Get posts by user error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}