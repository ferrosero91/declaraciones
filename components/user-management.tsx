"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Phone, CheckCircle2, Edit, Trash2, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getDaysUntilDue } from "@/lib/date-utils"

interface UserManagementUser {
  id: string
  cedula: string
  nombres: string
  celular: string
  fechaVencimiento: string
  notificado: boolean
  lastNotification?: string | null
}

const emptyUser = { cedula: "", nombres: "", celular: "" }

export function UserManagement() {
  const [users, setUsers] = useState<UserManagementUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newUser, setNewUser] = useState(emptyUser)
  const [editingUser, setEditingUser] = useState<UserManagementUser | null>(null)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [sendingNotification, setSendingNotification] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        setUsers(await response.json())
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({ title: "Error", description: "Error al cargar usuarios", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cedula.includes(searchTerm),
  )

  const validateCelular = (celular: string) => /^3\d{9}$/.test(celular)

  const handleAddUser = async () => {
    if (!newUser.cedula || !newUser.nombres || !newUser.celular) {
      toast({ title: "Error", description: "Todos los campos son obligatorios", variant: "destructive" })
      return
    }
    if (!validateCelular(newUser.celular)) {
      toast({ title: "Error", description: "El celular debe tener 10 dígitos y comenzar con 3", variant: "destructive" })
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: newUser.cedula.trim(),
          nombres: newUser.nombres.trim().toUpperCase(),
          celular: newUser.celular.trim(),
        }),
      })

      if (response.ok) {
        const created = await response.json()
        setUsers([...users, created])
        setNewUser(emptyUser)
        setIsAddingUser(false)
        toast({ title: "Usuario agregado", description: `Vence el ${created.fechaVencimiento}` })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Error al agregar", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    }
  }

  const handleEditUser = async () => {
    if (!editingUser || !editingUser.cedula || !editingUser.nombres || !editingUser.celular) {
      toast({ title: "Error", description: "Todos los campos son obligatorios", variant: "destructive" })
      return
    }
    if (!validateCelular(editingUser.celular)) {
      toast({ title: "Error", description: "Celular inválido (10 dígitos, inicia con 3)", variant: "destructive" })
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          cedula: editingUser.cedula.trim(),
          nombres: editingUser.nombres.trim().toUpperCase(),
          celular: editingUser.celular.trim(),
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setUsers(users.map((u) => (u.id === updated.id ? updated : u)))
        setEditingUser(null)
        setIsEditingUser(false)
        toast({ title: "Usuario actualizado", description: `Vence el ${updated.fechaVencimiento}` })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Error al actualizar", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Eliminar a ${userName}?`)) return
    try {
      const response = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' })
      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId))
        toast({ title: "Usuario eliminado", description: userName })
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Error al eliminar", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    }
  }

  const handleSendWhatsApp = async (user: UserManagementUser) => {
    setSendingNotification(user.id)
    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          celular: user.celular,
          nombres: user.nombres,
          fechaVencimiento: user.fechaVencimiento,
        }),
      })
      const result = await response.json()
      if (result.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, notificado: true, lastNotification: new Date().toISOString().split("T")[0] }
              : u,
          ),
        )
      }
    } catch {
      toast({ title: "Error", description: "Error al abrir WhatsApp", variant: "destructive" })
    } finally {
      setSendingNotification(null)
    }
  }

  const getStatusBadge = (fechaVencimiento: string) => {
    const days = getDaysUntilDue(fechaVencimiento)
    if (days < 0) return <Badge variant="outline" className="text-red-700 border-red-200 bg-red-50">Vencido</Badge>
    if (days <= 7) return <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">Urgente</Badge>
    if (days <= 30) return <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50">Próximo</Badge>
    return <Badge variant="outline" className="text-neutral-600 border-neutral-200">Pendiente</Badge>
  }

  const renderUserFields = (
    user: { cedula: string; nombres: string; celular: string },
    onChange: (u: { cedula: string; nombres: string; celular: string }) => void,
  ) => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cedula" className="text-sm text-neutral-700">Cédula</Label>
        <Input
          id="cedula"
          value={user.cedula}
          onChange={(e) => onChange({ ...user, cedula: e.target.value })}
          placeholder="12345678"
          className="h-10 bg-white border-neutral-200"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="nombres" className="text-sm text-neutral-700">Nombres completos</Label>
        <Input
          id="nombres"
          value={user.nombres}
          onChange={(e) => onChange({ ...user, nombres: e.target.value.toUpperCase() })}
          placeholder="JUAN PÉREZ GARCÍA"
          className="h-10 bg-white border-neutral-200"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="celular" className="text-sm text-neutral-700">Celular</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-sm text-neutral-400">+57</span>
          <Input
            id="celular"
            value={user.celular}
            onChange={(e) => onChange({ ...user, celular: e.target.value })}
            placeholder="3001234567"
            maxLength={10}
            className="h-10 pl-12 bg-white border-neutral-200"
          />
        </div>
        <p className="text-xs text-neutral-400">10 dígitos, comienza con 3</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className="border-neutral-200 bg-white shadow-none rounded-lg">
        <div className="p-5 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="search" className="text-sm text-neutral-700">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="search"
                placeholder="Nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-white border-neutral-200"
              />
            </div>
          </div>

          <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
            <DialogTrigger asChild>
              <Button className="h-10 bg-neutral-900 hover:bg-neutral-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Agregar usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-neutral-900">Agregar usuario</DialogTitle>
              </DialogHeader>
              {renderUserFields(newUser, setNewUser)}
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsAddingUser(false)} className="border-neutral-200">
                  Cancelar
                </Button>
                <Button onClick={handleAddUser} className="bg-neutral-900 hover:bg-neutral-800 text-white">
                  Agregar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
            <DialogContent className="border-neutral-200 rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-neutral-900">Editar usuario</DialogTitle>
              </DialogHeader>
              {editingUser && renderUserFields(editingUser, (u) => setEditingUser({ ...editingUser, ...u }))}
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => { setIsEditingUser(false); setEditingUser(null) }}
                  className="border-neutral-200"
                >
                  <X className="h-4 w-4 mr-2" /> Cancelar
                </Button>
                <Button onClick={handleEditUser} className="bg-neutral-900 hover:bg-neutral-800 text-white">
                  <Save className="h-4 w-4 mr-2" /> Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card className="border-neutral-200 bg-white shadow-none rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-500">
            <div className="animate-spin h-5 w-5 border-2 border-neutral-300 border-t-neutral-700 rounded-full mr-3"></div>
            Cargando usuarios...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Cédula</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Nombre</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Celular</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Vencimiento</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500">Estado</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-neutral-500 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-neutral-500">
                      No hay usuarios que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-neutral-100 hover:bg-neutral-50">
                      <TableCell className="font-mono text-neutral-800">{user.cedula}</TableCell>
                      <TableCell className="font-medium text-neutral-800">{user.nombres}</TableCell>
                      <TableCell className="text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-neutral-400" />
                          +57 {user.celular}
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-800 tabular-nums">{user.fechaVencimiento}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(user.fechaVencimiento)}
                          {user.notificado && user.lastNotification && (
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {user.lastNotification}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end">
                          <WhatsAppButton
                            user={user}
                            onSend={() => handleSendWhatsApp(user)}
                            isLoading={sendingNotification === user.id}
                            disabled={getDaysUntilDue(user.fechaVencimiento) < -30}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setEditingUser(user); setIsEditingUser(true) }}
                            className="h-8 w-8 p-0 text-neutral-600 hover:bg-neutral-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(user.id, user.nombres)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}