import "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub?: string;
        name?: string;
        email?: string;
        [key: string]: unknown;
      };
    }
  }
}
