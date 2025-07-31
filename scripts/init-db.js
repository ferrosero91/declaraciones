require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Fallback para desarrollo local
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'declaraciones_tributarias',
  password: process.env.DB_PASSWORD || 'password123',
  port: parseInt(process.env.DB_PORT || '5434'),
})

async function initDatabase() {
  try {
    console.log('🔄 Conectando a PostgreSQL...')
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'create-tables.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Ejecutar el script SQL
    await pool.query(sql)
    
    console.log('✅ Base de datos inicializada correctamente')
    console.log('📊 Tablas creadas:')
    console.log('   - users (usuarios)')
    console.log('   - notifications (notificaciones)')
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase()
}

module.exports = { initDatabase }