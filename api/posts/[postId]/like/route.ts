import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { likePost, unlikePost } from "@/services/post.service";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  await connectDB();

  const { userId } = await auth();

  await likePost(userId, params.postId);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: { postId: string } }) {
  await connectDB();

  const { userId } = await auth();

  await unlikePost(userId, params.postId);

  return NextResponse.json({ success: true });
}