import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { config } from "../config.js";

const initialData = {
  nextIds: {
    users: 1,
    sessions: 1,
  },
  users: [],
  sessions: [],
  financeStates: {},
};

let writeQueue = Promise.resolve();

async function ensureStoreFile() {
  await mkdir(path.dirname(config.dataFile), { recursive: true });
  try {
    await readFile(config.dataFile, "utf8");
  } catch {
    await writeFile(config.dataFile, JSON.stringify(initialData, null, 2));
  }
}

export async function readStore() {
  await ensureStoreFile();
  const raw = await readFile(config.dataFile, "utf8");
  const parsed = JSON.parse(raw || "{}");
  return {
    nextIds: {
      users: Number(parsed?.nextIds?.users || 1),
      sessions: Number(parsed?.nextIds?.sessions || 1),
    },
    users: Array.isArray(parsed?.users) ? parsed.users : [],
    sessions: Array.isArray(parsed?.sessions) ? parsed.sessions : [],
    financeStates: parsed?.financeStates && typeof parsed.financeStates === "object" ? parsed.financeStates : {},
  };
}

export async function writeStore(data) {
  await ensureStoreFile();
  await writeFile(config.dataFile, `${JSON.stringify(data, null, 2)}\n`);
}

export async function updateStore(updater) {
  writeQueue = writeQueue.then(async () => {
    const current = await readStore();
    const next = await updater(current);
    await writeStore(next);
    return next;
  });

  return writeQueue;
}
