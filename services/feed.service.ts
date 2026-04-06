import Post from "@/models/post";
import User from "@/models/user";

export const getFeed = async (clerkId: string) => {
  // 1. get current user
  const currentUser = await User.findOne({ clerkId });

  if (!currentUser) throw new Error("User not found");

  // 2. get list of people user follows
  const followingIds = currentUser.following || [];

  // 3. fetch posts of those users
  const posts = await Post.find({
    authorId: { $in: followingIds.map(id => id.toString()) }
  })
    .sort({ createdAt: -1 })
    .lean();

  // 4. format posts (VERY IMPORTANT)
  return posts.map((post: any) => ({
    _id: post._id,
    title: post.title,
    content: post.content,

    authorId: post.authorId,
    authorName: post.authorName,
    authorImage: post.authorImage,

    likesCount: post.likedBy?.length || 0,
    isLiked: post.likedBy?.includes(clerkId) || false,

    commentsCount: post.comments?.length || 0,

    createdAt: post.createdAt,
  }));
};