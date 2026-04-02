import { currentUser } from "@clerk/nextjs/server";
import DBconnect from "@/lib/db";
import Post from "@/models/post";

export async function GET() {
  try {
    await DBconnect();

    const user = await currentUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const posts = await Post.find({ authorId: user.id }).sort({ createdAt: -1 });

    const formattedPosts = posts.map((post: any) => ({
      _id: post._id.toString(),
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      likesCount: post.likedBy?.length || 0,
    }));

    return Response.json({
      success: true,
      posts: formattedPosts,
    });
  } catch (error) {
    console.error("Error fetching my posts:", error);

    return Response.json(
      { success: false, message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}