"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
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
  const [importedData, setImportedData] = useState<ImportedUser[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    if (
      selectedFile.type.includes("sheet") ||
      selectedFile.name.endsWith(".xlsx") ||
      selectedFile.name.endsWith(".xls") ||
      selectedFile.name.endsWith(".csv")
    ) {
      setFile(selectedFile)
      setImportedData([])
      setShowPreview(false)
    } else {
      toast({
        title: "Archivo inválido",
        description: "Selecciona .xlsx, .xls o .csv",
        variant: "destructive",
      })
    }
  }

  const validateUser = (user: { cedula?: string; nombres?: string; celular?: string }) => {
    const errors: string[] = []
    if (!user.cedula || user.cedula.toString().length < 6) errors.push("Cédula inválida")
    if (!user.nombres || user.nombres.toString().trim().length < 3) errors.push("Nombres requeridos")
    if (!user.celular || !/^3\d{9}$/.test(user.celular.toString()))
      errors.push("Celular inválido (10 dígitos, inicia con 3)")
    return { valid: errors.length === 0, errors }
  }

  const parseFile = async (file: File): Promise<ImportedUser[]> => {
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(Boolean)
    const data: ImportedUser[] = []

    let startIndex = 0
    if (lines.length > 0) {
      const firstLine = lines[0].toLowerCase()
      if (firstLine.includes("cedula") || firstLine.includes("nombre") || firstLine.includes("celular")) {
        startIndex = 1
      }
    }

    for (let i = startIndex; i < lines.length; i++) {
      const cols = lines[i].split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, ""))
      if (cols.length < 3) continue
      const user = { cedula: cols[0], nombres: cols[1], celular: cols[2] }
      const validation = validateUser(user)
      data.push({
        ...user,
        fechaVencimiento: calculateDueDate(user.cedula),
        valid: validation.valid,
        errors: validation.errors,
      })
    }

    return data
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    try {
      const data = await parseFile(file)
      if (data.length === 0) {
        toast({ title: "Sin datos", description: "No se encontraron filas válidas", variant: "destructive" })
        return
      }
      setImportedData(data)
      setShowPreview(true)
      toast({ title: "Vista previa lista", description: `${data.length} filas procesadas` })
    } catch {
      toast({ title: "Error", description: "No se pudo leer el archivo", variant: "destructive" })
    } finally {
      setImporting(false)
    }
  }

  const handleConfirmImport = async () => {
    const validUsers = importedData.filter((u) => u.valid)
    if (validUsers.length === 0) return
    setSaving(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulk: true, users: validUsers }),
      })
      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Importación completada",
          description: `${result.created} usuarios guardados${result.errors.length ? ` · ${result.errors.length} errores` : ""}`,
        })
        setImportedData([])
        setShowPreview(false)
        setFile(null)
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Error al guardar", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const validCount = importedData.filter((u) => u.valid).length
  const invalidCount = importedData.length - validCount

  return (
    <div className="space-y-6">
      <Card className="border-neutral-200 bg-white shadow-none rounded-lg divide-y divide-neutral-200">
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="excel-file" className="text-sm text-neutral-700 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-neutral-400" />
              Archivo de datos (.xlsx, .csv)
            </Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={importing}
              className="h-10 bg-white border-neutral-200 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-neutral-100 file:text-neutral-700"
            />
            <Alert className="bg-neutral-50 border-neutral-200 rounded-md">
              <Sparkles className="h-4 w-4 text-neutral-400" />
              <AlertDescription className="text-sm text-neutral-600">
                El archivo debe contener columnas: <strong>Cédula, Nombres, Celular</strong>.
                Soporta Excel (.xlsx) y CSV.
              </AlertDescription>
            </Alert>
          </div>

          {file && (
            <div className="text-sm text-neutral-600 flex items-center justify-between border border-neutral-200 rounded-md px-3 py-2">
              <span className="truncate">{file.name}</span>
              <span className="text-xs text-neutral-400 ml-2 shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}

          {importing && (
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <div className="animate-spin h-4 w-4 border-2 border-neutral-300 border-t-neutral-700 rounded-full"></div>
              Procesando archivo...
            </div>
          )}

          <Button
            onClick={handleImport}
            disabled={!file || importing}
            className="h-10 bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar vista previa
          </Button>
        </div>
      </Card>

      {showPreview && importedData.length > 0 && (
        <Card className="border-neutral-200 bg-white shadow-none rounded-lg overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-900">Vista previa</h3>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-neutral-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {validCount} válidos
              </span>
              {invalidCount > 0 && (
                <span className="flex items-center gap-1.5 text-neutral-700">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  {invalidCount} errores
                </span>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Estado</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Cédula</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Nombre</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Celular</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Vencimiento</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Errores</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importedData.map((user, index) => (
                  <TableRow key={index} className={`border-neutral-100 ${user.valid ? "" : "bg-red-50/40"}`}>
                    <TableCell>
                      {user.valid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-neutral-800">{user.cedula}</TableCell>
                    <TableCell className="text-neutral-700">{user.nombres}</TableCell>
                    <TableCell className="text-neutral-600">+57 {user.celular}</TableCell>
                    <TableCell className="text-neutral-800 tabular-nums">{user.fechaVencimiento}</TableCell>
                    <TableCell className="text-xs text-red-600">
                      {user.errors.length > 0 && (
                        <div className="space-y-1">
                          {user.errors.map((error, i) => (<div key={i}>{error}</div>))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-5 border-t border-neutral-200 flex gap-3">
            <Button
              onClick={handleConfirmImport}
              disabled={validCount === 0 || saving}
              className="flex-1 h-10 bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              {saving ? "Guardando..." : `Confirmar importación (${validCount})`}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowPreview(false); setImportedData([]) }}
              className="h-10 border-neutral-200 text-neutral-700"
            >
              Cancelar
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}