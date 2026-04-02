"use client";

import { useState } from "react";
import BorderGlow from "@/components/BorderGlow";
import { formatDistanceToNow } from "date-fns";

type PostType = {
  _id: string;
  title: string;
  authorName: string;
  authorId: string;
  authorImage: string;
  content: string;
  likes: number;
  likedBy: string[];
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
};

interface Props {
  initialPosts: PostType[];
}

export default function ShowPostsClient({ initialPosts }: Props) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLike = async (postId: string) => {
    setLoadingId(postId);

    try {
      const res = await fetch("/api/post/like", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const raw = await res.text();
        console.error("Non-JSON response:", raw);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: data.likes,
                  isLiked: data.isLiked,
                }
              : post
          )
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Like toggle failed:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold ml-4">Stories</h1>

      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 m-4 bg-white rounded-2xl text-black"
      />

      {filteredPosts.length === 0 ? (
        <p className="ml-4">No posts found.</p>
      ) : (
        <ul>
          {filteredPosts.map((post) => (
            <li key={post._id}>
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#060010"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={["#c084fc", "#f472b6", "#38bdf8"]}
                className="m-5"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorImage}
                      alt={post.authorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <h1 className="font-semibold text-lg">{post.authorName}</h1>
                  </div>

                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="text-gray-300">{post.content}</p>

                  <p className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>

                  <button
                    onClick={() => handleLike(post._id)}
                    disabled={loadingId === post._id}
                    className={`px-4 py-2 rounded-xl transition ${
                      post.isLiked
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-pink-500 hover:bg-pink-600"
                    } disabled:opacity-70`}
                  >
                    {loadingId === post._id
                      ? "..."
                      : post.isLiked
                      ? `❤️ Liked (${post.likes})`
                      : `🤍 Like (${post.likes})`}
                  </button>
                </div>
              </BorderGlow>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}