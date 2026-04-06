import User from "@/models/user";

export const getUserProfile = async (targetUserId: string, clerkId?: string) => {
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) throw new Error("User not found");

  let isFollowing = false;
  let isOwnProfile = false;

  if (clerkId) {
    const currentUser = await User.findOne({ clerkId });

    if (currentUser) {
      isOwnProfile =
        currentUser._id.toString() === targetUser._id.toString();

      isFollowing =
        currentUser.following?.some(
          (id: any) => id.toString() === targetUser._id.toString()
        ) || false;
    }
  }

  return {
    _id: targetUser._id,
    anonymousName: targetUser.anonymousName,
    bio: targetUser.bio,
    avatarSeed: targetUser.avatarSeed || targetUser.anonymousName,
    followersCount: targetUser.followers.length,
    followingCount: targetUser.following.length,
    isFollowing,
    isOwnProfile,
  };
};

export const getFollowers = async (userId: string) => {
  const user = await User.findById(userId).populate(
    "followers",
    "anonymousName bio avatarSeed"
  );

  if (!user) throw new Error("User not found");

  return user.followers.map((f: any) => ({
    _id: f._id,
    anonymousName: f.anonymousName,
    bio: f.bio || "",
    avatarSeed: f.avatarSeed || f.anonymousName,
  }));
};

export const getFollowing = async (userId: string) => {
  const user = await User.findById(userId).populate(
    "following",
    "anonymousName bio avatarSeed"
  );

  if (!user) throw new Error("User not found");

  return user.following.map((f: any) => ({
    _id: f._id,
    anonymousName: f.anonymousName,
    bio: f.bio || "",
    avatarSeed: f.avatarSeed || f.anonymousName,
  }));
};

export const followUser = async (clerkId: string, targetUserId: string) => {
  const currentUser = await User.findOne({ clerkId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) throw new Error("User not found");

  if (currentUser.following.includes(targetUser._id)) return;

  currentUser.following.push(targetUser._id);
  targetUser.followers.push(currentUser._id);

  await currentUser.save();
  await targetUser.save();
};

export const unfollowUser = async (clerkId: string, targetUserId: string) => {
  const currentUser = await User.findOne({ clerkId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) throw new Error("User not found");

  currentUser.following = currentUser.following.filter(
    (id: any) => id.toString() !== targetUserId
  );

  targetUser.followers = targetUser.followers.filter(
    (id: any) => id.toString() !== currentUser._id.toString()
  );

  await currentUser.save();
  await targetUser.save();
};