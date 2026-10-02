// 纯 JS 迁移脚本，用 node db/add-status-column.js 运行
// 用于线上环境没有 tsx 时给 fonts 表添加 status 列
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs from 'sql.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'free-font.db');

async function main() {
  const SQL = await initSqlJs();
  const buffer = readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  const cols = db.exec("PRAGMA table_info(fonts)");
  const hasStatus = cols.length > 0 && cols[0].values.some((row) => row[1] === 'status');

  if (hasStatus) {
    console.log('status 列已存在，无需迁移');
  } else {
    console.log('正在添加 status 列...');
    db.run("ALTER TABLE fonts ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'");
    db.run("UPDATE fonts SET status = 'published'");
    const buf = db.export();
    writeFileSync(dbPath, Buffer.from(buf));
    console.log('迁移完成！已有字体已设为 published');
  }

  db.close();
}

main().catch((err) => {
  console.error('迁移失败:', err);
  process.exit(1);
});
