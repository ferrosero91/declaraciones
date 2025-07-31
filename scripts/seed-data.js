require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

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

// Datos reales del usuario
const realUsers = [
    { cedula: '87063020', nombres: 'LUIS HERNANDO PORTILLO RIASCOS', celular: '3167945111', notificado: false },
    { cedula: '98339322', nombres: 'VICTOR FELIPE MUÑOZ', celular: '3148239934', notificado: false },
    { cedula: '87245430', nombres: 'CARLOS AMILCAR GOMEZ', celular: '3116841978', notificado: false },
    { cedula: '5230831', nombres: 'EYDER MIÑOZ MUÑOZ', celular: '3137022985', notificado: false },
    { cedula: '5211936', nombres: 'GERMAN MELO', celular: '3137377868', notificado: false },
    { cedula: '98339344', nombres: 'WILLIAM URBANO', celular: '3104137834', notificado: false },
    { cedula: '27150249', nombres: 'LIDIA ROSEOR BRAVO', celular: '3178640165', notificado: false },
    { cedula: '1085291051', nombres: 'CAROLINA ANDREA LOPEZ MARROQUIN', celular: '3117059186', notificado: false },
    { cedula: '1080900757', nombres: 'DORA LILIANA ROSERO BRAVO', celular: '3136316069', notificado: false },
    { cedula: '1080903575', nombres: 'ANDREA PATRICIA ROSERO RIASCOS', celular: '3146900454', notificado: false },
    { cedula: '13070275', nombres: 'JAIRO ROSALES', celular: '3166283559', notificado: false },
    { cedula: '5230788', nombres: 'FREDY URBANO', celular: '3116197622', notificado: false },
    { cedula: '1085286295', nombres: 'ELIER FERNANDO ROSERO BRAVO', celular: '3117098269', notificado: false },
]

// Función para calcular fecha de vencimiento según calendario oficial Colombia 2025
function calculateDueDate(cedula) {
    const TAX_CALENDAR = {
        // AGOSTO 2025
        "01": "12-8-2025", "02": "12-8-2025",
        "03": "13-8-2025", "04": "13-8-2025",
        "05": "14-8-2025", "06": "14-8-2025",
        "07": "15-8-2025", "08": "15-8-2025",
        "09": "19-8-2025", "10": "19-8-2025",
        "11": "20-8-2025", "12": "20-8-2025",
        "13": "21-8-2025", "14": "21-8-2025",
        "15": "22-8-2025", "16": "22-8-2025",
        "17": "25-8-2025", "18": "25-8-2025",
        "19": "26-8-2025", "20": "26-8-2025",
        "21": "27-8-2025", "22": "27-8-2025",
        "23": "28-8-2025", "24": "28-8-2025",
        "25": "29-8-2025", "26": "29-8-2025",

        // SEPTIEMBRE 2025
        "27": "1-9-2025", "28": "1-9-2025",
        "29": "2-9-2025", "30": "2-9-2025",
        "31": "3-9-2025", "32": "3-9-2025",
        "33": "4-9-2025", "34": "4-9-2025",
        "35": "5-9-2025", "36": "5-9-2025",
        "37": "8-9-2025", "38": "8-9-2025",
        "39": "9-9-2025", "40": "9-9-2025",
        "41": "10-9-2025", "42": "10-9-2025",
        "43": "11-9-2025", "44": "11-9-2025",
        "45": "12-9-2025", "46": "12-9-2025",
        "47": "15-9-2025", "48": "15-9-2025",
        "49": "16-9-2025", "50": "16-9-2025",
        "51": "17-9-2025", "52": "17-9-2025",
        "53": "18-9-2025", "54": "18-9-2025",
        "55": "19-9-2025", "56": "19-9-2025",
        "57": "22-9-2025", "58": "22-9-2025",
        "59": "23-9-2025", "60": "23-9-2025",
        "61": "24-9-2025", "62": "24-9-2025",
        "63": "25-9-2025", "64": "25-9-2025",
        "65": "26-9-2025", "66": "26-9-2025",

        // OCTUBRE 2025
        "67": "1-10-2025", "68": "1-10-2025",
        "69": "2-10-2025", "70": "2-10-2025",
        "71": "3-10-2025", "72": "3-10-2025",
        "73": "6-10-2025", "74": "6-10-2025",
        "75": "7-10-2025", "76": "7-10-2025",
        "77": "8-10-2025", "78": "8-10-2025",
        "79": "9-10-2025", "80": "9-10-2025",
        "81": "10-10-2025", "82": "10-10-2025",
        "83": "14-10-2025", "84": "14-10-2025",
        "85": "15-10-2025", "86": "15-10-2025",
        "87": "16-10-2025", "88": "16-10-2025",
        "89": "17-10-2025", "90": "17-10-2025",
        "91": "20-10-2025", "92": "20-10-2025",
        "93": "21-10-2025", "94": "21-10-2025",
        "95": "22-10-2025", "96": "22-10-2025",
        "97": "23-10-2025", "98": "23-10-2025",
        "99": "24-10-2025", "00": "24-10-2025",
    }

    const lastTwoDigits = cedula.slice(-2).padStart(2, "0")
    return TAX_CALENDAR[lastTwoDigits] || "24-10-2025"
}

