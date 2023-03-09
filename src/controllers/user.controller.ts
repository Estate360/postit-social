import { Request, Response, NextFunction } from "express";
import User from "../models/user.models";
import APIQueryFeatures from "../utils/apiQueryFeatures";
import AppErrorHandler from "../utils/app.errors";
import { catchAsync } from "../utils/catchAsync";

export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error!",
    message: `This route is not defined!, please use ${
      req.protocol
    }://${req.get("host")}/api/v1/users/signup`,
  });
};

export const getOneUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      const appError = new AppErrorHandler(
        `No User found with the ID: ${req.params.id}`,
        404
      );
      res.status(appError.statusCode).json({
        status: appError.status,
        message: appError.message,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Users successfully fetched",
      result: user.length,
      data: {
        user,
      },
    });
  }
);

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const query = req.query.new;
    // const user = query
    //   ? await User.find().sort({ _id: -1 }).limit(3)
    //   : await User.find();
 
     //EXECUTE QUERY
     const features = new APIQueryFeatures(User.find(), req.query as Record<string, string>)
       .filter()
       .sort()
       .limitField()
       .paginate();
     const user = await features.query;

    res.status(200).json({
      status: "success",
      message: "All users successfully fetched",
      result: user.length,
      data: {
        user,
      },
    });
  }
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      const appError = new AppErrorHandler(
        `User with ID: ${req.params.id} not found!`,
        404
      );
      res.status(appError.statusCode).json({
        status: appError.status,
        message: appError.message,
      });
      return;
    }

    res.status(200).json({
      message: "user updated successfully",
      status: "success",
      result: user.length,
      data: {
        user,
      },
    });
  }
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const appError = new AppErrorHandler(
        `No user found with the ID: ${req.params.id}. Not deleted!`,
        404
      );
      res.status(appError.statusCode).json({
        status: appError.status,
        message: appError.message,
      });
      return;
    }

    res.status(200).json({
      message: `user with the ID: ${user} deleted`,
      status: "success",
      data: null,
    });
  }
);

interface CustomRequest extends Request {
  user?: any;
}

export const deleteMyAccount = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  await User.findOneAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "successful",
    data: null,
  });
};

