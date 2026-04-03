import express from "express";
import type { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

// DB
import pool from "../config/db.js";

// Routes
import userRoutes from "../modules/users/user.routes.js";

// Init
dotenv.config();
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB Connection
pool.connect()
  .then(() => console.log("PostgreSQL connected ✅"))
  .catch((err) => console.error("DB connection error ❌", err));

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});