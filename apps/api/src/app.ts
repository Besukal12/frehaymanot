import express from "express";
import { clerkMiddleware } from "@clerk/express";
import mezmurRoutes from "./routes/mezmur/route.js";
import courseRoutes from "./routes/course/route.js"
import announcementRoutes from "./routes/announcement/route.js"

const app = express();

app.use(express.json());
// app.use(clerkMiddleware());
app.use("/api/mezmur", mezmurRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/announcement", announcementRoutes)

export default app;
