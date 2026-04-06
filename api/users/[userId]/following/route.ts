import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getFollowing } from "@/services/user.service";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const following = await getFollowing(params.userId);

    return NextResponse.json({ success: true, following });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}