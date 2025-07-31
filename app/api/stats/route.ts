import { NextResponse } from "next/server"
import { UserService } from "../../lib/user-service"

export async function GET() {
  try {
    const stats = await UserService.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" }, 
      { status: 500 }
    )
  }
}