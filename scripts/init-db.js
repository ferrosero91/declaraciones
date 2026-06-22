const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
})

const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    celular VARCHAR(15) NOT NULL,
    fecha_vencimiento VARCHAR(20) NOT NULL,
    notificado BOOLEAN DEFAULT FALSE,
    last_notification DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_cedula ON users(cedula);
CREATE INDEX IF NOT EXISTS idx_users_fecha_vencimiento ON users(fecha_vencimiento);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
`

async function initDatabase() {
  try {
    console.log('Conectando a PostgreSQL...')
    await pool.query(SCHEMA_SQL)
    console.log('Esquema creado correctamente')
    console.log('Tabla: users')
  } catch (error) {
    console.error('Error inicializando la base de datos:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

if (require.main === module) {
  initDatabase()
}

module.exports = { initDatabase }