import { Router } from "express";
import mongoose from "mongoose";
import { getCurrentUserId } from "../helpers/getCurrentUserId.js";
import { JobApplicationModel } from "../models/JobApplication.js";
import type { JobStage } from "@recall/types";

export const dashboardRouter = Router();

/** GET /api/dashboard — pipeline metrics via MongoDB aggregation. */
dashboardRouter.get("/", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.sub, res);
  if (!userId) return;

  const userObjectId = new mongoose.Types.ObjectId(userId);

  try {
    const [result] = await JobApplicationModel.aggregate<{
      total: { count: number }[];
      active: { count: number }[];
      rejected: { count: number }[];
      offers: { count: number }[];
      byStage: { _id: JobStage; count: number }[];
    }>([
      { $match: { userId: userObjectId } },
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [{ $match: { stage: { $ne: "Rejected" } } }, { $count: "count" }],
          rejected: [{ $match: { stage: "Rejected" } }, { $count: "count" }],
          offers: [{ $match: { stage: "Offer" } }, { $count: "count" }],
          byStage: [
            { $group: { _id: "$stage", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const total = result?.total?.[0]?.count ?? 0;
    const active = result?.active?.[0]?.count ?? 0;
    const rejected = result?.rejected?.[0]?.count ?? 0;
    const offers = result?.offers?.[0]?.count ?? 0;
    const byStage = (result?.byStage ?? []).map((s) => ({
      stage: s._id,
      count: s.count,
    }));
    const conversionRate = total > 0 ? Math.round((offers / total) * 10000) / 100 : 0;

    res.json({
      total,
      active,
      rejected,
      offers,
      byStage,
      conversionRate,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load dashboard metrics" });
  }
});
