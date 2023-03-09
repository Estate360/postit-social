import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { IUserDoc, IUserModel } from "../interfaces/user.interface";

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
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please input your password"],
      minlength: 8,
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

userSchema.methods.changedPasswordAfter = function (
  JWTTimeStamp: number
): boolean {
  if (this.passwordResetAt) {
    console.log(this.passwordResetAt, JWTTimeStamp);
  }
  if (this.passwordResetAt) {
    const changedTimeStamp = parseInt(
      (this.passwordResetAt.getTime() / 1000).toString(),
      10
    );
    console.log(changedTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimeStamp;
  }

  //False means not changed
  return false;
};

userSchema.methods.correctPasswordResetToken = function (
  this: IUserDoc
): string {
  const resetToken = crypto.randomBytes(30).toString("hex");

  this.passwordResetToken = crypto //This is the encrypted version of the token that will be stored in the DB.
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); //this is the time when the passwordResetToken stored in the DB will expire. This one is  not sent to the user

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
