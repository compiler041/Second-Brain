import pool from "../../../config/db.js";

export interface YT {
  video_id: number;
  video_link: string;
  title: string;
  description: string;
  visibility: boolean;
  user_id: number;
  saved_at: Date;
}

export const add = async (
  video_link: string,
  title: string,
  description: string,
  user_id: number
) => {
  const result = await pool.query(
    "INSERT INTO youtube_videos(video_link, title, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [video_link, title, description, user_id]
  );
  return result.rows[0];
};

export const viewyt = async (user_id: number) => {
  const result = await pool.query(
    "SELECT * FROM youtube_videos WHERE user_id=$1 ORDER BY saved_at DESC",
    [user_id]
  );
  return result.rows;
};

export const view1yt = async (title: string, user_id: number) => {
  const result = await pool.query(
    "SELECT * FROM youtube_videos WHERE user_id=$1 AND title ILIKE $2",
    [user_id, `%${title}%`]
  );
  return result.rows;
};

export const deleteyt = async (
  video_id: number,
  user_id: number
): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM youtube_videos WHERE video_id = $1 AND user_id = $2",
    [video_id, user_id]
  );
  return (result.rowCount ?? 0) > 0;
};