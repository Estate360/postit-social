import { Document, Model } from "mongoose";

interface IUserDoc extends Document {
  find(arg0: { active: { $ne: boolean; }; }): unknown;
  name: string;
  email: string;
  photo: string;
  role: "user" | "guide" | "lead-guide" | "admin";
  password: string;
  passwordConfirm?: string;
  passwordResetAt?: Date| number;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean;

  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimeStamp: number): boolean;
  correctPasswordResetToken(): string;
}

interface IUserModel extends Model<IUserDoc> {}

export { IUserDoc, IUserModel };
