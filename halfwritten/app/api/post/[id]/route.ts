import DBconnect from "@/lib/db";
import Post from "@/models/post";
import { NextResponse } from "next/server";
import { ParamsType } from "@/lib/types";

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
    },{status: 200});
  } catch (error) {
    console.error("Error in post route :", error);
    return Response.json(
      { success: false, message: "Failed to fetch post" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request, { params }: ParamsType) {
  try {
    await DBconnect();
    const { id } = await params;

    const post = await Post.findByIdAndDelete(id).lean();

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete post" },
      { status: 500 }
    );
  }
}