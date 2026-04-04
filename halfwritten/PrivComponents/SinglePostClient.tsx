"use client";

import { useEffect, useState } from "react";
import SpotlightCard from "@/components/SpotlightCard";
import ConfirmModal from "@/PrivComponents/ConfirmModal";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

export default function SinglePostClient({ postId }: { postId: string }) {
  const { user } = useUser();
  const router = useRouter();

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/${postId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch post");
          return;
        }

        setPost(data.post);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Delete handler
  const handleDelete = async () => {
    if (!post) return;

    try {
      const res = await fetch(`/api/post/${post._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to delete post");
        return;
      }

      toast.success("Post deleted successfully!");
      setTimeout(() => {
        router.push("/post");
      }, 1000); // wait 1s for toast
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500 text-xl animate-pulse">Loading post...</div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="rounded-2xl border border-red-500/20 bg-zinc-950 p-8 text-center shadow-[0_0_30px_rgba(220,38,38,0.08)]">
          <h1 className="text-2xl font-bold text-red-500">Post Not Found</h1>
          <p className="mt-3 text-zinc-400">{error || "This post does not exist."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen min-w-[50%] bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-900/20 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-red-700/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
            HalfWritten
          </span>
          <span className="text-xs text-zinc-500">Post ID: {post._id}</span>
        </div>

        <SpotlightCard spotlightColor="rgba(178, 61, 61, 0.58)">
          <article className="overflow-hidden rounded-3xl border border-red-500/15 bg-gradient-to-b from-zinc-950 to-black shadow-[0_0_50px_rgba(220,38,38,0.08)]">
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />

            <div className="p-6 sm:p-8 md:p-10">
              <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                {post.title}
              </h1>

              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-6">
                <div className="flex items-center gap-4">
                  <img
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-gradient-to-br from-red-700 to-zinc-900 text-lg font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                    src={post.authorImage}
                    alt={post.authorName}
                  />
                  <div>
                    <p className="font-medium text-white">{post.authorName || "Unknown Author"}</p>
                    <p className="text-sm text-zinc-500">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recently posted"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5 sm:p-6">
                <p className="whitespace-pre-wrap text-base leading-8 text-zinc-200 sm:text-lg">{post.content}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-2xl border border-red-500/20 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.98]">
                  {post.likedBy.length}❤️ React
                </button>
                <button className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-red-500/20 hover:text-white active:scale-[0.98]">
                  💬 Comment
                </button>
                <button className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-red-500/20 hover:text-white active:scale-[0.98]">
                  🔖 Save
                </button>

                {user?.id === post.authorId && (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="rounded-2xl border border-red-500/20 bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-[0.98]"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        </SpotlightCard>
      </section>

      {/* Custom confirmation modal */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this post?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            handleDelete();
          }}
        />
      )}
    </main>
  );
}