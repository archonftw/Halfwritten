import DBconnect from "@/lib/db";
import Post from "@/models/post";

type ParamsType = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, { params }: ParamsType) {
  try {
    await DBconnect();

    const { id } = await params;

    const post = await Post.findById(id).lean()
    // console.log(post)
    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);

    return Response.json(
      { success: false, message: "Failed to fetch post" },
      { status: 500 }
    );
  }
}