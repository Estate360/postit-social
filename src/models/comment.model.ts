import mongoose from "mongoose";
import { IComment, ISubComment } from "../interfaces/comment.interface";

const subCommentSchema = new mongoose.Schema<ISubComment>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    authorName: String,
    authorUserName: String,
    comment: { type: String },
    time: { type: Date, default: Date.now },
    sorter: { type: Number },
  },
  {
    _id: false,
  }
);

const commentSchema = new mongoose.Schema<IComment>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          index: true,
        },
        authorName: String,
        authorUserName: String,
        comment: { type: String },
        time: { type: Date, default: Date.now },
        sorter: { type: Number },
        subComments: [subCommentSchema],
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

interface ICommentModel extends mongoose.Model<IComment> {}
const Comment: ICommentModel = mongoose.model<IComment, ICommentModel>(
  "Comment",
  commentSchema
);
export default Comment;
