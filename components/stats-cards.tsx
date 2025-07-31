"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Bell, TrendingUp, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface StatsData {
  total: number
  pending: number
  notified: number
  urgent: number
  totalChange: string
  pendingChange: string
  notifiedChange: string
  urgentChange: string
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    pending: 0,
    notified: 0,
    urgent: 0,
    totalChange: '0%',
    pendingChange: '0%',
    notifiedChange: '0%',
    urgentChange: '0%'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: "Total Usuarios",
      value: stats.total,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      change: stats.totalChange,
      changeType: stats.totalChange.startsWith('+') ? "positive" as const : "negative" as const,
    },
    {
      title: "Declaraciones Pendientes",
      value: stats.pending,
      icon: Calendar,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      change: stats.pendingChange,
      changeType: stats.pendingChange.startsWith('-') ? "positive" as const : "negative" as const,
    },
    {
      title: "Notificaciones Enviadas",
      value: stats.notified,
      icon: Bell,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      change: stats.notifiedChange,
      changeType: stats.notifiedChange.startsWith('+') ? "positive" as const : "negative" as const,
    },
    {
      title: "Casos Urgentes",
      value: stats.urgent,
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      change: stats.urgentChange,
      changeType: stats.urgentChange.startsWith('-') ? "positive" as const : "negative" as const,
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: "slideInUp 0.6s ease-out forwards",
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`}></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

          <CardContent className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <Badge
                variant={card.changeType === "positive" ? "default" : "destructive"}
                className="bg-white/80 text-gray-700 hover:bg-white/90 transition-colors"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {card.change}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                {card.value.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium">
        <Calendar className="h-4 w-4" />
        Control Tributario Colombia 2025
      </div>
    </div>
  )
}
