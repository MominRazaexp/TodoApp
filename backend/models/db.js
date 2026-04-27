import sqlite3 from 'sqlite3';

export async function initDB() {
  const db = new sqlite3.Database('./dev.db');

  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT,
      page TEXT,
      event_type TEXT,
      duration INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

export function getDB() {
  return new sqlite3.Database('./dev.db');
}