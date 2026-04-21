import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

let dbInstance;

function dataDirPath() {
  return path.join(process.cwd(), '.data');
}

function dbFilePath() {
  return path.join(dataDirPath(), 'templates.db');
}

function ensureDbDirectory() {
  fs.mkdirSync(dataDirPath(), { recursive: true });
}

function initializeSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      version TEXT NOT NULL,
      status TEXT NOT NULL,
      engine TEXT NOT NULL,
      meta_json TEXT NOT NULL,
      inputs_json TEXT NOT NULL,
      layout_json TEXT NOT NULL,
      assets_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_templates_updated_at ON templates(updated_at);
  `);
}

export function getEditorDb() {
  if (dbInstance) {
    return dbInstance;
  }

  ensureDbDirectory();
  dbInstance = new Database(dbFilePath());
  initializeSchema(dbInstance);

  return dbInstance;
}
