import mongoose, { Schema, model } from "mongoose";
import { JOB_STAGES, type JobStage } from "@recall/types";

const interviewSchema = new Schema(
  {
    id: { type: String, required: true },
    date: { type: String, required: true },
    title: { type: String },
    notes: { type: String },
  },
  { _id: false }
);

export interface JobApplicationDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  description?: string;
  stage: JobStage;
  order: number;
  status?: string;
  appliedDate?: Date;
  notes?: string;
  resumeId?: string;
  interviews: { id: string; date: string; title?: string; notes?: string }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const jobApplicationSchema = new Schema<JobApplicationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobUrl: { type: String },
    description: { type: String },
    stage: { type: String, required: true, enum: JOB_STAGES },
    order: { type: Number, required: true, default: 0 },
    status: { type: String },
    appliedDate: { type: Date },
    notes: { type: String },
    resumeId: { type: String },
    interviews: [interviewSchema],
  },
  { timestamps: true }
);

jobApplicationSchema.index({ userId: 1 });
jobApplicationSchema.index({ userId: 1, stage: 1 });
jobApplicationSchema.index({ userId: 1, appliedDate: -1 });

export const JobApplicationModel = model<JobApplicationDocument>(
  "JobApplication",
  jobApplicationSchema
);
