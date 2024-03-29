import { Document, Model } from "mongoose";

interface IUserDoc extends Document {
  find(arg0: { active: { $ne: boolean; }; }): unknown;
  name: string;
  email: string;
  photo: string;
  username:string;
  posts:string;
  role: "user" | "guide" | "lead-guide" | "admin";
  password: string;
  passwordConfirm?: string;
  passwordResetAt?: Date| number| string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active: boolean;
  length: number;
  slug: string;

  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimeStamp: number): boolean;
  correctPasswordResetToken(): string;
}

interface IUserModel extends Model<IUserDoc> {}

export { IUserDoc, IUserModel };
