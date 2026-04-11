import pool from "../../../config/db.js";

export interface Note {
  note_id: number;
  title: string;
  context: string;
  visibility: boolean;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export const createnote = async (
  title: string,
  context: string,
  visibility: boolean,
  user_id: number
) => {
  const result = await pool.query(
    "INSERT INTO notes(title, context, visibility, user_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
    [title, context, visibility, user_id]
  );

  return result.rows[0];
};

export const viewallnotes = async (user_id: number) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
    [user_id]
  );

  return result.rows;
};

export const view1note = async (
  title: string,
  user_id: number
) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE user_id = $1 AND title ILIKE $2",
    [user_id, `%${title}%`]
  );
  return result.rows;
};

export const deletenote = async (
  note_id: number,
  user_id: number
): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM notes WHERE note_id = $1 AND user_id = $2",
    [note_id, user_id]
  );

  return (result.rowCount ?? 0) > 0;
};