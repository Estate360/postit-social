import * as crypto from "crypto";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/user.models";
import { IUserDoc } from "../interfaces/user.interface";
import AppErrorHandler from "../utils/app.errors";
import { sendEmail } from "../utils/email";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
}

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;
    // console.log(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return next(new AppErrorHandler("User already exists!", 409));

    // Create new user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });
    newUser.passwordConfirm = undefined;

    // Return token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    console.log(token);

    res.status(201).json({
      message: "User signed up successfully.",
      token,
      data: {
        newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // Check if user exists
    const user: IUserDoc | null = await User.findOne({ email }).select(
      "+password"
    );
    if (!user)
      return next(new AppErrorHandler("Invalid email or password!", 401));

    // Check password match
    const matchPassword = await bcrypt.compare(password, user.password!);
    if (!matchPassword)
      return next(new AppErrorHandler("Invalid email or password!", 401));

    //If all is correct, return token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token });
  }
);

export const restrictTo =
  (role: string) => (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!role.includes(req.user.role))
      return next(
        new AppErrorHandler(
          "You do not have permission to perform this action",
          403
        )
      );
    next();
  };

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (req.body.email == null) {
      return next(new AppErrorHandler("Please provide your email", 403));
    } else if (!user) {
      return next(
        new AppErrorHandler(
          `User with the email address: ${req.body.email} does not exist`,
          404
        )
      );
    }

    // 2) Generate the random reset token
    const resetToken = user.correctPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to the users email
    try {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/resetPassword/${resetToken}`;

      const message = `Forgot your password? use this link ${resetURL} and submit your password and confirmPassword`;

      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10mins)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.log(err);

      return next(
        new AppErrorHandler(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    //1) Get user based on token

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //2) Set new password if token has not expired and there is user
    if (!user)
      return next(new AppErrorHandler("Token is Invalid or has Expired!", 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //3) Updated passwordResetAt property for the user\ Check the userModels to find it there
    //4) Log user in and send JWT
    sendJWTResponds(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    //1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    //Null check
    if (!user) {
      return next(new AppErrorHandler("User not found", 404));
    }

    //2) Check if POSTed current password is correct
    if (
      !(await user.comparePassword(req.body.passwordCurrent, user.password))
    ) {
      return next(
        new AppErrorHandler("Your username or password id incorrect!", 401)
      );
    }
    //3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //4) Log user in, send JWT(now logged in with new password)
    sendJWTResponds(user, 200, res);

    // next();
  }
);

const signToken = function (id: any) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendJWTResponds = (
  user: IUserDoc | any,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);
  user.password = undefined;
  // user.passwordConfirm = undefined;
  // console.log(token);
  res.status(statusCode).json({
    status: "successfully",
    token,
    data: {
      user,
    },
  });
};
