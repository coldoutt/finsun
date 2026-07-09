import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "../migrations");

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query("begin");
    await client.query(`
      create table if not exists schema_migrations (
        id bigserial primary key,
        name text not null unique,
        applied_at timestamptz not null default now()
      )
    `);

    const files = (await readdir(migrationsDir))
      .filter((file) => file.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b));

    for (const file of files) {
      const alreadyApplied = await client.query(
        "select 1 from schema_migrations where name = $1 limit 1",
        [file]
      );
      if (alreadyApplied.rows.length) continue;

      const sql = await readFile(path.join(migrationsDir, file), "utf8");
      console.log(`Applying migration ${file}`);
      await client.query(sql);
      await client.query(
        "insert into schema_migrations (name) values ($1)",
        [file]
      );
    }

    await client.query("commit");
    console.log("Migrations completed successfully.");
  } catch (error) {
    await client.query("rollback");
    console.error("Migration failed.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
