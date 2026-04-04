"use client";

import { useEffect, useMemo, useState } from "react";
import GradientText from "@/components/GradientText";
import { useUser } from "@clerk/nextjs";
import { Heart, Bookmark, FileText, Users, UserPlus } from "lucide-react";
import TargetCursor from "@/components/TargetCursor";
import { loveFont } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import OnboardingGuard from '@/PrivComponents/onboardingGuard'
import Link from "next/link";


type PostType = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  likesCount?: number;
};

type AppUserType = {
  _id: string;
  anonymousName: string;
  bio?: string;
  avatarSeed?: string;
  followers?: string[];
  following?: string[];
};

function Page() {
  const { user, isLoaded } = useUser();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [appUser, setAppUser] = useState<AppUserType | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState<"chapters" | "saved">("chapters");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoadingProfile(true);
        const res = await fetch("/api/user/me");
        const data = await res.json();

        if (data.success) {
          setAppUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch app user profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchMyPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch("/api/post/mine");
        const data = await res.json();

        if (data.success) {
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Failed to fetch profile posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (isLoaded && user) {
      fetchProfileData();
      fetchMyPosts();
    } else if (isLoaded && !user) {
      setLoadingPosts(false);
      setLoadingProfile(false);
    }
  }, [isLoaded, user]);

  const totalLikes = useMemo(() => {
    return posts.reduce((acc, post) => acc + (post.likesCount || 0), 0);
  }, [posts]);

  const initials = useMemo(() => {
    if (!appUser?.anonymousName) return "HW";
    return appUser.anonymousName.slice(0, 2).toUpperCase();
  }, [appUser]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white">
        <TargetCursor />
        <div>
          <GradientText
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            animationSpeed={4}
            showBorder={false}
            className={`ml-0 text-8xl ${loveFont.className}`}
          >
            Writer&apos;s Corner
          </GradientText>
        </div>

        <div className="h-[calc(100vh-6rem)] w-full flex items-center justify-center">
          <div className="outline w-[90%] h-[95%] rounded-lg flex items-center justify-center text-zinc-400">
            Loading your corner...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <TargetCursor />
        <div>
          <GradientText
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            animationSpeed={4}
            showBorder={false}
            className={`ml-0 text-8xl ${loveFont.className}`}
          >
            Writer&apos;s Corner
          </GradientText>
        </div>

        <div className="h-[calc(100vh-6rem)] w-full flex items-center justify-center">
          <div className="outline w-[90%] h-[95%] rounded-lg flex items-center justify-center flex-col gap-3 text-zinc-400">
            <p className="text-xl">You&apos;re not signed in.</p>
            <p className="text-sm">Sign in to view your chapters.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-black text-white">
      <TargetCursor />

      {/* Heading */}
      <div>
        <GradientText
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          animationSpeed={4}
          showBorder={false}
          className={`ml-0 text-8xl ${loveFont.className}`}
        >
          Writer&apos;s Corner
        </GradientText>
      </div>

      {/* Main outlined area */}
      <div className="h-[calc(100vh-6rem)] w-full flex items-center justify-center">
        <div className="outline w-[90%] h-[95%] rounded-lg p-5 md:p-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">

            {/* LEFT SIDEBAR */}
            <div className="border border-zinc-800 rounded-2xl bg-zinc-950/60 backdrop-blur-sm p-5 h-fit lg:h-full overflow-y-auto">
              <div className="flex flex-col items-center text-center">
                {/* Anonymous Avatar */}
                <img
  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${appUser?.avatarSeed || appUser?.anonymousName || "halfwritten"}`}
  alt={appUser?.anonymousName || "Anonymous avatar"}
  className="w-24 h-24 rounded-full border border-zinc-700 bg-black"
/>

                {/* Anonymous Name */}
                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {loadingProfile
                    ? "Loading..."
                    : appUser?.anonymousName || "anonymous_writer"}
                </h2>

                {/* Bio */}
                <p className="mt-4 text-sm italic text-zinc-300 leading-relaxed">
                  {loadingProfile
                    ? "Loading your story..."
                    : appUser?.bio?.trim()
                    ? appUser.bio
                    : "Some stories stayed longer than people did."}
                </p>
              </div>

              {/* Social Stats */}
              <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <FileText size={16} />
                    Chapters
                  </span>
                  <span className="font-semibold text-white">{posts.length}</span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Heart size={16} />
                    Hearts Received
                  </span>
                  <span className="font-semibold text-white">{totalLikes}</span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Users size={16} />
                    Followers
                  </span>
                  <span className="font-semibold text-white">
                    {appUser?.followers?.length || 0}
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <UserPlus size={16} />
                    Following
                  </span>
                  <span className="font-semibold text-white">
                    {appUser?.following?.length || 0}
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Bookmark size={16} />
                    Saved Memories
                  </span>
                  <span className="font-semibold text-white">0</span>
                </div>
              </div>

             <Link
  href="/edit-profile"
  className="inline-flex items-center rounded-2xl border border-zinc-800 px-4 py-2 text-sm text-white hover:border-zinc-700 transition"
>
  Edit Profile
</Link>
            </div>

            {/* RIGHT CONTENT */}
            <div className="border border-zinc-900 rounded-2xl bg-zinc-950/40 p-4 md:p-5 flex flex-col h-full overflow-hidden">
              {/* Tabs */}
              <div className="flex gap-3 border-b border-zinc-800 pb-4 shrink-0">
                <button
                  onClick={() => setActiveTab("chapters")}
                  className={`cursor-target px-4 py-2 rounded-xl text-sm transition ${
                    activeTab === "chapters"
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Chapters
                </button>

                <button
                  onClick={() => setActiveTab("saved")}
                  className={`cursor-target px-4 py-2 rounded-xl text-sm transition ${
                    activeTab === "saved"
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Saved
                </button>
              </div>

              {/* Scrollable content */}
              <div className="mt-5 flex-1 overflow-y-auto pr-1 space-y-4">
                {activeTab === "chapters" && (
                  <>
                    {loadingPosts ? (
                      <div className="h-full flex items-center justify-center text-zinc-400">
                        Loading your chapters...
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
                        <p className="text-lg">No chapters yet.</p>
                        <p className="mt-2 text-sm">
                          Some stories are still waiting to be told.
                        </p>
                      </div>
                    ) : (
                      posts.map((post) => (
                        <div
                          key={post._id}
                          className="cursor-target rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-purple-500/30 transition"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg md:text-xl font-semibold text-white">
                              {post.title}
                            </h3>
                            <span className="text-xs text-zinc-500 whitespace-nowrap">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="mt-3 text-zinc-300 line-clamp-3 leading-relaxed">
                            {post.content}
                          </p>

                          <div className="mt-4 flex items-center gap-5 text-sm text-zinc-400">
                            <span className="flex items-center gap-2">
                              <Heart size={16} />
                              {post.likesCount || 0}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {activeTab === "saved" && (
                  <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
                    <p className="text-lg">No saved memories yet.</p>
                    <p className="mt-2 text-sm">
                      The stories you keep close will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    </OnboardingGuard>
  );
}

export default Page;