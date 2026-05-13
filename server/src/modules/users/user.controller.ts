import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userService from "./user.services.js"

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser(
      username,
      email,
      hashedPassword
    );
 
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user,
    });

  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    res.status(500).json({ error: err.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { 
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Google credential is required" });
    }

    // Verify Google token
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!response.ok) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const googleUser = await response.json();

    if (!googleUser.email) {
      return res.status(400).json({ error: "Could not retrieve email from Google" });
    }

    // Find or create user
    const user = await userService.findOrCreateGoogleUser(
      googleUser.email,
      googleUser.name || googleUser.email.split("@")[0],
      googleUser.sub
    );

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err: any) {
    console.error("Google auth error:", err);
    res.status(500).json({ error: err.message });
  }
};