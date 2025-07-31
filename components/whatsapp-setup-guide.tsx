"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Smartphone, Zap, Shield, Gift, CheckCircle, AlertTriangle, Copy, Settings } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function WhatsAppSetupGuide() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    toast({
      title: "✅ Copiado",
      description: `${label} copiado al portapapeles`,
    })
    setTimeout(() => setCopiedText(null), 2000)
  }

  const services = [
    {
      name: "Twilio Sandbox",
      icon: Zap,
      difficulty: "Fácil",
      cost: "Gratis",
      limit: "Ilimitado en sandbox",
      setup: "5 minutos",
      pros: ["Muy confiable", "Documentación excelente", "Sandbox gratuito"],
      cons: ["Requiere verificación del número", "Sandbox tiene limitaciones"],
      color: "from-red-500 to-pink-500",
    },
    {
      name: "Meta WhatsApp Cloud",
      icon: Smartphone,
      difficulty: "Medio",
      cost: "Gratis",
      limit: "1000 mensajes/mes",
      setup: "15 minutos",
      pros: ["API oficial", "1000 mensajes gratis", "Muy estable"],
      cons: ["Proceso de verificación", "Requiere Facebook Business"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "UltraMsg",
      icon: Gift,
      difficulty: "Fácil",
      cost: "Plan gratuito",
      limit: "100 mensajes/mes",
      setup: "3 minutos",
      pros: ["Muy fácil setup", "No requiere verificación", "Interfaz simple"],
      cons: ["Límite bajo", "Menos confiable"],
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "CallMeBot",
      icon: Shield,
      difficulty: "Muy Fácil",
      cost: "Completamente gratis",
      limit: "Sin límite oficial",
      setup: "1 minuto",
      pros: ["100% gratuito", "Sin registro", "Instantáneo"],
      cons: ["Menos profesional", "Puede ser bloqueado"],
      color: "from-purple-500 to-indigo-500",
    },
  ]

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center p-8">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Smartphone className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Configurar WhatsApp API</CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Sistema de Control Tributario - Configuración de notificaciones
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <Card
            key={service.name}
            className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
            <CardHeader className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color}`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">{service.cost}</Badge>
              </div>

              <CardTitle className="text-xl font-bold text-gray-800">{service.name}</CardTitle>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Dificultad</p>
                  <p className="font-semibold text-gray-800">{service.difficulty}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Setup</p>
                  <p className="font-semibold text-gray-800">{service.setup}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Límite mensual</p>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {service.limit}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Ventajas
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Limitaciones
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.cons.map((con, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="twilio" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-2">
          <TabsTrigger value="twilio" className="rounded-xl">
            Twilio
          </TabsTrigger>
          <TabsTrigger value="meta" className="rounded-xl">
            Meta
          </TabsTrigger>
          <TabsTrigger value="ultramsg" className="rounded-xl">
            UltraMsg
          </TabsTrigger>
          <TabsTrigger value="callmebot" className="rounded-xl">
            CallMeBot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="twilio" className="mt-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-3xl p-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Zap className="h-6 w-6" />
                Configurar Twilio Sandbox (Recomendado)
              </CardTitle>
              <CardDescription className="text-red-100">La opción más confiable y fácil de configurar</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Sandbox gratuito:</strong> Perfecto para pruebas. Los usuarios deben enviar un código
                  específico primero.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">📋 Pasos para configurar:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>
                      Ve a{" "}
                      <a
                        href="https://www.twilio.com/try-twilio"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        twilio.com/try-twilio
                      </a>
                    </li>
                    <li>Crea una cuenta gratuita</li>
                    <li>Ve a Console → Messaging → Try it out → Send a WhatsApp message</li>
                    <li>Copia tu Account SID y Auth Token</li>
                    <li>Agrega las variables de entorno</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">🔑 Variables de entorno:</h4>

                  <div className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span>TWILIO_ACCOUNT_SID=tu_account_sid_aqui</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("TWILIO_ACCOUNT_SID=tu_account_sid_aqui", "Account SID")}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>TWILIO_AUTH_TOKEN=tu_auth_token_aqui</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("TWILIO_AUTH_TOKEN=tu_auth_token_aqui", "Auth Token")}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <Settings className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Importante:</strong> Los usuarios deben enviar "join parent-taught" al número +1 415 523
                    8886 antes de recibir mensajes.
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl h-12"
                  onClick={() => window.open("https://www.twilio.com/try-twilio", "_blank")}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Crear cuenta en Twilio
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="mt-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-3xl p-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Smartphone className="h-6 w-6" />
                Meta WhatsApp Cloud API
              </CardTitle>
              <CardDescription className="text-blue-100">
                API oficial de WhatsApp con 1000 mensajes gratis al mes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>1000 mensajes gratis:</strong> Perfecto para uso profesional con límite generoso.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">📋 Pasos para configurar:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>
                      Ve a{" "}
                      <a
                        href="https://developers.facebook.com/"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        developers.facebook.com
                      </a>
                    </li>
                    <li>Crea una app de Facebook Business</li>
                    <li>Agrega el producto "WhatsApp"</li>
                    <li>Configura un número de teléfono</li>
                    <li>Obtén tu Access Token y Phone Number ID</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">🔑 Variables de entorno:</h4>

                  <div className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span>META_ACCESS_TOKEN=tu_access_token_aqui</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("META_ACCESS_TOKEN=tu_access_token_aqui", "Access Token")}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>META_PHONE_NUMBER_ID=tu_phone_number_id_aqui</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard("META_PHONE_NUMBER_ID=tu_phone_number_id_aqui", "Phone Number ID")
                        }
                        className="text-green-400 hover:text-green-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl h-12"
                  onClick={() => window.open("https://developers.facebook.com/", "_blank")}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Ir a Facebook Developers
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ultramsg" className="mt-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-3xl p-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Gift className="h-6 w-6" />
                UltraMsg - Fácil y Rápido
              </CardTitle>
              <CardDescription className="text-green-100">
                Setup en 3 minutos, 100 mensajes gratis al mes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">📋 Pasos para configurar:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>
                      Ve a{" "}
                      <a
                        href="https://ultramsg.com/"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        ultramsg.com
                      </a>
                    </li>
                    <li>Crea una cuenta gratuita</li>
                    <li>Crea una nueva instancia</li>
                    <li>Escanea el código QR con WhatsApp</li>
                    <li>Copia tu Token e Instance ID</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">🔑 Variables de entorno:</h4>

                  <div className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span>ULTRAMSG_TOKEN=tu_token_aqui</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("ULTRAMSG_TOKEN=tu_token_aqui", "UltraMsg Token")}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>ULTRAMSG_INSTANCE_ID=tu_instance_id_aqui</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("ULTRAMSG_INSTANCE_ID=tu_instance_id_aqui", "Instance ID")}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl h-12"
                  onClick={() => window.open("https://ultramsg.com/", "_blank")}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Crear cuenta en UltraMsg
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="callmebot" className="mt-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-3xl p-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="h-6 w-6" />
                CallMeBot - 100% Gratuito
              </CardTitle>
              <CardDescription className="text-purple-100">
                La opción más simple, sin registro ni límites
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Alert className="bg-purple-50 border-purple-200">
                <Gift className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-800">
                  <strong>Completamente gratis:</strong> Sin límites, sin registro, pero requiere configuración del
                  usuario.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">📋 Pasos para configurar:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Cada usuario debe enviar "I allow callmebot to send me messages" al número +34 644 59 71 67</li>
                    <li>Recibirán un API key personal</li>
                    <li>Usa ese API key para enviar mensajes</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">🔑 Variable de entorno (opcional):</h4>

                  <div className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span>CALLMEBOT_API_KEY=api_key_del_usuario</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("CALLMEBOT_API_KEY=api_key_del_usuario", "CallMeBot API Key")}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Nota:</strong> Cada usuario necesita su propio API key. Es mejor para uso personal.
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-2xl h-12"
                  onClick={() => window.open("https://www.callmebot.com/blog/free-api-whatsapp-messages/", "_blank")}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Ver guía de CallMeBot
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
