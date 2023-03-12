import { Postit } from "../models/postit.models";
import User from "../models/user.models";
import AppErrorHandler from "../utils/app.errors";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { sortByDate, sortByFilter } from "../utils/sorter";

interface CustomRequest extends Request {
  userId: any;
  postit?: any;
}

interface SortedPosts {
  status: string;
  sortedPosts: typeof Postit[];
}

const postController: Record<string, any> = {};

// create post
postController.createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { feedback, postTag } = req.body;

    if (!feedback || !postTag)
      return next(
        new AppErrorHandler("Cannot Post Empty Feedback Or Tag", 401)
      );

    const newPost = await Postit.create({
      title: req.body.title,
      feedback: req.body.feedback,
      author: req.body.author,
      authorName: req.body.authorName,
      authorUserName: req.body.authorUserName,
      postTag: req.body.postTag,
    });

    if (!newPost)
      return next(new AppErrorHandler("Could Not Create Post", 400));

    res.status(200).json({
      message: "Post Created Successfully!",
      newPost,
    });
  }
);

postController.getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sortBy, filter } = req.query;

    let sortedPosts;
    const sortFunc = sortByFilter(sortBy?.toString() || "");
    if (filter === "all" || !filter) {
      sortedPosts = await Postit.find({}).select("-isDeleted -__v");
    } else {
      sortedPosts = await Postit.aggregate([{ $match: { postTag: filter } }]);
    }
    sortedPosts.sort(sortFunc || sortByDate);
    if (!sortedPosts) {
      return next(new AppErrorHandler("Could Not Fetch Posts!", 400));
    }

    res.status(200).json({
      status: "success",
      result: sortedPosts.length,
      sortedPosts,
    } as SortedPosts);
  }
);

// delete post
postController.deletePost = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // const postId = req.params?.postitId;
    const currPostit = await Postit.findById(req.params.id);

    if (!currPostit)
      return next(
        new AppErrorHandler(`Post with id: ${req.params.id} not found!`, 404)
      );

    await Postit.findByIdAndUpdate(req.params.id, { isDeleted: true });
    const deletedPostit = await Postit.findById(req.params.id);
    if (deletedPostit?.isDeleted === true)
      return next(
        new AppErrorHandler(
          `Post with id: ${req.params.id} already deleted!`,
          404
        )
      );
    res.status(200).json({
      status: "success",
      data: null,
    });
  }
);

// upvote post
postController.upvote = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let id = req.params.userId;
    const currPostit = await Postit.findById(req.params.id);
    if (!currPostit)
      return next(
        new AppErrorHandler(`Post with id: ${req.params.id} not found!`, 400)
      );

    if (currPostit?.upvoters.includes(id)) {
      currPostit.upvoters.splice(currPostit.upvoters.indexOf(id), 1);
      currPostit.upvotes -= 1;
      res.status(200).json({
        status: "success",
        message: "Downvote Successful",
      });
    } else {
      currPostit.upvoters.push(id);
      currPostit.upvotes += 1;
    }
    await currPostit.save();
    res.status(200).json({
      status: "success",
      message: "Upvote Successful!",
    });
    return;
  }
);

// get one post
postController.getOnePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const postId = req.params.id;
    const result = await Postit.findById(req.params.id);

    if (!result)
      return next(new AppErrorHandler("Could Not Retrieve Post!", 400));

    res.status(200).json({
      message: "Post Retrieved Successfully!",
      result,
    });
  }
);

export default postController;
