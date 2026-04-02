import DBconnect from "@/lib/db"
import Post from "@/models/post"
import { NextRequest,NextResponse } from "next/server"


export async function POST(request:NextRequest){
    try {
        await DBconnect();
        const body = await request.json()
        const post = await Post.create(body)

        return NextResponse.json({success:true,data:post,message:"Post created successfully"},{status:201})
    } catch (error) {
        return NextResponse.json({success:false,error:error,message:"Server error creating post"},{status:400})
    }
}

export async function GET(request:NextRequest){
    try {
        await DBconnect();
        const posts = await Post.find({}).sort({createdAt:-1})
        return NextResponse.json({success:true,data:posts,message:"Posts retrieved successfully"},{status:201})

    } catch (error) {
    return NextResponse.json({success:false,error:error},{status:400})    
    }
}
