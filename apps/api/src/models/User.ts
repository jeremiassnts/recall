import type { User as UserType } from "@recall/types";
import mongoose, { Schema, model } from "mongoose";

export interface UserDocument
  extends Omit<UserType, "id">,
  mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<UserDocument>(
  {
    auth0Id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.index({ auth0Id: 1 });

export const UserModel = model<UserDocument>("User", userSchema);
