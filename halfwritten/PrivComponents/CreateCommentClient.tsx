"use client";

import { useState } from "react";
import SpotlightCard from '@/components/SpotlightCard'


export default function CreateCommentClient({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded?: () => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/post/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add comment");
        return;
      }

      setText("");

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-xl font-bold text-white">Add a Comment</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your thoughts..."
        className="min-h-[120px] w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none placeholder:text-zinc-500 focus:border-red-500"
      />

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </div>
  );
}