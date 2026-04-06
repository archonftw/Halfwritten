import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { getUserProfile } from "@/services/user.service";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { userId: clerkId } = await auth();

    const user = await getUserProfile(params.userId, clerkId);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}