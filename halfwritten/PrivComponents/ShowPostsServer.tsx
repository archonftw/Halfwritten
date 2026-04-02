// app/components/ShowPostsServer.tsx
import DBconnect from "@/lib/db";
import Post from "@/models/post";
import ShowPosts from "./ShowPosts";
export default async function ShowPostsServer() {
  await DBconnect();

  const posts = await Post.find({}).sort({ createdAt: -1 });

  const formattedPosts = posts.map((post) => ({
    _id: post._id.toString(),
    title: String(post.title),
    content: String(post.content),
    authorId: String(post.authorId),
    authorName: String(post.authorName),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return <ShowPosts initialPosts={formattedPosts} />;
}