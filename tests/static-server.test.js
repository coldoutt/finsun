import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { isInsideRoot, resolvePath } from "../server/scripts/static-server.js";

test("static server resolves the root document", () => {
  const filePath = resolvePath("/");
  assert.equal(path.basename(filePath), "index.html");
  assert.equal(isInsideRoot(filePath), true);
});

test("static server rejects decoded traversal paths", () => {
  const filePath = resolvePath("/%2e%2e/package.json");
  assert.equal(isInsideRoot(filePath), false);
});

test("static server rejects sibling paths with the same prefix", () => {
  const filePath = resolvePath("/../Финансы и Бюджет-backup/private.json");
  assert.equal(isInsideRoot(filePath), false);
});
