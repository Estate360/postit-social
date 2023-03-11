import { Request, Response, NextFunction } from "express";
import User from "../models/user.models";
import APIQueryFeatures from "../utils/apiQueryFeatures";
import AppErrorHandler from "../utils/app.errors";
import { catchAsync } from "../utils/catchAsync";

interface CustomRequest extends Request {
  user?: any;
}
//Here we created a function "filterObj".
const filterObj = (obj: { [x: string]: any }, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el: any) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
    const features = new APIQueryFeatures(
      await User.find(),
      req.query as Record<string, string>
    )
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
    if (!user)
      return next(
        new AppErrorHandler(
          `No user found with the ID: ${req.params.id}. User Not Deleted!`,
          404
        )
      );

    res.status(200).json({
      message: `user with the ID: ${user} deleted`,
      status: "success",
      data: null,
    });
  }
);

export const deleteMyAccount = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  await User.findOneAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
};

export const getMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // req.params.id = req.user.id;
    const me = await User.findById(req.user.id);
    if (!me) return next(new AppErrorHandler("Error Retrieving Profile!", 400));
    res.status(200).json({
      status: "success",
      myProfile: me,
    });
  }
);

export const updateMyData = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppErrorHandler(
          "This route is not for password update. Please use /updateMyPassword",
          400
        )
      );
    }

    // 2) Filtered out unwanted fields that are not allowed to be updated, by creating a function "filterObj"
    const filteredBody = filterObj(req.body, "name", "email");

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "successful",
      data: {
        user: updatedUser,
      },
    });
  }
);
