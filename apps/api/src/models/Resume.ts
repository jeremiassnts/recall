import mongoose, { Schema, model } from "mongoose";

export interface ResumeDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  r2Key: string;
  fileName: string;
  size: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const resumeSchema = new Schema<ResumeDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    r2Key: { type: String, required: true },
    fileName: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1 });

export const ResumeModel = model<ResumeDocument>("Resume", resumeSchema);
