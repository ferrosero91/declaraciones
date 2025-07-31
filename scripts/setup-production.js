const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Configuración de la base de datos para producción
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function setupProduction() {
  try {
    console.log('🚀 Configurando base de datos en producción...')
    
    // Verificar si las tablas ya existen
    const tablesExist = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `)
    
    if (!tablesExist.rows[0].exists) {
      // Leer y ejecutar el script de creación de tablas
      const sqlPath = path.join(__dirname, 'create-tables.sql')
      const sql = fs.readFileSync(sqlPath, 'utf8')
      
      await pool.query(sql)
      console.log('✅ Tablas creadas correctamente')
    } else {
      console.log('ℹ️ Las tablas ya existen, saltando creación')
    }
    
    // Verificar si ya hay datos
    const result = await pool.query('SELECT COUNT(*) as count FROM users')
    const userCount = parseInt(result.rows[0].count)
    
    if (userCount === 0) {
      console.log('📝 Insertando datos iniciales...')
      
      // Datos reales del usuario
      const realUsers = [
        { cedula: '87063020', nombres: 'LUIS HERNANDO PORTILLO RIASCOS', celular: '3167945111' },
        { cedula: '98339322', nombres: 'VICTOR FELIPE MUÑOZ', celular: '3148239934' },
        { cedula: '87245430', nombres: 'CARLOS AMILCAR GOMEZ', celular: '3116841978' },
        { cedula: '5230831', nombres: 'EYDER MIÑOZ MUÑOZ', celular: '3137022985' },
        { cedula: '5211936', nombres: 'GERMAN MELO', celular: '3137377868' },
        { cedula: '98339344', nombres: 'WILLIAM URBANO', celular: '3104137834' },
        { cedula: '27150249', nombres: 'LIDIA ROSEOR BRAVO', celular: '3178640165' },
        { cedula: '1085291051', nombres: 'CAROLINA ANDREA LOPEZ MARROQUIN', celular: '3117059186' },
        { cedula: '1080900757', nombres: 'DORA LILIANA ROSERO BRAVO', celular: '3136316069' },
        { cedula: '1080903575', nombres: 'ANDREA PATRICIA ROSERO RIASCOS', celular: '3146900454' },
        { cedula: '13070275', nombres: 'JAIRO ROSALES', celular: '3166283559' },
        { cedula: '5230788', nombres: 'FREDY URBANO', celular: '3116197622' },
        { cedula: '1085286295', nombres: 'ELIER FERNANDO ROSERO BRAVO', celular: '3117098269' },
      ]

      // Función para calcular fecha de vencimiento
      function calculateDueDate(cedula) {
        const TAX_CALENDAR = {
          "01": "12-8-2025", "02": "12-8-2025", "03": "13-8-2025", "04": "13-8-2025",
          "05": "14-8-2025", "06": "14-8-2025", "07": "15-8-2025", "08": "15-8-2025",
          "09": "19-8-2025", "10": "19-8-2025", "11": "20-8-2025", "12": "20-8-2025",
          "13": "21-8-2025", "14": "21-8-2025", "15": "22-8-2025", "16": "22-8-2025",
          "17": "25-8-2025", "18": "25-8-2025", "19": "26-8-2025", "20": "26-8-2025",
          "21": "27-8-2025", "22": "27-8-2025", "23": "28-8-2025", "24": "28-8-2025",
          "25": "29-8-2025", "26": "29-8-2025", "27": "1-9-2025", "28": "1-9-2025",
          "29": "2-9-2025", "30": "2-9-2025", "31": "3-9-2025", "32": "3-9-2025",
          "33": "4-9-2025", "34": "4-9-2025", "35": "5-9-2025", "36": "5-9-2025",
          "37": "8-9-2025", "38": "8-9-2025", "39": "9-9-2025", "40": "9-9-2025",
          "41": "10-9-2025", "42": "10-9-2025", "43": "11-9-2025", "44": "11-9-2025",
          "45": "12-9-2025", "46": "12-9-2025", "47": "15-9-2025", "48": "15-9-2025",
          "49": "16-9-2025", "50": "16-9-2025", "51": "17-9-2025", "52": "17-9-2025",
          "53": "18-9-2025", "54": "18-9-2025", "55": "19-9-2025", "56": "19-9-2025",
          "57": "22-9-2025", "58": "22-9-2025", "59": "23-9-2025", "60": "23-9-2025",
          "61": "24-9-2025", "62": "24-9-2025", "63": "25-9-2025", "64": "25-9-2025",
          "65": "26-9-2025", "66": "26-9-2025", "67": "1-10-2025", "68": "1-10-2025",
          "69": "2-10-2025", "70": "2-10-2025", "71": "3-10-2025", "72": "3-10-2025",
          "73": "6-10-2025", "74": "6-10-2025", "75": "7-10-2025", "76": "7-10-2025",
          "77": "8-10-2025", "78": "8-10-2025", "79": "9-10-2025", "80": "9-10-2025",
          "81": "10-10-2025", "82": "10-10-2025", "83": "14-10-2025", "84": "14-10-2025",
          "85": "15-10-2025", "86": "15-10-2025", "87": "16-10-2025", "88": "16-10-2025",
          "89": "17-10-2025", "90": "17-10-2025", "91": "20-10-2025", "92": "20-10-2025",
          "93": "21-10-2025", "94": "21-10-2025", "95": "22-10-2025", "96": "22-10-2025",
          "97": "23-10-2025", "98": "23-10-2025", "99": "24-10-2025", "00": "24-10-2025",
        }
        
        const lastTwoDigits = cedula.slice(-2).padStart(2, "0")
        return TAX_CALENDAR[lastTwoDigits] || "24-10-2025"
      }

      // Insertar usuarios
      for (const user of realUsers) {
        const fechaVencimiento = calculateDueDate(user.cedula)
        
        await pool.query(`
          INSERT INTO users (cedula, nombres, celular, fecha_vencimiento, notificado)
          VALUES ($1, $2, $3, $4, $5)
        `, [user.cedula, user.nombres, user.celular, fechaVencimiento, false])
      }
      
      console.log(`✅ ${realUsers.length} usuarios insertados correctamente`)
    } else {
      console.log(`ℹ️ Base de datos ya contiene ${userCount} usuarios`)
    }
    
    console.log('🎉 Configuración de producción completada')
    
  } catch (error) {
    console.error('❌ Error en configuración de producción:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupProduction()
}

module.exports = { setupProduction }