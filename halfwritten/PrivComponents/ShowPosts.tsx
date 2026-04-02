"use client";

import { useState } from "react";
import BorderGlow from "@/components/BorderGlow"; 

type PostType = {
  _id: string;
  title: string;
  authorName: string;
  authorId:string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

interface Props {
  initialPosts: PostType[];
}

export default function ShowPostsClient({ initialPosts }: Props) {
  // Client-side state
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [search, setSearch] = useState("");

  // Example: filter posts by title
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      {/* Client-side interaction */}
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 m-4"
      />
      

      {filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {filteredPosts.map((post) => (
            <li key={post._id} >
              
<BorderGlow
  edgeSensitivity={30}
  glowColor="40 80 80"
  backgroundColor="#060010"
  borderRadius={28}
  glowRadius={40}
  glowIntensity={1}
  coneSpread={25}
  animated={false}
  colors={['#c084fc', '#f472b6', '#38bdf8']} 
  className="h-50 m-5"
>
  <div style={{ padding: '2em' }}>
    <h1>{post.authorName}</h1>
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <p>{post.createdAt}</p>
  </div>
</BorderGlow>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}