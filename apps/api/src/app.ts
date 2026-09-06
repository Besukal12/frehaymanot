import express from "express";
import { clerkMiddleware } from "@clerk/express";
import mezmurRoutes from "./routes/mezmur/route.js";

const app = express();

app.use(express.json());
// app.use(clerkMiddleware());
app.use("/api/mezmur", mezmurRoutes);

export default app;
