import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { connectDb } from "./db.js";
import { auth } from "./middleware/auth.js";
import { usersRouter } from "./routes/users.js";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", auth, usersRouter);

async function start() {
  await connectDb();
  app.listen(port, () => {
    console.log(`Recall API listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
