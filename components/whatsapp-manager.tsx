"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Phone, ArrowUpRight } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

const DEFAULT_TEMPLATE = `Hola *[NOMBRE]*,

Le recuerdo que su declaración de renta del año gravable 2024 vence el *[FECHA]*.

Es importante presentarla antes de esta fecha para evitar sanciones por extemporaneidad.

Si requiere asesoría, quedo atento.

Saludos cordiales.`

export function WhatsAppManager() {
  const [myNumber, setMyNumber] = useState("573117098269")
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_TEMPLATE)

  const testWhatsApp = () => {
    const preview = messageTemplate
      .replace("[NOMBRE]", "Juan")
      .replace("[FECHA]", "15 de agosto de 2025")
    window.open(`https://wa.me/${myNumber}?text=${encodeURIComponent(preview)}`, "_blank")
    toast({ title: "WhatsApp abierto", description: "Mensaje de prueba enviado" })
  }

  const openWhatsAppWeb = () => {
    window.open("https://web.whatsapp.com/", "_blank")
    toast({ title: "WhatsApp Web abierto" })
  }

  const resetTemplate = () => {
    setMessageTemplate(DEFAULT_TEMPLATE)
    toast({ title: "Plantilla restaurada" })
  }

  return (
    <Card className="border-neutral-200 bg-white shadow-none rounded-lg divide-y divide-neutral-200">
      <div className="p-5">
        <h2 className="text-base font-semibold text-neutral-900">Configuración de WhatsApp</h2>
        <p className="text-sm text-neutral-500 mt-1">
          El sistema abre WhatsApp con un mensaje pre-escrito. Solo presionas enviar. 100% gratuito, sin APIs.
        </p>
      </div>

      <div className="p-5 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="my-number" className="text-sm text-neutral-700">Tu número de WhatsApp</Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="my-number"
                value={myNumber}
                onChange={(e) => setMyNumber(e.target.value)}
                placeholder="573117098269"
                className="pl-9 h-10 bg-white border-neutral-200"
              />
            </div>
            <p className="text-xs text-neutral-400 mt-1">Formato: 57 + número, sin espacios</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="message-template" className="text-sm text-neutral-700">
                Plantilla del mensaje
              </Label>
              <Button size="sm" variant="ghost" onClick={resetTemplate} className="h-7 text-xs text-neutral-600">
                Restaurar
              </Button>
            </div>
            <Textarea
              id="message-template"
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="min-h-[180px] bg-white border-neutral-200 text-sm"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Usa <code className="text-neutral-700">[NOMBRE]</code> y <code className="text-neutral-700">[FECHA]</code> como variables.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={testWhatsApp}
            className="flex-1 h-10 bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Probar mensaje
          </Button>
          <Button
            onClick={openWhatsAppWeb}
            variant="outline"
            className="flex-1 h-10 border-neutral-200 text-neutral-700"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Abrir WhatsApp Web
          </Button>
        </div>
      </div>

      <div className="p-5 bg-neutral-50">
        <h3 className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Vista previa</h3>
        <div className="bg-white border border-neutral-200 rounded-md p-4 text-sm text-neutral-700 whitespace-pre-line">
          {messageTemplate
            .replace("[NOMBRE]", "Juan")
            .replace("[FECHA]", "15 de agosto de 2025")}
        </div>
      </div>
    </Card>
  )
}