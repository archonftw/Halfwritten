"use client";

import { useState } from "react";
import BorderGlow from "@/components/BorderGlow";
import { formatDistanceToNow } from "date-fns";
import GradientText from "@/components/GradientText";
import { loveFont } from "@/lib/fonts";
import Link from "next/link";
import TargetCursor from "@/components/TargetCursor";

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
    <div className="min-h-screen bg-black text-white">
      <TargetCursor/>
      {/* Sticky Header */}
      <div className="p-3 sm:p-4 bg-black sticky top-0 z-10 border-b border-white/5">
        <h1 className={`text-xl sm:text-2xl font-bold ml-1 sm:ml-4 ${loveFont.className}`}>
          Stories
        </h1>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-white/20 cursor-target p-2 mt-2 sm:m-4 rounded-2xl text-white w-full sm:w-1/2 bg-transparent placeholder:text-white/30 focus:outline-none focus:border-pink-400/50 transition-colors text-sm sm:text-base"
        />
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <p className="ml-4 mt-6 text-gray-400 text-sm">No posts found.</p>
      ) : (
        <ul className="pb-6 cursor-target">
          {filteredPosts.map((post) => (
            <li key={post._id}>
              <Link href={`/post/${post._id}`}>
                  <div className="p-4 sm:p-6 outline hover:bg-zinc-900 space-y-3">
                    {/* Author Row */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={post.authorImage}
                        alt={post.authorName}
                        className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <h1 className="font-semibold text-base sm:text-lg leading-tight">
                        {post.authorName}
                      </h1>
                    </div>

                    {/* Title */}
                    <GradientText
                      colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
                      animationSpeed={3}
                      showBorder={false}
                      className={`ml-0 text-lg sm:text-xl ${loveFont.className}`}
                    >
                      {post.title}
                    </GradientText>

                    {/* Content */}
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    {/* Footer Row */}
                    <div className="flex justify-between items-center pt-1 gap-2">
                      <p className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </p>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLike(post._id);
                        }}
                        disabled={loadingId === post._id}
                        className={`px-3 sm:px-4  cursor-target py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
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
                  </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}