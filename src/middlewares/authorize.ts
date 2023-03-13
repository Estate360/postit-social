import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.models";
import AppErrorHandler from "../utils/app.errors";
import { catchAsync } from "../utils/catchAsync";

interface CustomRequest extends Request {
  user?: any;
}

interface MyTokenPayload extends JwtPayload {
  // Define any additional properties for the token payload
  userId: string;
}
async function verifyToken(token: string): Promise<MyTokenPayload> {
  const secret = process.env.JWT_SECRET as string;
  const decoded = jwt.verify(token, secret) as MyTokenPayload;
  return await decoded;
}

export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Get token and check if it exist
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);
    if (!token)
      return next(
        new AppErrorHandler(
          "You are not logged in, please provide your token to gain access",
          401
        )
      );

    //2) Verification token
    const decoded = await verifyToken(token);
    console.log(decoded.userId); // Prints the user ID from the token payload

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser)
      return next(
        new AppErrorHandler(
          "The user belonging to this token does no longer exist.",
          401
        )
      );

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  }
);
