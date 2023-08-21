// import { NextFunction, Request, Response } from "express";
// import Comment from "../models/comment.model";
// import { Postit } from "../models/postit.models";
// import User from "../models/user.models";
// import { catchAsync } from "../utils/catchAsync";
// import AppErrorHandler from "../utils/app.errors";
// import { ISubComment } from "../interfaces/comment.interface";

// export const postComment = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { comment } = req.body,
//       postId = req.params.postId;

//     if (!comment) return next(new AppErrorHandler("Add a comment", 400));
//     if (!postId) return next(new AppErrorHandler("No post to comment on", 400));

//     const data: ISubComment= {
//       author: req.userId,
//       authorName: req.name,
//       authorUserName: req.username,
//       comment,
//       sorter: 1,
//   }
// );
