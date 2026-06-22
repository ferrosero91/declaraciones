const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'declaraciones.db')

const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

function initDatabase() {
  try {
    console.log('Inicializando SQLite en:', DB_PATH)

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

    console.log('Esquema creado correctamente')
    console.log('Tabla: users')
  } catch (error) {
    console.error('Error inicializando la base de datos:', error.message)
    process.exit(1)
  } finally {
    db.close()
  }
}

if (require.main === module) {
  initDatabase()
}

module.exports = { initDatabase }