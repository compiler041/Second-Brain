import pool from "../../config/db.js";

export interface Todo {
  task_id: number;
  title: string;
  description: string;
  due_date: string | null;
  priority_id: number | null;
  status: boolean;
  user_id: number;
  created_at: Date;
}

export const createTodo = async (
  title: string,
  description: string,
  user_id: number
): Promise<Todo> => {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, description, user_id]
  );

  return result.rows[0];
};

export const getAllTodos = async (
  user_id: number
): Promise<Todo[]> => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
    [user_id]
  );

  return result.rows;
};

export const getOneTodo = async (
  task_id: number,
  user_id: number
): Promise<Todo | null> => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2",
    [task_id, user_id]
  );

  return result.rows[0] || null;
};