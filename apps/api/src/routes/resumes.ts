import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import { getCurrentUserId } from "../helpers/getCurrentUserId.js";
import { deleteFromR2, getPresignedDownloadUrl, isR2Configured, uploadToR2 } from "../lib/r2.js";
import { ResumeModel } from "../models/Resume.js";

const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

function isPdf(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).equals(PDF_MAGIC);
}

export const resumesRouter = Router();

/** Upload a resume (PDF). Returns created resume metadata. */
resumesRouter.post("/", upload.single("file"), async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  if (!isR2Configured()) {
    return res.status(503).json({ error: "Resume storage is not configured" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  if (!isPdf(file.buffer)) {
    return res.status(400).json({ error: "File must be a PDF" });
  }
  if (file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB` });
  }

  const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200) || "resume.pdf";
  const id = new mongoose.Types.ObjectId();
  const r2Key = `${userId}/${id.toString()}.pdf`;

  try {
    await uploadToR2(r2Key, file.buffer, "application/pdf");
    const doc = await ResumeModel.create({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
      r2Key,
      fileName: sanitizedName,
      size: file.size,
    });
    res.status(201).json({
      id: doc._id.toString(),
      fileName: doc.fileName,
      size: doc.size,
      createdAt: doc.createdAt?.toISOString(),
    });
  } catch (e) {
    console.error("Resume upload error:", e);
    res.status(500).json({ error: "Failed to upload resume" });
  }
});

/** List current user's resumes. */
resumesRouter.get("/", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  try {
    const list = await ResumeModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
    res.json(
      list.map((doc) => ({
        id: doc._id.toString(),
        fileName: doc.fileName,
        size: doc.size,
        createdAt: doc.createdAt?.toISOString(),
      }))
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to list resumes" });
  }
});

/** Get a presigned URL to download the resume. */
resumesRouter.get("/:id/url", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  if (!isR2Configured()) {
    return res.status(503).json({ error: "Resume storage is not configured" });
  }

  try {
    const doc = await ResumeModel.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    if (!doc) return res.status(404).json({ error: "Resume not found" });

    const url = await getPresignedDownloadUrl(doc.r2Key);
    res.json({ url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get download URL" });
  }
});

/** Delete a resume (from DB and R2). */
resumesRouter.delete("/:id", async (req, res) => {
  const userId = await getCurrentUserId(req.auth?.payload?.sub, res);
  if (!userId) return;

  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  if (!isR2Configured()) {
    return res.status(503).json({ error: "Resume storage is not configured" });
  }

  try {
    const doc = await ResumeModel.findOneAndDelete({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!doc) return res.status(404).json({ error: "Resume not found" });
    await deleteFromR2(doc.r2Key);
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete resume" });
  }
});
