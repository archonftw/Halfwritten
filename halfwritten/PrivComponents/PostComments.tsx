"use client";

import { useEffect, useState } from "react";

type CommentType = {
  _id?: string;
  text: string;
  userId: string;
  username?: string;
  userImage?: string;
  createdAt: string;
};

export default function PostComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/post/${postId}/comment`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch comments");
          return;
        }

        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <p className="animate-pulse text-zinc-400">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-2xl border border-red-500/20 bg-zinc-950 p-5">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-[25%] rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-xl font-bold text-white">Comments</h2>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment._id || index}
              className="overflow-auto rounded-2xl border border-zinc-800 bg-black p-4"
            >
              <div className="mb-3 flex items-center gap-3">
                {comment.userImage ? (
                  <img
                    src={comment.userImage}
                    alt={comment.username || "User"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 font-bold text-white">
                    {comment.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-white">
                    {comment.username || "Anonymous"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : "Just now"}
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-wrap text-zinc-300">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">No comments yet.</p>
      )}
    </div>
  );
}