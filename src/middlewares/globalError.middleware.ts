import { Response, Request, NextFunction } from "express";
import AppErrorHandler from "../utils/app.errors";

interface CustomError extends Error {
  path: string;
  kind: string;
  status: string;
  message: string;
  _message: string;
  statusCode: number;
  isOperational: boolean;
}

//CastError Handler
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppErrorHandler(message, 400);
};
// const handleValidationError = (err: any) => {

//   const errors = Object.values(err.errors).map((el) => el.message);

//   const message = `Invalid input data. ${errors.join(". ")}`;
//   return new AppErrorHandler(message, 400);
// };
const handleValidationError = (err: any) => {
  // const errors: string[] = [];

  // for (let key in err.errors) {
  //   if (err.errors.hasOwnProperty(key)) {
  //     errors.push(err.errors[key].message);
  //   }
  // }

  const message = `Invalid input data. Input can not be empty!!}`;
  return new AppErrorHandler(message, 400);
};

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
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError" || error.kind === "ObjectId")
      error = handleCastErrorDB(error);
    if (error._message === "Postit validation failed")
      error = handleValidationError(error);
    sendProdError(error, req, res);
  }
};

export default globalErrorHandler;
