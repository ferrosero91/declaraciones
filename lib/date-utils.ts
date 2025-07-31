// Utilidades para manejo de fechas del calendario tributario

export function parseTaxDate(dateString: string): Date {
  // Formato: "DD-M-YYYY" o "D-M-YYYY"
  const [day, month, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month - 1 porque Date usa 0-11 para meses
}

export function sortUsersByDueDate<T extends { fechaVencimiento: string }>(users: T[]): T[] {
  return users.sort((a, b) => {
    const dateA = parseTaxDate(a.fechaVencimiento)
    const dateB = parseTaxDate(b.fechaVencimiento)
    return dateA.getTime() - dateB.getTime()
  })
}

export function getDaysUntilDue(fechaVencimiento: string): number {
  const dueDate = parseTaxDate(fechaVencimiento)
  const today = new Date()
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function getUrgencyLevel(fechaVencimiento: string): 'vencido' | 'urgente' | 'proximo' | 'pendiente' {
  const days = getDaysUntilDue(fechaVencimiento)
  
  if (days < 0) return 'vencido'
  if (days <= 7) return 'urgente'
  if (days <= 30) return 'proximo'
  return 'pendiente'
}