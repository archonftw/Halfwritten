"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import OnboardingGuard from "@/PrivComponents/onboardingGuard";
import ProfileView from "@/PrivComponents/ProfileView";

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
  followersCount?: number;
  followingCount?: number;
};

export default function Page() {
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

  return (
    <OnboardingGuard>
      <ProfileView
        profileUser={appUser}
        posts={posts}
        loadingProfile={loadingProfile}
        loadingPosts={loadingPosts}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalLikes={totalLikes}
        isOwnProfile={true}
      />
    </OnboardingGuard>
  );
}