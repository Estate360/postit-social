import Joi from "joi";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/user.models";
import { IUserDoc } from "../interfaces/user.interface";
import AppErrorHandler from "../utils/app.errors";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
}

interface MyTokenPayload extends JwtPayload {
  // Define any additional properties for the token payload
  userId: string;
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
