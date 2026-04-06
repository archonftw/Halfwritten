import User from "@/models/user";

export const getCurrentUser = async (clerkId: string) => {
  const user = await User.findOne({ clerkId });

  if (!user) throw new Error("User not onboarded");

  return {
    _id: user._id,
    anonymousName: user.anonymousName,
    bio: user.bio,
    avatarSeed: user.avatarSeed,
    followersCount: user.followers.length,
    followingCount: user.following.length,
  };
};

export const syncUser = async (clerkId: string, clerkUser: any) => {
  let user = await User.findOne({ clerkId });

  // already exists → return
  if (user) return user;

  // create new user
  user = await User.create({
    clerkId,
    anonymousName:
      clerkUser.username ||
      clerkUser.firstName ||
      "anonymous_" + Math.floor(Math.random() * 10000),

    bio: "",
    avatarSeed:
      clerkUser.username ||
      clerkUser.firstName ||
      "halfwritten",

    followers: [],
    following: [],
  });

  return user;
};