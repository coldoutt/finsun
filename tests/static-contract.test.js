import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [appSource, htmlSource, schemaSource, migrationSource] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../supabase-schema.sql", import.meta.url), "utf8"),
  readFile(new URL("../supabase/migrations/202608130002_state_version_and_goal_images.sql", import.meta.url), "utf8"),
]);

test("financial state uses optimistic concurrency instead of upsert", () => {
  assert.doesNotMatch(appSource, /\.upsert\s*\(/);
  assert.match(appSource, /\.eq\("version", expectedVersion\)/);
  assert.match(appSource, /\.eq\("updated_at", authState\.financeUpdatedAt\)/);
  assert.match(schemaSource, /version bigint not null default 0/);
});

test("goal images use private Storage with per-user policies", () => {
  assert.match(appSource, /const GOAL_IMAGE_BUCKET = "goal-images"/);
  assert.match(migrationSource, /'goal-images'[\s\S]*false/);
  assert.match(migrationSource, /storage\.foldername\(name\)/);
  assert.match(migrationSource, /auth\.uid\(\)::text/);
});

test("browser dependencies are pinned and integrity-protected", () => {
  assert.doesNotMatch(htmlSource, /supabase-js@2["/]/);
  assert.match(htmlSource, /supabase-js@2\.111\.0/);
  assert.equal((htmlSource.match(/integrity="sha384-/g) || []).length, 2);
});

test("obsolete navigation indicator is absent", () => {
  assert.doesNotMatch(appSource, /updateSideNavIndicator/);
  assert.doesNotMatch(htmlSource, /side-nav-indicator/);
});
