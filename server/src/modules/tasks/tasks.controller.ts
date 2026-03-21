import type { Request, Response } from "express";
import * as taskService from "./tasks.services.js"

export const todo_create = async (req: Request, res: Response) => {
  try {
    const { title, description, user_id } = req.body;

    if (!title || !description || !user_id) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const todo = await taskService.createTodo(
      title,
      description,
      user_id
    );

    res.status(201).json(todo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getalltasks = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const todos = await taskService.getAllTodos(Number(user_id));

    res.json(todos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
 
export const getOneTask = async (req: Request, res: Response) => {
  try {
    const { task_id, user_id } = req.params;

    const todo = await taskService.getOneTodo(
      Number(task_id),
      Number(user_id)
    );

    if (!todo) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(todo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};