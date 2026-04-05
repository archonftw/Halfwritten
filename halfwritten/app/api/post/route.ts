import { currentUser } from "@clerk/nextjs/server";
import DBconnect from "@/lib/db";
import Post from "@/models/post";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await DBconnect();

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const appUser = await User.findOne({ clerkId: clerkUser.id });

    if (!appUser) {
      return Response.json(
        { success: false, message: "User not onboarded" },
        { status: 404 }
      );
    }

    const { title, content } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return Response.json(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),

      // ✅ IMPORTANT FIXES
      authorId: appUser._id.toString(),
      authorName: appUser.anonymousName,
      authorImage: `https://api.dicebear.com/7.x/thumbs/svg?seed=${
        appUser.avatarSeed || appUser.anonymousName
      }`,
    });

    return Response.json(
      {
        success: true,
        message: "Post created successfully",
        post: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/post error:", error);
    return Response.json(
      { success: false, message: "Failed to create post" },
      { status: 500 }
    );
  }
}