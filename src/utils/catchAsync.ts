import { NextFunction, Response, Request } from "express";

export const catchAsync =
  (fn: Function) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      return await Promise.resolve(fn(req, res, next));
    } catch (err) {
      return next(err);
    }
  };
