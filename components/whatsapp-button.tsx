"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, CheckCircle2, Copy } from "lucide-react"
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

  const handleWhatsAppClick = () => {
    const firstName = user.nombres.split(" ")[0]
    const message = `Hola *${firstName}*, le recuerdo que su declaración de renta del año gravable 2024 vence el *${user.fechaVencimiento}*.

Es importante presentarla antes de esta fecha para evitar sanciones por extemporaneidad.

Si requiere asesoría o tiene consultas, quedo atento.

Saludos cordiales.`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/57${user.celular}?text=${encodedMessage}`, "_blank")

    setTimeout(() => {
      onSend()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      toast({
        title: "WhatsApp abierto",
        description: "Mensaje preparado, solo presiona enviar.",
      })
    }, 1000)
  }

  const copyUserData = () => {
    const data = `Nombre: ${user.nombres}\nCédula: ${user.cedula}\nCelular: +57${user.celular}\nVencimiento: ${user.fechaVencimiento}`
    navigator.clipboard.writeText(data)
    toast({ title: "Datos copiados" })
  }

  if (showSuccess) {
    return (
      <Button size="sm" className="h-8 bg-neutral-900 text-white" disabled>
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Enviado
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        onClick={handleWhatsAppClick}
        disabled={disabled || isLoading}
        variant={user.notificado ? "outline" : "default"}
        className="h-8 bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {user.notificado ? "Reenviar" : "Enviar"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={copyUserData}
        className="h-8 w-8 p-0 text-neutral-600 hover:bg-neutral-100"
        title="Copiar datos"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  )
}