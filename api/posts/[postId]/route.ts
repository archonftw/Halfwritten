import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { getPostById, deletePost } from "@/services/post.service";

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    await connectDB();

    const post = await getPostById(params.postId);

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { postId: string } }) {
  try {
    await connectDB();

    const { userId } = await auth();

    await deletePost(params.postId, userId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}