import Post from "@/models/post";
import User from "@/models/user";

export const getPosts = async () => {
  const posts = await Post.find().sort({ createdAt: -1 });

  return posts;
};

export const createPost = async (clerkId: string, body: any) => {
  const user = await User.findOne({ clerkId });

  if (!user) throw new Error("User not found");

  const newPost = await Post.create({
    title: body.title,
    content: body.content,
    authorId: clerkId,
    authorName: user.anonymousName,
    authorImage: `https://api.dicebear.com/7.x/initials/svg?seed=${user.avatarSeed || user.anonymousName}`,
  });

  return newPost;
};

export const getPostById = async (postId: string) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error("Post not found");

  return post;
};

export const deletePost = async (postId: string, clerkId: string) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error("Post not found");

  if (post.authorId !== clerkId) {
    throw new Error("Unauthorized");
  }

  await post.deleteOne();
};

export const likePost = async (clerkId: string, postId: string) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error("Post not found");

  if (!post.likedBy.includes(clerkId)) {
    post.likedBy.push(clerkId);
    await post.save();
  }
};

export const unlikePost = async (clerkId: string, postId: string) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error("Post not found");

  post.likedBy = post.likedBy.filter((id: string) => id !== clerkId);

  await post.save();
};

export const getComments = async (postId: string) => {
  const post = await Post.findById(postId);

  if (!post) throw new Error("Post not found");

  return post.comments;
};

export const addComment = async (clerkId: string, postId: string, text: string) => {
  const user = await User.findOne({ clerkId });
  const post = await Post.findById(postId);

  if (!user || !post) throw new Error("Error");

  const newComment = {
    userId: clerkId,
    username: user.anonymousName,
    userImage: `https://api.dicebear.com/7.x/initials/svg?seed=${user.avatarSeed}`,
    text,
    createdAt: new Date(),
  };

  post.comments.push(newComment);
  await post.save();

  return newComment;
};