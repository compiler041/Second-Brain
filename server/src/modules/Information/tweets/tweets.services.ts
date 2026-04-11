import pool from "../../../config/db.js";

export interface Tweet {
  tweet_id: number;
  tweet_link: string;
  title: string;
  description: string;
  visibility: boolean;
  user_id: number;
  saved_at: Date;
}

export const addtweet = async (
  tweet_link: string,
  title: string,
  description: string,
  visibility: boolean,
  user_id: number
) => {
  const result = await pool.query(
    "INSERT INTO tweets(tweet_link, title, description, visibility, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [tweet_link, title, description, visibility, user_id]
  );
  return result.rows[0];
};

export const viewalltweets = async (user_id: number) => {
  const result = await pool.query(
    "SELECT * FROM tweets WHERE user_id=$1 ORDER BY saved_at DESC",
    [user_id]
  );
  return result.rows;
};

export const view1tweet = async (user_id: number, title: string) => {
  const result = await pool.query(
    "SELECT * FROM tweets WHERE title ILIKE $1 AND user_id=$2",
    [`%${title}%`, user_id]
  );
  return result.rows;
};

export const deletetweet = async (
  tweet_id: number,
  user_id: number
): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM tweets WHERE tweet_id = $1 AND user_id = $2",
    [tweet_id, user_id]
  );
  return (result.rowCount ?? 0) > 0;
};