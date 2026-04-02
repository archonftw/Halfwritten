// app/components/ShowPosts.tsx
import DBconnect from "@/lib/db";
import Post from "@/models/post";

export default async function ShowPosts() {
  try {
    await DBconnect();

    const posts = await Post.find({}).sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      _id: post._id.toString(),
      title: String(post.title),
      content: String(post.content),
      createdAt: new Date(post.createdAt).toISOString(),
      updatedAt: new Date(post.updatedAt).toISOString(),
    }));

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Posts</h1>
        {formattedPosts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <ul>
            {formattedPosts.map((post) => (
              <li key={post._id} className="mb-6">
                <h2 className="font-semibold text-lg">{post.title}</h2>
                <p>{post.content}</p>
                <small className="text-gray-500">
                  Created at: {new Date(post.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return <p>Failed to load posts.</p>;
  }
}