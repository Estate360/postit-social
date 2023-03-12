import mongoose, { Schema } from "mongoose";
import { IComment } from "../interfaces/comment.interface";

const commentSchema = new Schema<IComment>(
  {
    postitId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },
    comments: [
      {
        author: {
          type: Schema.Types.ObjectId,
          ref: "User",
          index: true,
        },
        authorName: String,
        authorUserName: String,
        comment: { type: String },
        time: { type: Date, default: new Date() },
        sorter: { type: Number },
        subComments: [
          {
            author: {
              type: Schema.Types.ObjectId,
              ref: "User",
              index: true,
            },
            authorName: String,
            authorUserName: String,
            comment: { type: String },
            time: { type: Date, default: new Date() },
            sorter: { type: Number },
          },
        ],
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

export const commentModel = mongoose.model<IComment>("Comment", commentSchema);
