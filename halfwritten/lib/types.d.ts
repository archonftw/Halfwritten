export type CommentType = {
  _id?: string; // Mongoose gives this automatically
  userId: string;
  username: string;
  userImage: string;
  text: string;
  createdAt: string; // usually comes as ISO string in frontend
};


export type PostType = {
  _id: string;

  title: string;
  content: string;

  authorId: string;
  authorName?: string;
  authorImage?: string;

  likedBy: string[];

  comments: CommentType[];

  createdAt: string;
  updatedAt: string;
};


export type UserType = {
  _id: string;

  clerkId: string;

  anonymousName: string;
  bio: string;
  avatarSeed: string;

  followers: string[];   // ObjectId → string on frontend
  following: string[];

  usernameUpdatedAt: string | null;

  createdAt: string;
  updatedAt: string;
};