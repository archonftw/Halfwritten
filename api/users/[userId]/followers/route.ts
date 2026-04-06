import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getFollowers } from "@/services/user.service";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const followers = await getFollowers(params.userId);

    return NextResponse.json({ success: true, followers });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}