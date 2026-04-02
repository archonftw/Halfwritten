"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Form() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setLoading(false);
      return alert("Title and content cannot be empty");
    }

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create a post");
      }

      const result = await response.json();

      if (result.success) {
        setTitle("");
        setContent("");
        alert("Post created successfully!");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-9/10 h-full">
      <form onSubmit={handleSubmit}>
        <h1 className="mb-4 text-xl font-semibold">Tell your story</h1>

        <div className="flex flex-col gap-4">
          <div>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              placeholder="Title"
              disabled={loading}
            />
          </div>

          <div className="w-full h-full">
            <Textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-100"
              placeholder="Content"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}