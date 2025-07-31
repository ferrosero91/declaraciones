import { Pool } from 'pg'

// Configuración de la base de datos
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Fallback para desarrollo local
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'declaraciones_tributarias',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
})

// Función para ejecutar consultas
export async function query(text: string, params?: any[]) {
    const client = await pool.connect()
    try {
        const result = await client.query(text, params)
        return result
    } finally {
        client.release()
    }
}

// Función para obtener un cliente de la pool
export async function getClient() {
    return await pool.connect()
}

export default pool