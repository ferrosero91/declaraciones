import { UserManagement } from "@/components/user-management"
import { ExcelImporter } from "@/components/excel-importer"
import { StatsCards } from "@/components/stats-cards"
import { WhatsAppManager } from "@/components/whatsapp-manager"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileSpreadsheet, Users, Bell, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Premium */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-36 -translate-y-36 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>

        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Sistema Tributario Colombia 2025
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Control de Declaraciones
              </span>
              <span className="block text-white">Tributarias Colombia</span>
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Sistema simplificado con WhatsApp personal - Sin APIs, 100% gratuito
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <Users className="h-3 w-3 mr-1" />
                Gestión de Usuarios
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <Bell className="h-3 w-3 mr-1" />
                WhatsApp Personal
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <FileSpreadsheet className="h-3 w-3 mr-1" />
                Importación Excel
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <StatsCards />

        <div className="mt-8">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-2">
              <TabsTrigger
                value="users"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Users className="h-4 w-4 mr-2" />
                Gestión de Usuarios
              </TabsTrigger>
              <TabsTrigger
                value="import"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Importar Excel
              </TabsTrigger>
              <TabsTrigger
                value="whatsapp"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                WhatsApp
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-8">
              <UserManagement />
            </TabsContent>

            <TabsContent value="import" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8">
                  <div className="text-center text-white space-y-2">
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-90" />
                    <h2 className="text-2xl font-bold">Importar Base de Datos</h2>
                    <p className="text-emerald-100">
                      Sube un archivo Excel con los datos de los usuarios (Cédula, Nombres, Celular)
                    </p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <ExcelImporter />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="whatsapp" className="mt-8">
              <WhatsAppManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
