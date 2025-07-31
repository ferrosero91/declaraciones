import { WhatsAppSetupGuide } from "@/components/whatsapp-setup-guide"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 rounded-2xl bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al sistema
            </Button>
          </Link>
        </div>

        <WhatsAppSetupGuide />
      </div>
    </div>
  )
}
