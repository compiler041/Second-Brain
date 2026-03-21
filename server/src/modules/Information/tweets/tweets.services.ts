import pool from "../../../config/db.js";

export interface tweet {
  tweet_id: number,
  tweet_link: string,
  title: string,
  description: string,
  visibility: boolean,
  user_id: number,
  saved_at: Date
}

export const addtweet = async (
  tweet_link: string,
  title: string,
  description: string,
  visibility: boolean
) => {
  const result = await pool.query(
    'INSERT INTO tweets(tweet_link, title, description, visibility) VALUES ($1, $2, $3, $4) RETURNING *',
    
    [tweet_link, title, description, visibility]
  );
  return result.rows[0]; 
}

export const viewalltweets = async (user_id: number) => {
  const result = await pool.query(
    'SELECT * FROM tweets WHERE user_id=$1',
    [user_id]
  );
  return result.rows; 
}

export const view1tweet = async (user_id: number, title: string) => {
  const result = await pool.query(
    'SELECT * FROM tweets WHERE title=$1 AND user_id=$2',
                             
    [title, user_id]
  );
  return result.rows[0]; 
}