import { Document, Model, Schema } from "mongoose";

interface IUser {
  userId: Schema.Types.ObjectId;
  // Define other user properties here
}

interface IPost {
  postId: Schema.Types.ObjectId;
  // Define other post properties here
}

interface ISubComment {
  author: IUser;
  authorName: string;
  authorUserName: string;
  comment: string;
  time: Date;
  sorter: number;
}

interface IComment extends Document {
  postId: IPost;
  comments: {
    author: IUser;
    authorName: string;
    authorUserName: string;
    comment: string;
    time: Date;
    sorter: number;
    subComments: ISubComment[];
  }[];
  created_at: Date;
  updated_at: Date;
}

// interface ICommentModel extends Model<IComment> {}

export { ISubComment, IComment };
