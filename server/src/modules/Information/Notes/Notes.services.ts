import pool from "../../../config/db.js";

export interface note {
  note_id: number,
  title: string,
  context: string,
  visibility: boolean,
  user_id: number,
  created_at: Date,
  updated_at: Date
}

export const createnote = async (
  title: string,
  context: string,
  visibility: boolean,
  created_at: Date
) => {
  const result = await pool.query(
    'INSERT INTO notes(title, context, visibility, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, context, visibility, created_at]
  );

  return result.rows[0];
};

export const viewallnotes = async (user_id: number) => {
  return await pool.query(
    'SELECT * FROM notes WHERE user_id = $1',
    [user_id]
  );
};

export const view1note = async (
  title: string,
  task_id: number,
  user_id: number
) => {
  return await pool.query(
    'SELECT * FROM notes WHERE user_id = $1 AND title = $3',
    [user_id,  title]
  );
};