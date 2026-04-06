import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { getFeed } from "@/services/feed.service";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const posts = await getFeed(userId);

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}