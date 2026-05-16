import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// prevents Neon idle disconnections from crashing server
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// prevents client-level errors from crashing server
pool.on('connect', (client) => {
  client.on('error', (err) => {
    console.error('Client error:', err);
  });
});

export default pool;