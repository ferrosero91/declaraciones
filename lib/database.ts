import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'declaraciones.db')

const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export function exec(sql: string): void {
  db.exec(sql)
}

export function prepare(sql: string): Database.Statement {
  return db.prepare(sql)
}

export function all<T = unknown>(sql: string, ...params: unknown[]): T[] {
  return db.prepare(sql).all(...params) as T[]
}

export function get<T = unknown>(sql: string, ...params: unknown[]): T | undefined {
  return db.prepare(sql).get(...params) as T | undefined
}

export function run(sql: string, ...params: unknown[]): Database.RunResult {
  return db.prepare(sql).run(...params)
}

export function transaction<T>(fn: () => T): T {
  return db.transaction(fn)()
}

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      cedula TEXT UNIQUE NOT NULL,
      nombres TEXT NOT NULL,
      celular TEXT NOT NULL,
      fecha_vencimiento TEXT NOT NULL,
      notificado INTEGER NOT NULL DEFAULT 0,
      last_notification TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_users_cedula ON users(cedula);
    CREATE INDEX IF NOT EXISTS idx_users_fecha_vencimiento ON users(fecha_vencimiento);

    CREATE TRIGGER IF NOT EXISTS update_users_updated_at
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
      UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
    END;
  `)
}

initSchema()

export default db