import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
    },
    authorImage: {
      type: String,
    },
    likedBy: {
      type: [String],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent OverwriteModelError in Next.js dev mode
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;