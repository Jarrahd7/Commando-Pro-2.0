import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export const handler = serverless(app);
export default handler;