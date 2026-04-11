import type { Response } from "express";
import type { AuthRequest } from "../../../types.js";
import { createnote as createNoteService, viewallnotes, view1note, deletenote } from "./Notes.services.js";

export const createnote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, context, visibility } = req.body;
    const user_id = req.user_id!;

    if (!title || !context) {
      return res.status(400).json({ error: "Missing title or context" });
    }

    const note = await createNoteService(
      title,
      context,
      visibility ?? true,
      user_id
    );

    return res.status(201).json(note);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const viewnotes = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;

    const notes = await viewallnotes(user_id);

    return res.json(notes);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const searchnote = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const user_id = req.user_id!;

    const result = await view1note(title, user_id);

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const removeNote = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;
    const note_id = Number(req.params.note_id);

    const deleted = await deletenote(note_id, user_id);

    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.json({ message: "Note deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
