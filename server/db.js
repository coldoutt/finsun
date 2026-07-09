import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;

if (!config.databaseUrl) {
  console.warn("DATABASE_URL is not configured. Database queries will fail until it is set.");
}

export const pool = new Pool({
  connectionString: config.databaseUrl || undefined,
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
