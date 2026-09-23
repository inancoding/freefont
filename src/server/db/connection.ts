import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs, { type Database } from 'sql.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', '..', '..', 'db', 'free-font.db');

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (!existsSync(DB_PATH)) {
    throw new Error(`Database not found at ${DB_PATH}. Run 'pnpm run db:migrate' first.`);
  }

  const buffer = readFileSync(DB_PATH);
  db = new SQL.Database(buffer);
  return db;
}

export async function saveDb(): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  const buffer = db.export();
  writeFileSync(DB_PATH, Buffer.from(buffer));
}

export async function runQuery(sql: string, params: unknown[] = []): Promise<void> {
  const database = await getDb();
  database.run(sql, params as never[]);
}

export async function allRows<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const database = await getDb();
  const result = database.exec(sql, params as never[]);
  if (result.length === 0) return [];
  const stmt = result[0];
  if (!stmt) return [];
  return (stmt.values as unknown[][]).map((row) => {
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < stmt.columns.length; i++) {
      obj[stmt.columns[i]!] = row[i];
    }
    return obj as T;
  });
}

export async function getRow<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await allRows<T>(sql, params);
  return rows[0] ?? null;
}

export async function closeDb(): Promise<void> {
  if (db) {
    db.close();
    db = null;
  }
}
