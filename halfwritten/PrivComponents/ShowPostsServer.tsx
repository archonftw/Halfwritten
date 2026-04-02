import { currentUser } from "@clerk/nextjs/server";
import DBconnect from "@/lib/db";
import Post from "@/models/post";
import ShowPostsClient from "./ShowPosts";

export default async function ShowPosts() {
  await DBconnect();

  const user = await currentUser();
  const currentUserId = user?.id || null;

  const posts = await Post.find({}).sort({ createdAt: -1 });

  const formattedPosts = posts.map((post) => {
    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];

    return {
      _id: post._id.toString(),
      title: String(post.title),
      authorName: String(post.authorName),
      authorId: String(post.authorId),
      authorImage: String(post.authorImage),
      content: String(post.content),
      likedBy,
      likes: likedBy.length,
      isLiked: currentUserId ? likedBy.includes(currentUserId) : false,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  });

  return <ShowPostsClient initialPosts={formattedPosts} />;
}