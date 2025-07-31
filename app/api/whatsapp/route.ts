import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "../../lib/user-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, celular, nombres, fechaVencimiento } = body

    // Mensaje profesional y directo
    const message = `Buenos días *${nombres.split(" ")[0]}*,

Espero se encuentre muy bien.

Le escribo para recordarle que su declaración de renta correspondiente al año gravable 2024 tiene como fecha límite de presentación el *${fechaVencimiento}*.

Es importante que presente su declaración antes de esta fecha para evitar sanciones por extemporaneidad.

Si requiere asesoría o tiene alguna consulta, no dude en contactarme.

Quedo atento a cualquier inquietud.

Saludos cordiales.`

    // Marcar usuario como notificado en la base de datos
    if (userId) {
      try {
        await UserService.markAsNotified(userId)
      } catch (dbError) {
        console.error('Error marcando como notificado:', dbError)
        // Continuar aunque falle la actualización de BD
      }
    }

    console.log(`📱 WhatsApp abierto para enviar recordatorio a ${nombres} (+57${celular})`)

    return NextResponse.json({
      success: true,
      message: "WhatsApp abierto exitosamente",
      service: "personal_whatsapp",
      sentTo: `+57${celular}`,
      content: message,
      timestamp: new Date().toISOString(),
      note: "El mensaje se abrió en WhatsApp para envío manual",
    })
  } catch (error) {
    console.error("Error enviando WhatsApp:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al abrir WhatsApp",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
