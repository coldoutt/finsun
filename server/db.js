import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;

if (config.dataBackend !== "file" && !config.databaseUrl) {
  console.warn("DATABASE_URL is not configured. Database queries will fail until it is set.");
}

export const pool = new Pool({
  connectionString: config.dataBackend === "file" ? undefined : (config.databaseUrl || undefined),
});

export async function query(text, params = []) {
  if (config.dataBackend === "file") {
    throw new Error("SQL query attempted while DATA_BACKEND=file");
  }
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  if (config.dataBackend === "file") {
    return callback({ query });
  }
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
