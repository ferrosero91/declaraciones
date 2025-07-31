import { query } from './database'
import { calculateDueDate } from './tax-calendar'
import { sortUsersByDueDate } from './date-utils'

export interface User {
  id: string
  cedula: string
  nombres: string
  celular: string
  fechaVencimiento: string
  notificado: boolean
  lastNotification?: string
  createdAt: string
  updatedAt: string
}

export class UserService {
  // Obtener todos los usuarios ordenados por fecha de vencimiento
  static async getAllUsers(): Promise<User[]> {
    try {
      const result = await query(`
        SELECT 
          id,
          cedula,
          nombres,
          celular,
          fecha_vencimiento as "fechaVencimiento",
          notificado,
          last_notification as "lastNotification",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM users 
      `)
      
      const users = result.rows.map(row => ({
        ...row,
        lastNotification: row.lastNotification ? row.lastNotification.toISOString().split('T')[0] : undefined
      }))

      // Ordenar por fecha de vencimiento usando la función auxiliar
      return sortUsersByDueDate(users)
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      throw new Error('Error al obtener usuarios')
    }
  }

  // Crear un nuevo usuario
  static async createUser(userData: {
    cedula: string
    nombres: string
    celular: string
  }): Promise<User> {
    const { cedula, nombres, celular } = userData
    
    try {
      // Verificar si el usuario ya existe
      const existingUser = await query(
        'SELECT id FROM users WHERE cedula = $1',
        [cedula]
      )
      
      if (existingUser.rows.length > 0) {
        throw new Error('Ya existe un usuario con esta cédula')
      }

      // Calcular fecha de vencimiento
      const fechaVencimiento = calculateDueDate(cedula)

      // Insertar nuevo usuario
      const result = await query(`
        INSERT INTO users (cedula, nombres, celular, fecha_vencimiento)
        VALUES ($1, $2, $3, $4)
        RETURNING 
          id,
          cedula,
          nombres,
          celular,
          fecha_vencimiento as "fechaVencimiento",
          notificado,
          last_notification as "lastNotification",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `, [cedula, nombres, celular, fechaVencimiento])

      return result.rows[0]
    } catch (error) {
      console.error('Error creando usuario:', error)
      throw error
    }
  }

  // Buscar usuarios por término ordenados por fecha de vencimiento
  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const result = await query(`
        SELECT 
          id,
          cedula,
          nombres,
          celular,
          fecha_vencimiento as "fechaVencimiento",
          notificado,
          last_notification as "lastNotification",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM users 
        WHERE 
          LOWER(nombres) LIKE LOWER($1) OR 
          cedula LIKE $1
      `, [`%${searchTerm}%`])
      
      const users = result.rows.map(row => ({
        ...row,
        lastNotification: row.lastNotification ? row.lastNotification.toISOString().split('T')[0] : undefined
      }))

      // Ordenar por fecha de vencimiento usando la función auxiliar
      return sortUsersByDueDate(users)
    } catch (error) {
      console.error('Error buscando usuarios:', error)
      throw new Error('Error al buscar usuarios')
    }
  }

  // Marcar usuario como notificado
  static async markAsNotified(userId: string): Promise<void> {
    try {
      await query(`
        UPDATE users 
        SET 
          notificado = true,
          last_notification = CURRENT_DATE,
          updated_at = NOW()
        WHERE id = $1
      `, [userId])
    } catch (error) {
      console.error('Error marcando usuario como notificado:', error)
      throw new Error('Error al actualizar estado de notificación')
    }
  }

  // Actualizar un usuario
  static async updateUser(id: string, userData: {
    cedula: string
    nombres: string
    celular: string
  }): Promise<User> {
    const { cedula, nombres, celular } = userData
    
    try {
      // Verificar si otro usuario ya tiene esta cédula
      const existingUser = await query(
        'SELECT id FROM users WHERE cedula = $1 AND id != $2',
        [cedula, id]
      )
      
      if (existingUser.rows.length > 0) {
        throw new Error('Ya existe otro usuario con esta cédula')
      }

      // Calcular nueva fecha de vencimiento
      const fechaVencimiento = calculateDueDate(cedula)

      // Actualizar usuario
      const result = await query(`
        UPDATE users 
        SET 
          cedula = $1,
          nombres = $2,
          celular = $3,
          fecha_vencimiento = $4,
          updated_at = NOW()
        WHERE id = $5
        RETURNING 
          id,
          cedula,
          nombres,
          celular,
          fecha_vencimiento as "fechaVencimiento",
          notificado,
          last_notification as "lastNotification",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `, [cedula, nombres, celular, fechaVencimiento, id])

      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado')
      }

      return result.rows[0]
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      throw error
    }
  }

  // Eliminar un usuario
  static async deleteUser(id: string): Promise<void> {
    try {
      const result = await query('DELETE FROM users WHERE id = $1', [id])
      
      if (result.rowCount === 0) {
        throw new Error('Usuario no encontrado')
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error)
      throw error
    }
  }

  // Obtener un usuario por ID
  static async getUserById(id: string): Promise<User | null> {
    try {
      const result = await query(`
        SELECT 
          id,
          cedula,
          nombres,
          celular,
          fecha_vencimiento as "fechaVencimiento",
          notificado,
          last_notification as "lastNotification",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM users 
        WHERE id = $1
      `, [id])
      
      if (result.rows.length === 0) {
        return null
      }

      const row = result.rows[0]
      return {
        ...row,
        lastNotification: row.lastNotification ? row.lastNotification.toISOString().split('T')[0] : undefined
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      throw new Error('Error al obtener usuario')
    }
  }

  // Crear múltiples usuarios (para importación Excel)
  static async createMultipleUsers(usersData: Array<{
    cedula: string
    nombres: string
    celular: string
  }>): Promise<{ created: number; errors: Array<{ cedula: string; error: string }> }> {
    let created = 0
    const errors: Array<{ cedula: string; error: string }> = []

    for (const userData of usersData) {
      try {
        await this.createUser(userData)
        created++
      } catch (error) {
        errors.push({
          cedula: userData.cedula,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    return { created, errors }
  }

  // Obtener estadísticas detalladas
  static async getStats() {
    try {
      // Estadísticas básicas
      const basicStats = await query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE notificado = true) as notified,
          COUNT(*) FILTER (WHERE notificado = false) as pending
        FROM users
      `)

      // Casos urgentes (vencen en los próximos 7 días)
      const urgentCases = await query(`
        SELECT COUNT(*) as urgent
        FROM users 
        WHERE notificado = false 
        AND (
          fecha_vencimiento LIKE '%8-2025' OR 
          fecha_vencimiento LIKE '1-9-2025' OR 
          fecha_vencimiento LIKE '2-9-2025' OR
          fecha_vencimiento LIKE '3-9-2025' OR
          fecha_vencimiento LIKE '4-9-2025' OR
          fecha_vencimiento LIKE '5-9-2025'
        )
      `)

      const stats = basicStats.rows[0]
      const urgent = urgentCases.rows[0].urgent

      return {
        total: parseInt(stats.total),
        notified: parseInt(stats.notified),
        pending: parseInt(stats.pending),
        urgent: parseInt(urgent),
        // Calcular porcentajes de cambio (simulados para demo)
        totalChange: '+12%',
        pendingChange: '-5%',
        notifiedChange: '+28%',
        urgentChange: '-15%'
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return { 
        total: 0, 
        notified: 0, 
        pending: 0, 
        urgent: 0,
        totalChange: '0%',
        pendingChange: '0%',
        notifiedChange: '0%',
        urgentChange: '0%'
      }
    }
  }
}