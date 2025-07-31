"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, ExternalLink, CheckCircle2, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  cedula: string
  nombres: string
  celular: string
  fechaVencimiento: string
  notificado: boolean
}

interface WhatsAppButtonProps {
  user: User
  onSend: () => void
  isLoading: boolean
  disabled: boolean
}

export function WhatsAppButton({ user, onSend, isLoading, disabled }: WhatsAppButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  // Tu número personal de WhatsApp
  const myWhatsAppNumber = "573117098269"

  const handleWhatsAppClick = () => {
    // Mensaje profesional y directo
    const message = `Buenos días *${user.nombres.split(" ")[0]}*,

Espero se encuentre muy bien.

Le escribo para recordarle que su declaración de renta correspondiente al año gravable 2024 tiene como fecha límite de presentación el *${user.fechaVencimiento}*.

Es importante que presente su declaración antes de esta fecha para evitar sanciones por extemporaneidad.

Si requiere asesoría o tiene alguna consulta, no dude en contactarme.

Quedo atento a cualquier inquietud.

Saludos cordiales.`

    // Crear URL de WhatsApp que abrirá tu WhatsApp con el mensaje pre-escrito
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${user.celular}?text=${encodedMessage}`

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank")

    // Marcar como enviado después de un momento
    setTimeout(() => {
      onSend()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      toast({
        title: "📱 WhatsApp abierto",
        description: `Mensaje preparado para ${user.nombres.split(" ")[0]}. ¡Solo presiona enviar!`,
      })
    }, 1000)
  }

  const copyUserData = () => {
    const userData = `Nombre: ${user.nombres}
Cédula: ${user.cedula}
Celular: +57${user.celular}
Vencimiento: ${user.fechaVencimiento}`

    navigator.clipboard.writeText(userData)
    toast({
      title: "📋 Datos copiados",
      description: "Información del usuario copiada al portapapeles",
    })
  }

  const openMyWhatsApp = () => {
    // Mensaje que aparecerá en tu WhatsApp personal
    const myMessage = `📋 RECORDATORIO ENVIADO

Cliente: ${user.nombres}
Cédula: ${user.cedula}
Celular: +57${user.celular}
Vencimiento: ${user.fechaVencimiento}

Recordatorio enviado ✅`

    const encodedMessage = encodeURIComponent(myMessage)
    const myWhatsAppUrl = `https://wa.me/${myWhatsAppNumber}?text=${encodedMessage}`

    window.open(myWhatsAppUrl, "_blank")

    toast({
      title: "📱 Tu WhatsApp abierto",
      description: "Datos del cliente guardados en tu chat personal",
    })
  }

  if (showSuccess) {
    return (
      <Button
        size="sm"
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 rounded-xl shadow-lg"
        disabled
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Mensaje Enviado
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      {/* Botón principal - Enviar mensaje al cliente */}
      <Button
        size="sm"
        onClick={handleWhatsAppClick}
        disabled={disabled}
        className={`rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${
          user.notificado
            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
        }`}
        title={`Enviar recordatorio a ${user.nombres.split(" ")[0]}`}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {user.notificado ? "Reenviar" : "Enviar Recordatorio"}
      </Button>

      {/* Botón para copiar datos */}
      <Button
        size="sm"
        variant="outline"
        onClick={copyUserData}
        className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 bg-transparent"
        title="Copiar datos del usuario"
      >
        <Copy className="h-4 w-4" />
      </Button>

      {/* Botón para abrir tu WhatsApp personal */}
      <Button
        size="sm"
        variant="outline"
        onClick={openMyWhatsApp}
        className="rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 bg-transparent"
        title="Guardar en mi WhatsApp personal"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  )
}
