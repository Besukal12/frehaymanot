import express from "express";
import { clerkMiddleware } from "@clerk/express";
import mezmurRoutes from "./routes/mezmur/route.js";
import courseRoutes from "./routes/course/route.js";
import announcementRoutes from "./routes/announcement/route.js";
import feedbackRoutes from "./routes/feedback/route.js";

const app = express();

const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontendOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Clerk-Db-Jwt",
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/mezmur", mezmurRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/feedback", feedbackRoutes);

export default app;
