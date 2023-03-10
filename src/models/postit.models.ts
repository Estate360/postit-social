import mongoose from "mongoose";
import { IPostit } from "../interfaces/postit.interface";

const postitSchema = new mongoose.Schema<IPostit>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the post author!"],
    },
    content: {
      type: String,
      required: true,
    },
    media: [
      {
        type: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


export const PostitModel = mongoose.model<IPostit>("Postit", postitSchema);