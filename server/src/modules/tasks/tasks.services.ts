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

export const updateTodo = async (
  task_id: number,
  user_id: number,
  updates: { title?: string; description?: string; status?: boolean; due_date?: string | null }
): Promise<Todo | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;

  if (updates.title !== undefined) {
    fields.push(`title = $${paramCount++}`);
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(updates.description);
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${paramCount++}`);
    values.push(updates.status);
  }
  if (updates.due_date !== undefined) {
    fields.push(`due_date = $${paramCount++}`);
    values.push(updates.due_date);
  }

  if (fields.length === 0) return null;

  values.push(task_id, user_id);

  const result = await pool.query(
    `UPDATE tasks SET ${fields.join(", ")} WHERE task_id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

export const deleteTodo = async (
  task_id: number,
  user_id: number
): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE task_id = $1 AND user_id = $2",
    [task_id, user_id]
  );

  return (result.rowCount ?? 0) > 0;
};