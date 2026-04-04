"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState,useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { cormorantFont, loveFont } from "@/lib/fonts";

export default function Form() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);


  const gifs = [
    '/gifs/1.gif',
    '/gifs/2.gif',
    '/gifs/3.gif',
    '/gifs/4.gif',
    '/gifs/5.gif',
    '/gifs/6.gif',
    '/gifs/7.gif',
    '/gifs/8.gif',
    '/gifs/9.gif',
  ]
  const [currentGif, setCurrentGif] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % gifs.length);
    }, 3000); // change every 3 sec

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setLoading(false);
      toast.error("Title and content cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create a post");
      }

      if (result.success) {
        setTitle("");
        setContent("");
        toast.success("Post created successfully!");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-9/10 h-full">
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit}>
        <h1 className={` ${loveFont.className} mb-4 text-xl font-semibold`}>Tell your story</h1>

        <div className="flex flex-col  gap-4">
          <div className="cursor-target">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              placeholder="Title"
              disabled={loading}
            />
          </div>

          <div className="w-full cursor-target h-full">
            <Textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-[400px]"
              placeholder="Content"
              disabled={loading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className=" mt-4 px-6 py-3 rounded-xl cursor-target bg-black border border-red-400 text-white-300 font-semibold 
shadow-[0_0_10px_rgba(34,211,238,0.5),0_0_20px_rgba(34,211,238,0.3)]
hover:shadow-[0_0_20px_rgba(34,211,238,0.9),0_0_40px_rgba(34,211,238,0.6),0_0_60px_rgba(34,211,238,0.4)]
hover:scale-105 transition-all duration-300">
          {loading ? "Posting..." : "Post"}
        </Button>
      </form>

      <div className="flex items-center justify-center mt-4">
        <img src={gifs[currentGif]} alt="" className="rounded-2xl h-70 w-auto flex "  />
      </div>
    </div>
  );
}