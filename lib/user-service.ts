import { query } from './database'
import { calculateDueDate } from './tax-calendar'
import { sortUsersByDueDate, getUrgencyLevel } from './date-utils'

export interface User {
  id: string
  cedula: string
  nombres: string
  celular: string
  fechaVencimiento: string
  notificado: boolean
  lastNotification?: string | null
  createdAt: string
  updatedAt: string
}

const SELECT_COLUMNS = `
  id,
  cedula,
  nombres,
  celular,
  fecha_vencimiento as "fechaVencimiento",
  notificado,
  last_notification as "lastNotification",
  created_at as "createdAt",
  updated_at as "updatedAt"
`

function normalizeRow(row: any): User {
  return {
    ...row,
    notificado: Boolean(row.notificado),
    lastNotification: row.lastNotification
      ? new Date(row.lastNotification).toISOString().split('T')[0]
      : null,
  }
}

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const result = await query(`SELECT ${SELECT_COLUMNS} FROM users`)
      const users = result.rows.map(normalizeRow)
      return sortUsersByDueDate(users)
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      throw new Error('Error al obtener usuarios')
    }
  }

  static async createUser(userData: {
    cedula: string
    nombres: string
    celular: string
  }): Promise<User> {
    const { cedula, nombres, celular } = userData
    try {
      const existing = await query('SELECT id FROM users WHERE cedula = $1', [cedula])
      if (existing.rows.length > 0) {
        throw new Error('Ya existe un usuario con esta cédula')
      }

      const fechaVencimiento = calculateDueDate(cedula)
      const result = await query(
        `INSERT INTO users (cedula, nombres, celular, fecha_vencimiento)
         VALUES ($1, $2, $3, $4)
         RETURNING ${SELECT_COLUMNS}`,
        [cedula, nombres, celular, fechaVencimiento],
      )
      return normalizeRow(result.rows[0])
    } catch (error) {
      console.error('Error creando usuario:', error)
      throw error
    }
  }

  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const result = await query(
        `SELECT ${SELECT_COLUMNS} FROM users
         WHERE LOWER(nombres) LIKE LOWER($1) OR cedula LIKE $1`,
        [`%${searchTerm}%`],
      )
      return sortUsersByDueDate(result.rows.map(normalizeRow))
    } catch (error) {
      console.error('Error buscando usuarios:', error)
      throw new Error('Error al buscar usuarios')
    }
  }

  static async markAsNotified(userId: string): Promise<void> {
    try {
      const result = await query(
        `UPDATE users
         SET notificado = true, last_notification = CURRENT_DATE, updated_at = NOW()
         WHERE id = $1`,
        [userId],
      )
      if (result.rowCount === 0) {
        throw new Error('Usuario no encontrado')
      }
    } catch (error) {
      console.error('Error marcando como notificado:', error)
      throw new Error('Error al actualizar estado de notificación')
    }
  }

  static async updateUser(id: string, userData: {
    cedula: string
    nombres: string
    celular: string
  }): Promise<User> {
    const { cedula, nombres, celular } = userData
    try {
      const existing = await query(
        'SELECT id FROM users WHERE cedula = $1 AND id != $2',
        [cedula, id],
      )
      if (existing.rows.length > 0) {
        throw new Error('Ya existe otro usuario con esta cédula')
      }

      const fechaVencimiento = calculateDueDate(cedula)
      const result = await query(
        `UPDATE users
         SET cedula = $1, nombres = $2, celular = $3, fecha_vencimiento = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING ${SELECT_COLUMNS}`,
        [cedula, nombres, celular, fechaVencimiento, id],
      )
      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado')
      }
      return normalizeRow(result.rows[0])
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      throw error
    }
  }

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

  static async getUserById(id: string): Promise<User | null> {
    try {
      const result = await query(
        `SELECT ${SELECT_COLUMNS} FROM users WHERE id = $1`,
        [id],
      )
      if (result.rows.length === 0) return null
      return normalizeRow(result.rows[0])
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      throw new Error('Error al obtener usuario')
    }
  }

  static async createMultipleUsers(usersData: Array<{
    cedula: string
    nombres: string
    celular: string
  }>): Promise<{ created: number; errors: Array<{ cedula: string; error: string }> }> {
    let created = 0
    const errors: Array<{ cedula: string; error: string }> = []

    for (const userData of usersData) {
      try {
        const existing = await query('SELECT id FROM users WHERE cedula = $1', [userData.cedula])
        if (existing.rows.length > 0) {
          throw new Error('Ya existe un usuario con esta cédula')
        }
        const fechaVencimiento = calculateDueDate(userData.cedula)
        await query(
          `INSERT INTO users (cedula, nombres, celular, fecha_vencimiento)
           VALUES ($1, $2, $3, $4)`,
          [userData.cedula, userData.nombres, userData.celular, fechaVencimiento],
        )
        created++
      } catch (error) {
        errors.push({
          cedula: userData.cedula,
          error: error instanceof Error ? error.message : 'Error desconocido',
        })
      }
    }

    return { created, errors }
  }

  static async getStats() {
    try {
      const basicStats = await query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE notificado = true) as notified,
          COUNT(*) FILTER (WHERE notificado = false) as pending
        FROM users
      `)

      const allRows = await query('SELECT fecha_vencimiento, notificado FROM users')
      let urgent = 0
      for (const row of allRows.rows) {
        if (row.notificado) continue
        const level = getUrgencyLevel(row.fecha_vencimiento)
        if (level === 'urgente' || level === 'vencido') urgent++
      }

      const stats = basicStats.rows[0]
      return {
        total: parseInt(stats.total, 10),
        notified: parseInt(stats.notified, 10),
        pending: parseInt(stats.pending, 10),
        urgent,
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return { total: 0, notified: 0, pending: 0, urgent: 0 }
    }
  }
}