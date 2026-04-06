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

type NetworkUserType = {
  _id: string;
  anonymousName: string;
  avatarSeed?: string;
  bio?: string;
};

export default function Page() {
  const { user, isLoaded } = useUser();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [appUser, setAppUser] = useState<AppUserType | null>(null);

  const [followers, setFollowers] = useState<NetworkUserType[]>([]);
  const [followingUsers, setFollowingUsers] = useState<NetworkUserType[]>([]);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const [activeTab, setActiveTab] = useState<"chapters" | "saved" | "network">(
    "chapters"
  );
  const [networkTab, setNetworkTab] = useState<"followers" | "following">(
    "followers"
  );

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

    const fetchFollowers = async () => {
  try {
    setLoadingFollowers(true);

    if (!appUser?._id) {
      setFollowers([]);
      return;
    }

    const res = await fetch(`/api/by-id/${appUser._id}`);
    const data = await res.json();

    if (data.success) {
      setFollowers(data.user.followers || []);
    } else {
      setFollowers([]);
      console.error(data.message);
    }
  } catch (error) {
    console.error("Error fetching followers:", error);
    setFollowers([]);
  } finally {
    setLoadingFollowers(false);
  }
};

const fetchFollowing = async () => {
  try {
    setLoadingFollowing(true);

    if (!appUser?._id) {
      setFollowingUsers([]);
      return;
    }

    const res = await fetch(`/api/by-id/${appUser._id}`);
    const data = await res.json();
    console.log("Following data:", data);

    if (data.success) {
      setFollowingUsers(data.user.following || []);
    } else {
      setFollowingUsers([]);
      console.error(data.message);
    }
  } catch (error) {
    console.error("Error fetching following:", error);
    setFollowingUsers([]);
  } finally {
    setLoadingFollowing(false);
  }
};

    if (isLoaded && user) {
      fetchProfileData();
      fetchMyPosts();
      fetchFollowers();
      fetchFollowing();
    } else if (isLoaded && !user) {
      setLoadingPosts(false);
      setLoadingProfile(false);
      setLoadingFollowers(false);
      setLoadingFollowing(false);
    }
    console.log(followingUsers)
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
        networkTab={networkTab}
        setNetworkTab={setNetworkTab}
        followers={followers}
        followingUsers={followingUsers}
        loadingFollowers={loadingFollowers}
        loadingFollowing={loadingFollowing}
        totalLikes={totalLikes}
        isOwnProfile={true}
      />
    </OnboardingGuard>
  );
}