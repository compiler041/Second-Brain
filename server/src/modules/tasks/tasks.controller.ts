import type { Response } from "express";
import type { AuthRequest } from "../../types.js";
import * as taskService from "./tasks.services.js";

export const todo_create = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const user_id = req.user_id!;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const todo = await taskService.createTodo(title, description, user_id);

    res.status(201).json(todo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getalltasks = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;

    const todos = await taskService.getAllTodos(user_id);

    res.json(todos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOneTask = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;
    const task_id = Number(req.params.task_id);

    const todo = await taskService.getOneTodo(task_id, user_id);

    if (!todo) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(todo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;
    const task_id = Number(req.params.task_id);
    const { title, description, status, due_date } = req.body;

    const todo = await taskService.updateTodo(task_id, user_id, {
      title,
      description,
      status,
      due_date,
    });

    if (!todo) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(todo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user_id!;
    const task_id = Number(req.params.task_id);

    const deleted = await taskService.deleteTodo(task_id, user_id);

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};