import { randomUUID } from 'crypto'
import { all, get, run, transaction } from './database'
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

interface UserRow {
  id: string
  cedula: string
  nombres: string
  celular: string
  fecha_vencimiento: string
  notificado: number
  last_notification: string | null
  created_at: string
  updated_at: string
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    cedula: row.cedula,
    nombres: row.nombres,
    celular: row.celular,
    fechaVencimiento: row.fecha_vencimiento,
    notificado: Boolean(row.notificado),
    lastNotification: row.last_notification ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const SELECT_COLUMNS = `
  id,
  cedula,
  nombres,
  celular,
  fecha_vencimiento,
  notificado,
  last_notification,
  created_at,
  updated_at
`

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const rows = all<UserRow>(`SELECT ${SELECT_COLUMNS} FROM users`)
      return sortUsersByDueDate(rows.map(rowToUser))
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
      const existing = get<{ id: string }>(
        'SELECT id FROM users WHERE cedula = ?',
        cedula,
      )
      if (existing) {
        throw new Error('Ya existe un usuario con esta cédula')
      }

      const id = randomUUID()
      const fechaVencimiento = calculateDueDate(cedula)

      run(
        `INSERT INTO users (id, cedula, nombres, celular, fecha_vencimiento)
         VALUES (?, ?, ?, ?, ?)`,
        id, cedula, nombres, celular, fechaVencimiento,
      )

      const row = get<UserRow>(
        `SELECT ${SELECT_COLUMNS} FROM users WHERE id = ?`,
        id,
      )
      return rowToUser(row!)
    } catch (error) {
      console.error('Error creando usuario:', error)
      throw error
    }
  }

  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const pattern = `%${searchTerm}%`
      const rows = all<UserRow>(
        `SELECT ${SELECT_COLUMNS} FROM users
         WHERE LOWER(nombres) LIKE LOWER(?) OR cedula LIKE ?`,
        pattern, pattern,
      )
      return sortUsersByDueDate(rows.map(rowToUser))
    } catch (error) {
      console.error('Error buscando usuarios:', error)
      throw new Error('Error al buscar usuarios')
    }
  }

  static async markAsNotified(userId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const result = run(
        `UPDATE users
         SET notificado = 1, last_notification = ?, updated_at = datetime('now')
         WHERE id = ?`,
        today, userId,
      )
      if (result.changes === 0) {
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
      const existing = get<{ id: string }>(
        'SELECT id FROM users WHERE cedula = ? AND id != ?',
        cedula, id,
      )
      if (existing) {
        throw new Error('Ya existe otro usuario con esta cédula')
      }

      const fechaVencimiento = calculateDueDate(cedula)
      const result = run(
        `UPDATE users
         SET cedula = ?, nombres = ?, celular = ?, fecha_vencimiento = ?, updated_at = datetime('now')
         WHERE id = ?`,
        cedula, nombres, celular, fechaVencimiento, id,
      )

      if (result.changes === 0) {
        throw new Error('Usuario no encontrado')
      }

      const row = get<UserRow>(
        `SELECT ${SELECT_COLUMNS} FROM users WHERE id = ?`,
        id,
      )
      return rowToUser(row!)
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      throw error
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      const result = run('DELETE FROM users WHERE id = ?', id)
      if (result.changes === 0) {
        throw new Error('Usuario no encontrado')
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error)
      throw error
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const row = get<UserRow>(
        `SELECT ${SELECT_COLUMNS} FROM users WHERE id = ?`,
        id,
      )
      return row ? rowToUser(row) : null
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

    transaction(() => {
      for (const userData of usersData) {
        try {
          const existing = get<{ id: string }>(
            'SELECT id FROM users WHERE cedula = ?',
            userData.cedula,
          )
          if (existing) {
            throw new Error('Ya existe un usuario con esta cédula')
          }

          const id = randomUUID()
          const fechaVencimiento = calculateDueDate(userData.cedula)
          run(
            `INSERT INTO users (id, cedula, nombres, celular, fecha_vencimiento)
             VALUES (?, ?, ?, ?, ?)`,
            id, userData.cedula, userData.nombres, userData.celular, fechaVencimiento,
          )
          created++
        } catch (error) {
          errors.push({
            cedula: userData.cedula,
            error: error instanceof Error ? error.message : 'Error desconocido',
          })
        }
      }
    })

    return { created, errors }
  }

  static async getStats() {
    try {
      const totals = get<{ total: number; notified: number; pending: number }>(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN notificado = 1 THEN 1 ELSE 0 END) as notified,
          SUM(CASE WHEN notificado = 0 THEN 1 ELSE 0 END) as pending
        FROM users
      `) ?? { total: 0, notified: 0, pending: 0 }

      const rows = all<{ fecha_vencimiento: string; notificado: number }>(
        'SELECT fecha_vencimiento, notificado FROM users',
      )

      let urgent = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      for (const row of rows) {
        if (row.notificado === 1) continue
        const level = getUrgencyLevel(row.fecha_vencimiento)
        if (level === 'urgente' || level === 'vencido') urgent++
      }

      return {
        total: totals.total,
        notified: totals.notified,
        pending: totals.pending,
        urgent,
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return { total: 0, notified: 0, pending: 0, urgent: 0 }
    }
  }
}