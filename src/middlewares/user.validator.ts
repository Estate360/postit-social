import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import AppErrorHandler from "../utils/app.errors";

export const userSignupValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string()
      .regex(/^\s*\S+(?:\s+\S+)*\s*$/)
      .min(3)
      .message("Name must not be below 3 characters!")
      .required()
      .lowercase(),
    // .trim(),
    username: Joi.string()
      .min(3)
      .message("Username must not be less than 3 characters")
      .required(),
      posts: Joi.array().items(Joi.string()),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(8)
      .required(),
    // passwordConfirm: Joi.ref("password"),
    passwordConfirm: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match!" }),
    role: Joi.string().valid("guest", "admin").default("guest"),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });
  // console.log("Error has occurred", error);
  if (error) return next(new AppErrorHandler(error.details[0].message, 400));
  next();
};

export const userLoginValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //validate user
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) return next(new AppErrorHandler("Invalid field input", 400));
  next();
};
