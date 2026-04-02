import { NextResponse } from "next/server";
import DBconnect from "@/lib/db";
import Post from "@/models/post";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(req: Request) {
  try {
    await DBconnect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID required" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Make sure likedBy exists
    if (!Array.isArray(post.likedBy)) {
      post.likedBy = [];
    }

    const alreadyLiked = post.likedBy.includes(user.id);

    if (alreadyLiked) {
      // UNLIKE
      post.likedBy = post.likedBy.filter((id: string) => id !== user.id);
      await post.save();

      return NextResponse.json(
        {
          success: true,
          action: "unliked",
          likes: post.likedBy.length,
          isLiked: false,
        },
        { status: 200 }
      );
    } else {
      // LIKE
      post.likedBy.push(user.id);
      await post.save();

      return NextResponse.json(
        {
          success: true,
          action: "liked",
          likes: post.likedBy.length,
          isLiked: true,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Toggle like error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}