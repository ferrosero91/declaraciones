"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Settings, MessageCircle, CheckCircle, Info, Phone, Edit } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function WhatsAppManager() {
  const [myNumber, setMyNumber] = useState("573117098269")
  const [messageTemplate, setMessageTemplate] = useState(`Buenos días *[NOMBRE]*,

Espero se encuentre muy bien.

Le escribo para recordarle que su declaración de renta correspondiente al año gravable 2024 tiene como fecha límite de presentación el *[FECHA]*.

Es importante que presente su declaración antes de esta fecha para evitar sanciones por extemporaneidad.

Si requiere asesoría o tiene alguna consulta, no dude en contactarme.

Quedo atento a cualquier inquietud.

Saludos cordiales.`)

  const testWhatsApp = () => {
    const testMessage = messageTemplate.replace("[NOMBRE]", "Juan").replace("[FECHA]", "15 de agosto de 2025")

    const encodedMessage = encodeURIComponent(testMessage)
    const whatsappUrl = `https://wa.me/${myNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")

    toast({
      title: "🧪 Mensaje de prueba",
      description: "WhatsApp abierto con mensaje de ejemplo",
    })
  }

  const openWhatsAppWeb = () => {
    window.open("https://web.whatsapp.com/", "_blank")
    toast({
      title: "🌐 WhatsApp Web",
      description: "WhatsApp Web abierto en nueva pestaña",
    })
  }

  const resetTemplate = () => {
    setMessageTemplate(`Buenos días *[NOMBRE]*,

Espero se encuentre muy bien.

Le escribo para recordarle que su declaración de renta correspondiente al año gravable 2024 tiene como fecha límite de presentación el *[FECHA]*.

Es importante que presente su declaración antes de esta fecha para evitar sanciones por extemporaneidad.

Si requiere asesoría o tiene alguna consulta, no dude en contactarme.

Quedo atento a cualquier inquietud.

Saludos cordiales.`)

    toast({
      title: "🔄 Plantilla restaurada",
      description: "Se ha restaurado la plantilla original del mensaje",
    })
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Configuración de WhatsApp</CardTitle>
            <CardDescription className="text-green-100">Personaliza tu número y plantilla de mensajes</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Información del sistema */}
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>¿Cómo funciona?</strong> Al hacer clic en "Enviar Recordatorio", se abrirá WhatsApp con el mensaje
            personalizado ya escrito. Solo tienes que presionar enviar.
          </AlertDescription>
        </Alert>

        {/* Configuración del número */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración Personal
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="my-number" className="text-sm font-semibold text-gray-700">
                  Tu número de WhatsApp
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="my-number"
                    value={myNumber}
                    onChange={(e) => setMyNumber(e.target.value)}
                    placeholder="573117098269"
                    className="pl-12 h-12 rounded-2xl border-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Formato: 57 + número sin espacios</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="message-template" className="text-sm font-semibold text-gray-700">
                    Plantilla del mensaje
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetTemplate}
                    className="text-xs rounded-xl bg-transparent"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Restaurar
                  </Button>
                </div>
                <Textarea
                  id="message-template"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Escribe tu plantilla de mensaje aquí..."
                  className="min-h-[200px] rounded-2xl border-gray-200 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa <strong>[NOMBRE]</strong> para el nombre del cliente y <strong>[FECHA]</strong> para la fecha de
                  vencimiento
                </p>
              </div>
            </div>
          </div>

          {/* Estado actual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Sin APIs</h4>
              <p className="text-sm text-green-600">100% Gratuito</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">Profesional</h4>
              <p className="text-sm text-blue-600">Mensajes personalizados</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <Smartphone className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-800">Personal</h4>
              <p className="text-sm text-purple-600">Desde tu WhatsApp</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={testWhatsApp}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl h-12"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Probar Mensaje
            </Button>

            <Button
              onClick={openWhatsAppWeb}
              variant="outline"
              className="flex-1 rounded-2xl h-12 border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Abrir WhatsApp Web
            </Button>
          </div>

          {/* Vista previa del mensaje */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">📱 Vista previa del mensaje:</h4>
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-sm text-gray-700 whitespace-pre-line">
              {messageTemplate.replace("[NOMBRE]", "Juan").replace("[FECHA]", "15 de agosto de 2025")}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">📋 Instrucciones de uso:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>Personaliza tu plantilla de mensaje si lo deseas</li>
              <li>Haz clic en "Enviar Recordatorio" junto al usuario</li>
              <li>Se abrirá WhatsApp con el mensaje personalizado</li>
              <li>Revisa el mensaje y presiona enviar</li>
              <li>El sistema marcará automáticamente como "enviado"</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
