import { JOB_STAGES, type JobStage } from "@recall/types";
import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { getCurrentUserId } from "../helpers/getCurrentUserId.js";
import { JobApplicationModel } from "../models/JobApplication.js";

const interviewSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string().optional(),
  notes: z.string().optional(),
});

const createBodySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  stage: z.enum(JOB_STAGES as unknown as [string, ...string[]]),
  status: z.string().optional(),
  appliedDate: z.string().optional(),
  notes: z.string().optional(),
  resumeId: z.string().optional(),
});

const updateBodySchema = z.object({
  companyName: z.string().min(1).optional(),
  jobTitle: z.string().min(1).optional(),
  jobUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  stage: z.enum(JOB_STAGES as unknown as [string, ...string[]]).optional(),
  order: z.number().int().min(0).optional(),
  status: z.string().optional(),
  appliedDate: z.string().optional(),
  notes: z.string().optional(),
  resumeId: z.string().nullable().optional(),
  interviews: z.array(interviewSchema).optional(),
});

function toResponse(doc: {
  _id: { toString: () => string };
  userId: { toString: () => string };
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  description?: string;
  stage: string;
  order: number;
  status?: string;
  appliedDate?: Date;
  notes?: string;
  resumeId?: string;
  interviews: { id: string; date: string; title?: string; notes?: string }[];
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    companyName: doc.companyName,
    jobTitle: doc.jobTitle,
    jobUrl: doc.jobUrl,
    description: doc.description,
    stage: doc.stage,
    order: doc.order,
    status: doc.status,
    appliedDate: doc.appliedDate?.toISOString().slice(0, 10),
    notes: doc.notes,
    resumeId: doc.resumeId,
    interviews: doc.interviews ?? [],
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

export const applicationsRouter = Router();

/** List applications for current user. Query: stage (optional). */
applicationsRouter.get("/", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  const stage = typeof req.query.stage === "string" ? req.query.stage : undefined;
  const filter: { userId: mongoose.Types.ObjectId; stage?: string } = {
    userId: new mongoose.Types.ObjectId(userId),
  };
  if (stage) filter.stage = stage;

  try {
    const list = await JobApplicationModel.find(filter)
      .sort({ order: 1, appliedDate: -1, createdAt: -1 })
      .lean();
    res.json(list.map(toResponse));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to list applications" });
  }
});

const reorderBodySchema = z.object({
  stage: z.enum(JOB_STAGES as unknown as [string, ...string[]]),
  applicationIds: z.array(z.string().min(1)).min(0),
});

/** Reorder applications within a stage. Sets stage and order for each id by index. */
applicationsRouter.patch("/reorder", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  const parsed = reorderBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }

  const { stage, applicationIds } = parsed.data;
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const stageValue = stage as JobStage;

  try {
    const ids = applicationIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const bulkOps = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(id), userId: userObjectId },
        update: { $set: { stage: stageValue, order: index } },
      },
    }));
    if (bulkOps.length === 0) {
      return res.json({ updated: 0 });
    }
    const result = await JobApplicationModel.bulkWrite(bulkOps);
    return res.json({ updated: result.modifiedCount + result.upsertedCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to reorder applications" });
  }
});

/** Get one application by id. */
applicationsRouter.get("/:id", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    const doc = await JobApplicationModel.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    if (!doc) return res.status(404).json({ error: "Application not found" });
    res.json(toResponse(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get application" });
  }
});

/** Create application. */
applicationsRouter.post("/", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  const parsed = createBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const maxOrder = await JobApplicationModel.findOne(
    { userId: new mongoose.Types.ObjectId(userId) },
    { order: 1 },
    { sort: { order: -1 } }
  ).lean();
  const order = (maxOrder?.order ?? -1) + 1;

  try {
    const doc = await JobApplicationModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobUrl: data.jobUrl || undefined,
      description: data.description,
      stage: data.stage,
      order,
      status: data.status,
      appliedDate: data.appliedDate ? new Date(data.appliedDate) : undefined,
      notes: data.notes,
      resumeId: data.resumeId,
      interviews: [],
    });
    res.status(201).json(toResponse(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create application" });
  }
});

/** Update application. */
applicationsRouter.patch("/:id", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  const parsed = updateBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const update: Record<string, unknown> = {};
  if (data.companyName !== undefined) update.companyName = data.companyName;
  if (data.jobTitle !== undefined) update.jobTitle = data.jobTitle;
  if (data.jobUrl !== undefined) update.jobUrl = data.jobUrl || undefined;
  if (data.description !== undefined) update.description = data.description;
  if (data.stage !== undefined) update.stage = data.stage;
  if (data.order !== undefined) update.order = data.order;
  if (data.status !== undefined) update.status = data.status;
  if (data.appliedDate !== undefined)
    update.appliedDate = data.appliedDate ? new Date(data.appliedDate) : null;
  if (data.notes !== undefined) update.notes = data.notes;
  if (data.resumeId !== undefined) update.resumeId = data.resumeId;
  if (data.interviews !== undefined) update.interviews = data.interviews;

  try {
    const doc = await JobApplicationModel.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) },
      { $set: update },
      { new: true }
    ).lean();
    if (!doc) return res.status(404).json({ error: "Application not found" });
    res.json(toResponse(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update application" });
  }
});

/** Delete application. */
applicationsRouter.delete("/:id", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    const result = await JobApplicationModel.deleteOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Application not found" });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete application" });
  }
});
