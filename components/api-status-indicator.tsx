"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, Settings, Zap } from "lucide-react"
import Link from "next/link"

interface APIStatus {
  service: string
  status: "connected" | "error" | "not-configured"
  message: string
}

export function APIStatusIndicator() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAPIStatus()
  }, [])

  const checkAPIStatus = async () => {
    setLoading(true)

    // Simular verificación de APIs
    const statuses: APIStatus[] = [
      {
        service: "Twilio",
        status: process.env.NEXT_PUBLIC_TWILIO_CONFIGURED === "true" ? "connected" : "not-configured",
        message: process.env.NEXT_PUBLIC_TWILIO_CONFIGURED === "true" ? "Conectado y funcionando" : "No configurado",
      },
      {
        service: "Meta WhatsApp",
        status: process.env.NEXT_PUBLIC_META_CONFIGURED === "true" ? "connected" : "not-configured",
        message: process.env.NEXT_PUBLIC_META_CONFIGURED === "true" ? "API oficial activa" : "No configurado",
      },
      {
        service: "UltraMsg",
        status: process.env.NEXT_PUBLIC_ULTRAMSG_CONFIGURED === "true" ? "connected" : "not-configured",
        message: process.env.NEXT_PUBLIC_ULTRAMSG_CONFIGURED === "true" ? "Instancia activa" : "No configurado",
      },
      {
        service: "CallMeBot",
        status: "not-configured",
        message: "Requiere configuración por usuario",
      },
    ]

    setApiStatuses(statuses)
    setLoading(false)
  }

  const getStatusIcon = (status: APIStatus["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: APIStatus["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Conectado</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Error</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">No configurado</Badge>
    }
  }

  const hasConnectedAPI = apiStatuses.some((api) => api.status === "connected")

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-blue-500" />
              Estado de APIs WhatsApp
            </CardTitle>
            <CardDescription>
              {hasConnectedAPI
                ? "Tienes al menos una API configurada"
                : "Configura una API para enviar mensajes reales"}
            </CardDescription>
          </div>
          <Link href="/setup">
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          apiStatuses.map((api) => (
            <div
              key={api.service}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(api.status)}
                <div>
                  <p className="font-medium text-gray-800">{api.service}</p>
                  <p className="text-sm text-gray-600">{api.message}</p>
                </div>
              </div>
              {getStatusBadge(api.status)}
            </div>
          ))
        )}

        {!hasConnectedAPI && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800 mb-3">
              <strong>💡 Recomendación:</strong> Configura Twilio Sandbox para empezar rápidamente
            </p>
            <Link href="/setup">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                Configurar ahora
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
