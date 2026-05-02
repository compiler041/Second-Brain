import express from "express";
import type { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

// DB
import pool from "../config/db.js";

// Middleware
import authMiddleware from "../middleware/auth.middleware.js";

// Routes
import userRoutes from "../modules/users/user.routes.js";
import taskRoutes from "../modules/tasks/tasks.routes.js";
import noteRoutes from "../modules/Information/Notes/Notes.routes.js";
import tweetRoutes from "../modules/Information/tweets/tweets.routes.js";
import ytRoutes from "../modules/Information/yt_video/yt.routes.js";

// Init
dotenv.config();
const app: Application = express();

// Global Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB Connection
pool.connect()
  .then(() => console.log("PostgreSQL connected ✅"))
  .catch((err) => console.error("DB connection error ❌", err));

// Public Routes (no auth required)
app.use("/api/users", userRoutes);

// Protected Routes (auth required)
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/notes", authMiddleware, noteRoutes);
app.use("/api/tweets", authMiddleware, tweetRoutes);
app.use("/api/yt", authMiddleware, ytRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});