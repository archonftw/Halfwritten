import { currentUser } from "@clerk/nextjs/server";
import DBconnect from "@/lib/db";
import Post from "@/models/post";

export async function POST(req: Request) {
  try {
    await DBconnect();

    const user = await currentUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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
      authorId: user.id,
      authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      authorImage: user.imageUrl,
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