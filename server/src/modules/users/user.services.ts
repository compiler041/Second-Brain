import pool from "../../config/db.js";

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING user_id, username, email, role, created_at`,
    [username, email, password]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
};

export const findOrCreateGoogleUser = async (
  email: string,
  username: string,
  googleSub: string
) => {
  // Check if user already exists by email
  const existing = await pool.query(
    'SELECT user_id, username, email, role, created_at FROM users WHERE email = $1',
    [email]
  );
  if (existing.rows[0]) return existing.rows[0];

  // Generate unique username to avoid conflicts with existing users
  const uniqueUsername = `${username}_${Date.now()}`;

  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING user_id, username, email, role, created_at`,
    [uniqueUsername, email, `google_${googleSub}`]
  );
  return result.rows[0];
};