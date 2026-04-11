import type { Response } from "express";
import type { AuthRequest } from "../../../types.js";
import { add, viewyt, view1yt, deleteyt } from "./yt.services.js";

export const createyt = async (req: AuthRequest, res: Response) => {
  try {
    const { video_link, title, description } = req.body;
    const user_id = req.user_id!;

    if (!video_link) {
      return res.status(400).json({ error: "Please add the video link" });
    }

    const result = await add(video_link, title || "Untitled", description || "", user_id);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const viewall = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;

    const result = await viewyt(user_id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const search1 = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const user_id = req.user_id!;

    const result = await view1yt(title, user_id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeVideo = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;
    const video_id = Number(req.params.video_id);

    const deleted = await deleteyt(video_id, user_id);

    if (!deleted) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json({ message: "Video deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};