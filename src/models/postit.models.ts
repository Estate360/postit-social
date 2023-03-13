import mongoose from "mongoose";
import { IPostit } from "../interfaces/postit.interface";

const postitSchema = new mongoose.Schema<IPostit>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },
    postit: {
      type: String,
      required: true,
    },
    authorName: String,
    authorUsername: String,
    postTag: {
      type: String,
      enum: ["nigeria", "politics", "football", "bug", "technology"],
      lowercase: true,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    allComments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvoters: [],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

postitSchema.pre<IPostit>(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "-__v -created_at -updated_at",
  });

  next();
});

// postitSchema.pre<IPostit>(/^find/, function (next) {
//   this.populate({
//     path: "comments",
//     select: "-__v -created_at -updated_at",
//   });

//   next();
// });

// postitSchema.pre<IPostit>(/^find/, function (next) {
//   this.populate({
//     path: "allComments",
//     select: "-__v -created_at -updated_at",
//   });

//   next();
// });

export const Postit = mongoose.model<IPostit>("Postit", postitSchema);
