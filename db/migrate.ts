import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs, { type Database } from 'sql.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'free-font.db');
const schemaPath = join(__dirname, 'schema.sql');
const seedPath = join(__dirname, 'seed-licenses.sql');
const seedFontsPath = join(__dirname, 'seed-fonts.sql');

async function migrate() {
  const SQL = await initSqlJs();
  let db: Database;

  if (existsSync(dbPath)) {
    console.log('Loading existing database...');
    const buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);

    // Add status column before running schema (schema references it in index)
    const cols = db.exec("PRAGMA table_info(fonts)");
    const hasStatus = cols.length > 0 && cols[0]!.values.some((row) => row[1] === 'status');
    if (!hasStatus) {
      console.log('Adding status column to fonts...');
      db.run("ALTER TABLE fonts ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'");
      db.run("UPDATE fonts SET status = 'published'");
    }
  } else {
    console.log('Creating new database...');
    db = new SQL.Database();
  }

  console.log('Running schema...');
  const schema = readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  console.log('Seeding licenses...');
  const seed = readFileSync(seedPath, 'utf-8');
  db.exec(seed);

  if (existsSync(seedFontsPath)) {
    console.log('Seeding fonts...');
    const seedFonts = readFileSync(seedFontsPath, 'utf-8');
    db.exec(seedFonts);
  }

  const buffer = db.export();
  writeFileSync(dbPath, Buffer.from(buffer));
  db.close();

  console.log(`Database saved to ${dbPath}`);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
