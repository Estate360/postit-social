import { Document } from "mongoose";

export interface IPostit extends Document {
  author: string | {} | any[];
  content: string;
  media: string[];
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
