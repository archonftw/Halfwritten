import mongoose from "mongoose";
import DBconnect from "@/lib/db";
import Post from "@/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ParamsType } from "@/lib/types";


export async function GET(req: Request, { params }: ParamsType) {
  try {
    await DBconnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid post ID" },
        { status: 400 }
      );
    }

    const post = await Post.findById(id).lean();

    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      comments: post.comments || [],
    });
  } catch (error) {
    console.error("Error fetching comments:", error);

    return Response.json(
      { success: false, message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: ParamsType) {
  try {
    await DBconnect();

    const { userId } = await auth(); // ✅ for YOUR Clerk version

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await currentUser();

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { text } = await req.json();

    if (!text || !text.trim()) {
      return Response.json(
        { success: false, message: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    const { id } = await params;

    const newComment = {
      text: text.trim(),
      userId,
      username:
        user.username ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Anonymous",
      userImage: user.imageUrl || "",
      createdAt: new Date(),
    };

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: newComment,
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);

    return Response.json(
      { success: false, message: "Failed to add comment" },
      { status: 500 }
    );
  }
}


