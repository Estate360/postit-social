import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import AppErrorHandler from "../utils/app.errors";
import mongoSanitize from "express-mongo-sanitize";
import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();
// console.log(app.get("env"));

interface CustomRequest extends Request {
  requestTime?: any;
}

//Global Middleware
app.use(cors()); // allow cross-origin request

app.use(express.json()); // Use JSON parser middleware
//middleware for updating data.
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(mongoSanitize()); //Data sanitization against NoSQL query injection

//Development login
if (process.env.NODE_ENV === "development") {
  console.log(process.env.NODE_ENV);
  // console.log(process.env);
  app.use(morgan("dev"));
}

//Text middleware
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  console.log(req.cookies);
  next();
});

//Wrong route error handler middleware
app.all("*", (err: Error, req: Request, res: Response, next: NextFunction) => {
  next(
    new AppErrorHandler(`Can't find ${req.originalUrl} on this Server!`, 404)
  );
  console.log(err.stack);
});

export default app;
