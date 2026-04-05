"use client";

import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
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

export default function UserProfilePage({ userId }: { userId: string }) {
  const [profileUser, setProfileUser] = useState<AppUserType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState<"chapters" | "saved">("chapters");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);

        const res = await fetch(`/api/user/by-id/${userId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to load profile.");
          setProfileUser(null);
          return;
        }

        setProfileUser(data.user);
        setIsFollowing(!!data.isFollowing);
        setIsOwnProfile(!!data.isOwnProfile);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
        setProfileUser(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);

        const res = await fetch(`/api/post/by-user/${userId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success) {
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (userId) {
      fetchProfile();
      fetchPosts();
    }
  }, [userId]);

  const totalLikes = useMemo(() => {
    return posts.reduce((acc, post) => acc + (post.likesCount || 0), 0);
  }, [posts]);

  const handleFollowToggle = async () => {
    if (!profileUser) return;

    try {
      setFollowLoading(true);

      const res = await fetch("/api/user/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: profileUser._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Action failed.");
        return;
      }

      toast.success(data.message || "Updated successfully.");
      setIsFollowing(Boolean(data.isFollowing));

      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              followersCount:
                typeof data.followersCount === "number"
                  ? data.followersCount
                  : prev.followersCount,
            }
          : prev
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <ProfileView
        profileUser={profileUser}
        posts={posts}
        loadingProfile={loadingProfile}
        loadingPosts={loadingPosts}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalLikes={totalLikes}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        followLoading={followLoading}
        onFollowToggle={handleFollowToggle}
      />
    </>
  );
}