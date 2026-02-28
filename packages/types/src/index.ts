export interface User {
  id: string;
  auth0Id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCreate {
  auth0Id: string;
  name: string;
  email: string;
}

export const JOB_STAGES = [
  "Wishlist",
  "Applied",
  "Screening",
  "Technical",
  "Final Interview",
  "Offer",
  "Rejected",
] as const;

export type JobStage = (typeof JOB_STAGES)[number];

export interface Interview {
  id: string;
  date: string; // ISO
  title?: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  description?: string;
  stage: JobStage;
  order: number;
  status?: string;
  appliedDate?: string; // ISO
  notes?: string;
  resumeId?: string;
  interviews: Interview[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JobApplicationCreate {
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  description?: string;
  stage: JobStage;
  status?: string;
  appliedDate?: string;
  notes?: string;
}

export interface JobApplicationUpdate {
  companyName?: string;
  jobTitle?: string;
  jobUrl?: string;
  description?: string;
  stage?: JobStage;
  order?: number;
  status?: string;
  appliedDate?: string;
  notes?: string;
  resumeId?: string;
  interviews?: Interview[];
}
