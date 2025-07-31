"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { calculateDueDate } from "@/lib/tax-calendar"

interface ImportedUser {
  cedula: string
  nombres: string
  celular: string
  fechaVencimiento: string
  valid: boolean
  errors: string[]
}

export function ExcelImporter() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importedData, setImportedData] = useState<ImportedUser[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type.includes("sheet") ||
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        setFile(selectedFile)
        setImportedData([])
        setShowPreview(false)
      } else {
        toast({
          title: "❌ Archivo inválido",
          description: "Por favor selecciona un archivo Excel (.xlsx o .xls)",
          variant: "destructive",
        })
      }
    }
  }

  const validateUser = (user: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!user.cedula || user.cedula.toString().length < 6) {
      errors.push("Cédula inválida")
    }

    if (!user.nombres || user.nombres.toString().trim().length < 3) {
      errors.push("Nombres requeridos")
    }

    if (!user.celular || !/^3\d{9}$/.test(user.celular.toString())) {
      errors.push("Celular inválido (debe ser 10 dígitos comenzando con 3)")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  const simulateExcelImport = async (): Promise<ImportedUser[]> => {
    const sampleData = [
      { cedula: "12345678", nombres: "MARIA GONZALEZ LOPEZ", celular: "3001234567" },
      { cedula: "87654321", nombres: "CARLOS RODRIGUEZ MARTINEZ", celular: "3109876543" },
      { cedula: "11223344", nombres: "ANA PATRICIA SILVA", celular: "3201122334" },
      { cedula: "99887766", nombres: "JORGE LUIS HERRERA", celular: "3159988776" },
      { cedula: "55443322", nombres: "LUCIA FERNANDA CASTRO", celular: "3125544332" },
      { cedula: "77889900", nombres: "PEDRO ANTONIO MORALES", celular: "3187789900" },
      { cedula: "44556677", nombres: "SOFIA ELENA VARGAS", celular: "3144556677" },
    ]

    return sampleData.map((user) => {
      const validation = validateUser(user)
      return {
        ...user,
        fechaVencimiento: calculateDueDate(user.cedula),
        valid: validation.valid,
        errors: validation.errors,
      }
    })
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)

    try {
      // Simular progreso de importación con animación suave
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      const data = await simulateExcelImport()
      setImportedData(data)
      setShowPreview(true)

      toast({
        title: "🎉 Importación completada",
        description: `Se procesaron ${data.length} registros exitosamente`,
      })
    } catch (error) {
      toast({
        title: "❌ Error en la importación",
        description: "Hubo un problema al procesar el archivo",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
      setProgress(0)
    }
  }

  const handleConfirmImport = () => {
    const validUsers = importedData.filter((user) => user.valid)

    console.log("Guardando usuarios:", validUsers)

    toast({
      title: "✅ Usuarios guardados exitosamente",
      description: `Se guardaron ${validUsers.length} usuarios válidos en el sistema`,
    })

    setImportedData([])
    setShowPreview(false)
    setFile(null)
  }

  const validCount = importedData.filter((user) => user.valid).length
  const invalidCount = importedData.length - validCount

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="excel-file" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-500" />
            Archivo Excel
          </Label>

          <div className="relative">
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={importing}
              className="h-14 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="absolute right-4 top-4">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              El archivo debe contener columnas: <strong>Cédula, Nombres, Celular</strong>
            </p>
          </div>
        </div>

        {file && (
          <Alert className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            <AlertDescription className="text-emerald-700">
              <div className="flex items-center justify-between">
                <div>
                  Archivo seleccionado: <strong>{file.name}</strong>
                </div>
                <div className="text-sm bg-emerald-100 px-3 py-1 rounded-full">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {importing && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Upload className="h-5 w-5 text-white animate-bounce" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Procesando archivo...</h3>
                  <p className="text-sm text-gray-600">Importando y validando datos</p>
                </div>
              </div>
              <Progress value={progress} className="w-full h-3 bg-white/50" />
              <div className="text-center text-sm font-medium text-blue-600">{progress}% completado</div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleImport}
          disabled={!file || importing}
          className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-lg font-semibold"
        >
          {importing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Importando datos...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-3" />
              Importar y Procesar Datos
            </>
          )}
        </Button>
      </div>

      {/* Preview Section */}
      {showPreview && importedData.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  Vista Previa de Importación
                </CardTitle>
                <p className="text-indigo-100 mt-2">Revisa los datos antes de confirmar la importación</p>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="bg-white/20 rounded-2xl px-4 py-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="font-semibold">Válidos: {validCount}</span>
                </div>
                <div className="bg-white/20 rounded-2xl px-4 py-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-300" />
                  <span className="font-semibold">Con errores: {invalidCount}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                    <TableHead className="font-semibold text-gray-700 py-4">Estado</TableHead>
                    <TableHead className="font-semibold text-gray-700">Cédula</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nombres</TableHead>
                    <TableHead className="font-semibold text-gray-700">Celular</TableHead>
                    <TableHead className="font-semibold text-gray-700">Fecha Vencimiento</TableHead>
                    <TableHead className="font-semibold text-gray-700">Errores</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedData.map((user, index) => (
                    <TableRow
                      key={index}
                      className={`transition-all duration-300 hover:bg-gradient-to-r ${
                        user.valid
                          ? "hover:from-green-50 hover:to-emerald-50 border-b border-gray-50"
                          : "bg-red-50 hover:from-red-100 hover:to-pink-100 border-b border-red-100"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: "fadeInUp 0.5s ease-out forwards",
                      }}
                    >
                      <TableCell className="py-4">
                        {user.valid ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-green-600 font-medium text-sm">Válido</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-600 font-medium text-sm">Error</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-gray-800">{user.cedula}</TableCell>
                      <TableCell className="font-medium text-gray-700">{user.nombres}</TableCell>
                      <TableCell className="text-gray-600">+57 {user.celular}</TableCell>
                      <TableCell className="font-bold text-blue-600">{user.fechaVencimiento}</TableCell>
                      <TableCell>
                        {user.errors.length > 0 && (
                          <div className="space-y-1">
                            {user.errors.map((error, i) => (
                              <div key={i} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                                {error}
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100">
            <div className="flex gap-4">
              <Button
                onClick={handleConfirmImport}
                disabled={validCount === 0}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-semibold"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Confirmar Importación ({validCount} usuarios)
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setShowPreview(false)
                  setImportedData([])
                }}
                className="px-8 h-12 rounded-2xl border-gray-200 hover:bg-gray-50 transition-all duration-300"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
