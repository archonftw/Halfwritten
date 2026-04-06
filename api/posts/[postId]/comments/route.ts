import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { getComments, addComment } from "@/services/post.service";

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  await connectDB();

  const comments = await getComments(params.postId);

  return NextResponse.json({ success: true, comments });
}

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  await connectDB();

  const { userId } = await auth();
  const body = await req.json();

  const comment = await addComment(userId, params.postId, body.text);

  return NextResponse.json({ success: true, comment });
}