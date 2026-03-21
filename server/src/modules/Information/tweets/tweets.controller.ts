import type { Request, Response } from "express"
import { addtweet, view1tweet, viewalltweets } from "./tweets.services.js";

export const createtweet = async (req: Request, res: Response) => {
  const { tweet_link, title, description, visibility } = req.body;
  if (!tweet_link || !title) {
    res.json({ message: "Missing title or link" });
    return; 
  }
  const create = await addtweet(tweet_link, title, description, visibility);
  res.json(create); 
}

export const alltweets = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  if (!user_id) {
    res.json({ message: "Pls Login first" });
    return; 
  }
  const result = await viewalltweets(Number(user_id));
  res.json(result); 
}

export const singletweet = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { title } = req.body;
  if (!user_id) {
    res.json({ message: "Pls Login" });
    return; 
  }
  const result = await view1tweet(Number(user_id), title); 
  res.json(result); 
}