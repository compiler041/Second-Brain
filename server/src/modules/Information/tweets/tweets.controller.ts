import type { Response } from "express";
import type { AuthRequest } from "../../../types.js";
import { addtweet, viewalltweets, view1tweet, deletetweet } from "./tweets.services.js";

export const createtweet = async (req: AuthRequest, res: Response) => {
  try {
    const { tweet_link, title, description, visibility } = req.body;
    const user_id = req.user_id!;

    if (!tweet_link || !title) {
      return res.status(400).json({ error: "Missing title or link" });
    }

    const tweet = await addtweet(tweet_link, title, description || "", visibility ?? true, user_id);
    res.status(201).json(tweet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const alltweets = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;

    const result = await viewalltweets(user_id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const singletweet = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;
    const { title } = req.body;

    const result = await view1tweet(user_id, title);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeTweet = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;
    const tweet_id = Number(req.params.tweet_id);

    const deleted = await deletetweet(tweet_id, user_id);

    if (!deleted) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    res.json({ message: "Tweet deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};