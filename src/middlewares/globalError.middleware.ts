import { Response, Request, NextFunction } from "express";

interface CustomError extends Error {
  status: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
}

const sendDevError = (err: CustomError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendProdError = (err: CustomError, req: Request, res: Response) => {
  //A) API
  if (req.originalUrl.startsWith("/api")) {
    //1) Operational Trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        // error: err,
        status: err.status,
        message: err.message,
      });
    } else {
      //i) Log error
      console.error("ERROR!!!", err);
      //ii) Send generic message
      return res.status(err.statusCode).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    sendProdError(err, req, res);
  }
};

export default globalErrorHandler;
