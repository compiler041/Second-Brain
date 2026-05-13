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
  // Check if user already exists
  const existing = await findUserByEmail(email);
  if (existing) {
    return existing;
  }

  // Create new user without password (Google auth)
  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING user_id, username, email, role, created_at`,
    [username, email, `google_${googleSub}`]
  );

  return result.rows[0];
};