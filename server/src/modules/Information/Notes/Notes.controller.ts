import type { Request, Response } from "express";
import { createnote as createNoteService, view1note, viewallnotes } from "./Notes.services.js";

export const createnote = async (req: Request, res: Response) => {
  const { title, context, visibility } = req.body;

  if (!title || !context) {
    return res.json({
      message: "Missing Title or context"
    });
  }

  const note = await createNoteService(
    title,
    context,
    visibility ?? true,
    new Date()
  );

  return res.json({
    message: "Note created successfully",
    note
  });
};

export const viewnotes = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.json({
      message: "Please login!"
    });
  }

  const result = await viewallnotes(Number(user_id));

  return res.json(result.rows);
};

export const searchnote = async (req: Request, res: Response) => {
  const { title } = req.body;
  const { user_id, task_id } = req.params;

  const result = await view1note(
    title,
    Number(task_id),
    Number(user_id)
  );

  return res.json(result.rows);
};
