import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/user-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, celular, nombres, fechaVencimiento } = body

    // Mensaje profesional y directo
const message = `Hola *${nombres.split(" ")[0]}*, buen día 👋🏼

Te escribo para recordarte que la fecha límite para presentar tu declaración de renta del año gravable 2024 es el *${fechaVencimiento}*.

Es fundamental contar con los documentos a tiempo para evitar sanciones por extemporaneidad. Si aún no los has enviado, te agradecería hacerlo lo antes posible para avanzar con la elaboración de tu declaración.

Si tienes alguna duda o necesitas asesoría, no dudes en escribirme.

Quedo atento.

Elier Fernando Rosero Bravo  
Contador Público`;

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
