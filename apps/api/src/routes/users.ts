import { Router } from "express";
import { UserModel } from "../models/User.js";
import { Auth0Service } from "../services/auth0.js";

export const usersRouter = Router();

/** Sync or create user from JWT (Auth0). Called after login. */
usersRouter.post("/sync", async (req, res) => {
  try {
    const sub = req.auth?.payload?.sub;
    if (!sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const auth0Service = new Auth0Service();
    const userInfo = await auth0Service.getUserInfo(req.auth?.token ?? '');
    const name = userInfo.name;
    const email = userInfo.email;
    const picture = userInfo.picture;
    const user = await UserModel.findOneAndUpdate(
      { auth0Id: sub },
      { $set: { name, email, updatedAt: new Date(), picture } },
      { new: true, upsert: true }
    );

    return res.json({
      id: user._id.toString(),
      auth0Id: user.auth0Id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to sync user" });
  }
});

/** Get current user. */
usersRouter.get("/me", async (req, res) => {
  try {
    const sub = req.auth?.payload?.sub;
    if (!sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await UserModel.findOne({ auth0Id: sub }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      id: user._id.toString(),
      auth0Id: user.auth0Id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to get user" });
  }
});
