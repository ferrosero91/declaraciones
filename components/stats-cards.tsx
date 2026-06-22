"use client"

import { Card } from "@/components/ui/card"
import { Users, Bell, CalendarClock, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface StatsData {
  total: number
  pending: number
  notified: number
  urgent: number
}

const initialStats: StatsData = { total: 0, pending: 0, notified: 0, urgent: 0 }

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>(initialStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          setStats(await response.json())
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
    { title: "Total usuarios", value: stats.total, icon: Users },
    { title: "Pendientes", value: stats.pending, icon: CalendarClock },
    { title: "Notificados", value: stats.notified, icon: Bell },
    { title: "Urgentes", value: stats.urgent, icon: AlertCircle },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-lg border border-neutral-200 bg-neutral-50 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-neutral-200 bg-white p-5 rounded-lg shadow-none">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-neutral-500">{card.title}</p>
            <card.icon className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-neutral-900 tabular-nums">
            {card.value.toLocaleString('es-CO')}
          </p>
        </Card>
      ))}
    </div>
  )
}