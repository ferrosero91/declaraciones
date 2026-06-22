import { UserManagement } from "@/components/user-management"
import { ExcelImporter } from "@/components/excel-importer"
import { StatsCards } from "@/components/stats-cards"
import { WhatsAppManager } from "@/components/whatsapp-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileSpreadsheet, MessageCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Declaraciones Tributarias
            </h1>
            <p className="text-sm text-neutral-500">
              Calendario tributario Colombia 2025 · recordatorios por WhatsApp personal
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <StatsCards />

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-neutral-100 rounded-lg p-1 h-auto">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 rounded-md px-4 py-2 text-sm text-neutral-600"
            >
              <Users className="h-4 w-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger
              value="import"
              className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 rounded-md px-4 py-2 text-sm text-neutral-600"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Importar
            </TabsTrigger>
            <TabsTrigger
              value="whatsapp"
              className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 rounded-md px-4 py-2 text-sm text-neutral-600"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="import" className="mt-6">
            <ExcelImporter />
          </TabsContent>

          <TabsContent value="whatsapp" className="mt-6">
            <WhatsAppManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}