import { string } from "joi";
import { Document } from "mongoose";

export interface IPostit extends Document {
  author: string | any;
  authorName: string;
  authorUsername: string;
  comments: string;
  title: string;
  allComments: string | {};
  postTag: string;
  upvotes: number;
  upvoters: string[];
  isDeleted: boolean;
  postit: string;
  createdAt: Date;
  updatedAt: Date;
}
