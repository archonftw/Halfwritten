import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { followUser, unfollowUser } from "@/services/user.service";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await followUser(clerkId, params.userId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await unfollowUser(clerkId, params.userId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}