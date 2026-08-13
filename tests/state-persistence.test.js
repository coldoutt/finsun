import assert from "node:assert/strict";
import test from "node:test";

import {
  FinanceStateConflictError,
  createSerializedExecutor,
  createStateConflictError,
} from "../state-persistence.js";

test("serialized executor keeps persistence operations ordered", async () => {
  const run = createSerializedExecutor();
  const events = [];
  const first = run(async () => {
    events.push("first:start");
    await new Promise((resolve) => setTimeout(resolve, 15));
    events.push("first:end");
  });
  const second = run(async () => {
    events.push("second:start");
    events.push("second:end");
  });

  await Promise.all([first, second]);
  assert.deepEqual(events, ["first:start", "first:end", "second:start", "second:end"]);
});

test("serialized executor continues after a failed operation", async () => {
  const run = createSerializedExecutor();
  await assert.rejects(run(async () => {
    throw new Error("failed");
  }));
  await assert.doesNotReject(run(async () => "saved"));
});

test("conflict error has a stable public type and message", () => {
  const error = createStateConflictError();
  assert.ok(error instanceof FinanceStateConflictError);
  assert.match(error.message, /другой вкладке|другом устройстве/i);
});
