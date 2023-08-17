import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import AppErrorHandler from "../utils/app.errors";
import mongoSanitize from "express-mongo-sanitize";
import express, { Application, NextFunction, Request, Response } from "express";

import userRoutes from "../routes/user.routes";
import postRoutes from "../routes/postit.routes";
import globalErrorHandler from "./globalError.middleware";

const app: Application = express();

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
  console.log(req.requestTime);
  next();
});

//routers
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", postRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    Welcome: " Welcome To The Home Page Of PostIt API 😎!",
    Author: "Nweke Gospel (aka Estate)",
    Hope: "Relax your nerves, Backend is Tech, Tech is Hope and Hope is Life...",
  });
});
app.get("/estate-api-doc", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/22391163/2s93Jut37y");
});

//Wrong route error handler middleware
app.all("**", (err: Error, req: Request, res: Response, next: NextFunction) => {
  next(
    new AppErrorHandler(`Can't find ${req.originalUrl} on this Server!`, 404)
  );
  console.log(err.stack);
});

app.use(globalErrorHandler);

export default app;
