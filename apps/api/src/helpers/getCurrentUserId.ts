import { Response } from "express";
import { UserModel } from "../models/User.js";

export async function getCurrentUserId(
  authSub: string | undefined,
  res: Response
): Promise<string | null> {
  if (!authSub) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  const user = await UserModel.findOne({ auth0Id: authSub }).lean();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return null;
  }
  return user._id.toString();
}