// Función para generar usuarios adicionales
function generateUsers(count, notified = false) {
    const nombres = [
        'ALEJANDRO', 'BEATRIZ', 'CARLOS', 'DIANA', 'EDUARDO', 'FERNANDA', 'GABRIEL', 'HELENA',
        'IGNACIO', 'JULIANA', 'KEVIN', 'LORENA', 'MAURICIO', 'NATALIA', 'OSCAR', 'PATRICIA',
        'QUINTIN', 'RAQUEL', 'SEBASTIAN', 'TATIANA', 'ULISES', 'VALENTINA', 'WILLIAM', 'XIMENA',
        'YOLANDA', 'ZACARIAS'
    ]

    const apellidos = [
        'GARCIA', 'RODRIGUEZ', 'MARTINEZ', 'HERNANDEZ', 'LOPEZ', 'GONZALEZ', 'PEREZ', 'SANCHEZ',
        'RAMIREZ', 'CRUZ', 'FLORES', 'GOMEZ', 'MORALES', 'VAZQUEZ', 'JIMENEZ', 'RUIZ',
        'TORRES', 'RIVERA', 'SILVA', 'CASTRO', 'VARGAS', 'RAMOS', 'ORTIZ', 'MENDOZA'
    ]

    const users = []

    for (let i = 0; i < count; i++) {
        const cedula = (Math.floor(Math.random() * 90000000) + 10000000).toString()
        const nombre = nombres[Math.floor(Math.random() * nombres.length)]
        const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)]
        const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)]
        const celular = '3' + Math.floor(Math.random() * 900000000 + 100000000).toString()

        users.push({
            cedula,
            nombres: `${nombre} ${apellido1} ${apellido2}`,
            celular,
            notificado
        })
    }

    return users
}

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando migración de datos...')

        // Limpiar datos existentes
        await pool.query('DELETE FROM notifications')
        await pool.query('DELETE FROM users')
        console.log('🧹 Datos anteriores eliminados')

        // Insertar usuarios reales
        console.log('📝 Insertando usuarios reales...')
        for (const user of realUsers) {
            const fechaVencimiento = calculateDueDate(user.cedula)
            const lastNotification = user.notificado ? '2025-01-15' : null

            await pool.query(`
        INSERT INTO users (cedula, nombres, celular, fecha_vencimiento, notificado, last_notification)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [user.cedula, user.nombres, user.celular, fechaVencimiento, user.notificado, lastNotification])
        }

        // Verificar estadísticas
        const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE notificado = true) as notified,
        COUNT(*) FILTER (WHERE notificado = false) as pending
      FROM users
    `)

        console.log('✅ Migración completada exitosamente!')
        console.log('📊 Estadísticas finales:')
        console.log(`   - Total usuarios: ${stats.rows[0].total}`)
        console.log(`   - Notificaciones enviadas: ${stats.rows[0].notified}`)
        console.log(`   - Declaraciones pendientes: ${stats.rows[0].pending}`)

    } catch (error) {
        console.error('❌ Error en la migración:', error.message)
        process.exit(1)
    } finally {
        await pool.end()
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    seedDatabase()
}

module.exports = { seedDatabase }