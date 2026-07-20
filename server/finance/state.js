import { query, withTransaction } from "../db.js";
import { config } from "../config.js";
import { readStore, updateStore } from "../storage/file-store.js";

function normalizeRow(row) {
  const category = String(row?.category || "").trim() || "Без категории";
  const name = String(row?.name || "").trim() || "Без названия";
  const amount = Number.isFinite(Number(row?.amount)) ? Math.round(Number(row.amount)) : 0;
  return { category, name, amount };
}

function normalizeRecord(record) {
  const year = Number(record?.year);
  const month = Number(record?.month);
  const rows = Array.isArray(record?.rows) ? record.rows.map(normalizeRow) : [];
  const rowsTotal = rows.reduce((sum, row) => sum + row.amount, 0);
  const total = rows.length || !Number.isFinite(Number(record?.total))
    ? rowsTotal
    : Math.round(Number(record.total));

  return {
    key: `${year}-${String(month + 1).padStart(2, "0")}`,
    year,
    month,
    rows,
    total,
    savedAt: record?.savedAt || null,
  };
}

export function validateFinanceState(input) {
  const records = Array.isArray(input?.records) ? input.records.map(normalizeRecord) : [];
  const currentRows = Array.isArray(input?.currentRows) ? input.currentRows.map(normalizeRow) : [];
  const keys = new Set();

  for (const record of records) {
    if (!Number.isInteger(record.year) || record.year < 2000 || record.year > 3000) {
      return { ok: false, message: "Некорректный год в истории." };
    }

    if (!Number.isInteger(record.month) || record.month < 0 || record.month > 11) {
      return { ok: false, message: "Некорректный месяц в истории." };
    }

    if (keys.has(record.key)) {
      return { ok: false, message: "История содержит дубли одного и того же месяца." };
    }

    keys.add(record.key);
  }

  return {
    ok: true,
    state: {
      records,
      currentRows,
    },
  };
}

export async function loadFinanceState(userId, db = { query }) {
  if (config.dataBackend === "file") {
    const store = await readStore();
    const state = store.financeStates[String(userId)] || { records: [], currentRows: [] };
    return {
      records: Array.isArray(state.records) ? state.records.map(normalizeRecord) : [],
      currentRows: Array.isArray(state.currentRows) ? state.currentRows.map(normalizeRow) : [],
    };
  }

  const [snapshotsResult, currentRowsResult] = await Promise.all([
    db.query(
      `select
         s.id as snapshot_id,
         s.year,
         s.month,
         s.total,
         s.updated_at,
         r.id as row_id,
         r.category,
         r.name,
         r.amount
       from finance_snapshots s
       left join finance_rows r on r.snapshot_id = s.id
       where s.user_id = $1
       order by s.year asc, s.month asc, r.id asc`,
      [userId]
    ),
    db.query(
      `select current_rows
       from user_finance_state
       where user_id = $1
       limit 1`,
      [userId]
    ),
  ]);

  const bySnapshot = new Map();

  snapshotsResult.rows.forEach((row) => {
    if (!bySnapshot.has(row.snapshot_id)) {
      bySnapshot.set(row.snapshot_id, {
        key: `${row.year}-${String(Number(row.month) + 1).padStart(2, "0")}`,
        year: Number(row.year),
        month: Number(row.month),
        rows: [],
        total: Number(row.total || 0),
        savedAt: row.updated_at,
      });
    }

    if (row.row_id) {
      const snapshot = bySnapshot.get(row.snapshot_id);
      const item = normalizeRow(row);
      snapshot.rows.push(item);
    }
  });

  const currentRowsRaw = currentRowsResult.rows[0]?.current_rows;
  const currentRows = Array.isArray(currentRowsRaw)
    ? currentRowsRaw.map(normalizeRow)
    : [];

  return {
    records: Array.from(bySnapshot.values()),
    currentRows,
  };
}

export async function hasFinanceState(userId, db = { query }) {
  if (config.dataBackend === "file") {
    const store = await readStore();
    return Object.prototype.hasOwnProperty.call(store.financeStates, String(userId));
  }

  const result = await db.query(
    `select exists (
       select 1 from user_finance_state where user_id = $1
       union all
       select 1 from finance_snapshots where user_id = $1
     ) as initialized`,
    [userId]
  );
  return Boolean(result.rows[0]?.initialized);
}

export async function saveFinanceState(userId, state) {
  if (config.dataBackend === "file") {
    const store = await updateStore((current) => {
      current.financeStates[String(userId)] = {
        records: state.records.map(normalizeRecord),
        currentRows: state.currentRows.map(normalizeRow),
        updatedAt: new Date().toISOString(),
      };
      return current;
    });

    const saved = store.financeStates[String(userId)];
    return {
      records: saved.records.map(normalizeRecord),
      currentRows: saved.currentRows.map(normalizeRow),
    };
  }

  return withTransaction(async (client) => {
    await client.query("delete from finance_snapshots where user_id = $1", [userId]);

    for (const record of state.records) {
      const snapshotResult = await client.query(
        `insert into finance_snapshots (user_id, year, month, total, updated_at)
         values ($1, $2, $3, $4, coalesce($5::timestamptz, now()))
         returning id, updated_at`,
        [userId, record.year, record.month, record.total, record.savedAt]
      );

      const snapshotId = snapshotResult.rows[0].id;
      for (const row of record.rows) {
        await client.query(
          `insert into finance_rows (snapshot_id, category, name, amount)
           values ($1, $2, $3, $4)`,
          [snapshotId, row.category, row.name, row.amount]
        );
      }
    }

    await client.query(
      `insert into user_finance_state (user_id, current_rows, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (user_id)
       do update set
         current_rows = excluded.current_rows,
         updated_at = now()`,
      [userId, JSON.stringify(state.currentRows)]
    );

    return loadFinanceState(userId, client);
  });
}
