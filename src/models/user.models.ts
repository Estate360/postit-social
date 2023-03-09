import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import  { IUserDoc,IUserModel } from "../interfaces/user.interface";


const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Please input your name"],
    },
    email: {
      type: String,
      required: [true, "Please input your email"],
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please input your password"],
      minlength: 8,
      //with this select set to "false", the password will not be visible when required
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password "],
    },
    passwordResetAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//This function here is gonna run right b4 a new document is saved (pre save middleware)
//PASSWORD ENCRYPTION STEP
userSchema.pre<IUserDoc>("save", async function (next) {
  // This only works if the password is modified
  if (!this.isModified("password")) return next();

  //Hash the password with cost/salt of 10
  this.password = await bcrypt.hash(this.password, 10);

  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;
});

userSchema.pre<IUserDoc>("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordResetAt = (await Date.now()) - 1000; //1 sec is subtracted to ensure that the token (which is meant to be sent after resetting password) is created after the password has been changed
  next();
});

userSchema.pre<IUserDoc>("find", function (next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

//THESE SCHEMA'S ARE INSTANCE METHODS, THEY'RE AVAILABLE AT ANY OF THE USER MODULE/DOCUMENT.
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
