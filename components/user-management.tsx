"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Search, Phone, UserIcon, CheckCircle2, Smartphone, Edit, Trash2, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { calculateDueDate } from "@/lib/tax-calendar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getDaysUntilDue, getUrgencyLevel } from "@/lib/date-utils"

interface UserManagementUser {
  id: string
  cedula: string
  nombres: string
  celular: string
  fechaVencimiento: string
  notificado: boolean
  lastNotification?: string
}

export function UserManagement() {
  const [users, setUsers] = useState<UserManagementUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newUser, setNewUser] = useState({
    cedula: "",
    nombres: "",
    celular: "",
  })
  const [editingUser, setEditingUser] = useState<UserManagementUser | null>(null)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [sendingNotification, setSendingNotification] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuarios desde la API
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "❌ Error",
        description: "Error al cargar usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filtrar usuarios
  const filteredUsers = users.filter(
    (user) => user.nombres.toLowerCase().includes(searchTerm.toLowerCase()) || user.cedula.includes(searchTerm),
  )

  // Agregar nuevo usuario
  const handleAddUser = async () => {
    if (!newUser.cedula || !newUser.nombres || !newUser.celular) {
      toast({
        title: "❌ Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    // Validar formato de celular colombiano
    if (!/^3\d{9}$/.test(newUser.celular)) {
      toast({
        title: "❌ Error",
        description: "El celular debe tener 10 dígitos y comenzar con 3",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedula: newUser.cedula.trim(),
          nombres: newUser.nombres.trim().toUpperCase(),
          celular: newUser.celular.trim()
        })
      })

      if (response.ok) {
        const newUserData = await response.json()
        setUsers([...users, newUserData])
        setNewUser({ cedula: "", nombres: "", celular: "" })
        setIsAddingUser(false)
        
        toast({
          title: "✅ Usuario agregado exitosamente",
          description: `Fecha de vencimiento: ${newUserData.fechaVencimiento}`,
        })
        
        // Recargar usuarios para mantener el orden
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "❌ Error",
          description: error.error || "Error al agregar usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    }
  }

  // Editar usuario
  const handleEditUser = async () => {
    if (!editingUser || !editingUser.cedula || !editingUser.nombres || !editingUser.celular) {
      toast({
        title: "❌ Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    // Validar formato de celular colombiano
    if (!/^3\d{9}$/.test(editingUser.celular)) {
      toast({
        title: "❌ Error",
        description: "El celular debe tener 10 dígitos y comenzar con 3",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingUser.id,
          cedula: editingUser.cedula.trim(),
          nombres: editingUser.nombres.trim().toUpperCase(),
          celular: editingUser.celular.trim()
        })
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
        setEditingUser(null)
        setIsEditingUser(false)
        
        toast({
          title: "✅ Usuario actualizado exitosamente",
          description: `Nueva fecha de vencimiento: ${updatedUser.fechaVencimiento}`,
        })
        
        // Recargar usuarios para mantener el orden
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "❌ Error",
          description: error.error || "Error al actualizar usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    }
  }

  // Eliminar usuario
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${userName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId))
        
        toast({
          title: "✅ Usuario eliminado",
          description: `${userName} ha sido eliminado exitosamente`,
        })
      } else {
        const error = await response.json()
        toast({
          title: "❌ Error",
          description: error.error || "Error al eliminar usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    }
  }

  // Enviar WhatsApp
  const handleSendWhatsApp = async (user: UserManagementUser) => {
    setSendingNotification(user.id)

    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          celular: user.celular,
          nombres: user.nombres,
          fechaVencimiento: user.fechaVencimiento,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Actualizar el estado local
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, notificado: true, lastNotification: new Date().toISOString().split("T")[0] } : u,
          ),
        )
        
        toast({
          title: "✅ Recordatorio enviado",
          description: "WhatsApp abierto exitosamente",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "❌ Error",
        description: "Error al abrir WhatsApp",
        variant: "destructive",
      })
    } finally {
      setSendingNotification(null)
    }
  }

  const getStatusBadge = (fechaVencimiento: string, notificado: boolean) => {
    const days = getDaysUntilDue(fechaVencimiento)

    if (days < 0) {
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">🚨 Vencido</Badge>
      )
    } else if (days <= 7) {
      return (
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse">
          ⚡ Urgente
        </Badge>
      )
    } else if (days <= 30) {
      return (
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
          ⏰ Próximo
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
          📅 Pendiente
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-8">
      {/* Información del sistema sin APIs */}
      <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <Smartphone className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Sistema profesional:</strong> Al hacer clic en "Enviar Recordatorio", se abrirá WhatsApp con un
          mensaje profesional personalizado. Solo tienes que presionar enviar. ¡100% gratuito!
        </AlertDescription>
      </Alert>

      {/* Search and Add User Card */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <CardTitle className="flex items-center gap-3 text-white text-2xl">
            <div className="p-2 bg-white/20 rounded-xl">
              <UserIcon className="h-6 w-6" />
            </div>
            Control de Declaraciones Tributarias
          </CardTitle>
          <CardDescription className="text-blue-100 mt-2">
            Gestión profesional de recordatorios de declaración de renta
          </CardDescription>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-semibold text-gray-700">
                Buscar usuario
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white/80 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                <DialogTrigger asChild>
                  <Button className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Agregar Nuevo Usuario
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Ingresa los datos del usuario. La fecha de vencimiento se calculará automáticamente.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cedula" className="text-sm font-semibold text-gray-700">
                        Cédula
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="cedula"
                          value={newUser.cedula}
                          onChange={(e) => setNewUser({ ...newUser, cedula: e.target.value })}
                          placeholder="Ej: 12345678"
                          className="pl-12 h-12 rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nombres" className="text-sm font-semibold text-gray-700">
                        Nombres Completos
                      </Label>
                      <Input
                        id="nombres"
                        value={newUser.nombres}
                        onChange={(e) => setNewUser({ ...newUser, nombres: e.target.value.toUpperCase() })}
                        placeholder="Ej: JUAN PÉREZ GARCÍA"
                        className="h-12 rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="celular" className="text-sm font-semibold text-gray-700">
                        Celular
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <div className="absolute left-12 top-3.5 text-gray-500 text-sm">+57</div>
                        <Input
                          id="celular"
                          value={newUser.celular}
                          onChange={(e) => setNewUser({ ...newUser, celular: e.target.value })}
                          placeholder="3001234567"
                          className="pl-20 h-12 rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                          maxLength={10}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Formato: 10 dígitos comenzando con 3</p>
                    </div>
                  </div>

                  <DialogFooter className="gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingUser(false)}
                      className="rounded-2xl border-gray-200 hover:bg-gray-50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl shadow-lg"
                    >
                      Agregar Usuario
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Diálogo de Edición */}
              <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
                <DialogContent className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Editar Usuario
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Modifica los datos del usuario. La fecha de vencimiento se recalculará automáticamente.
                    </DialogDescription>
                  </DialogHeader>

                  {editingUser && (
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-cedula" className="text-sm font-semibold text-gray-700">
                          Cédula
                        </Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <Input
                            id="edit-cedula"
                            value={editingUser.cedula}
                            onChange={(e) => setEditingUser({ ...editingUser, cedula: e.target.value })}
                            placeholder="Ej: 12345678"
                            className="pl-12 h-12 rounded-2xl border-gray-200 focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-nombres" className="text-sm font-semibold text-gray-700">
                          Nombres Completos
                        </Label>
                        <Input
                          id="edit-nombres"
                          value={editingUser.nombres}
                          onChange={(e) => setEditingUser({ ...editingUser, nombres: e.target.value.toUpperCase() })}
                          placeholder="Ej: JUAN PÉREZ GARCÍA"
                          className="h-12 rounded-2xl border-gray-200 focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-celular" className="text-sm font-semibold text-gray-700">
                          Celular
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <div className="absolute left-12 top-3.5 text-gray-500 text-sm">+57</div>
                          <Input
                            id="edit-celular"
                            value={editingUser.celular}
                            onChange={(e) => setEditingUser({ ...editingUser, celular: e.target.value })}
                            placeholder="3001234567"
                            className="pl-20 h-12 rounded-2xl border-gray-200 focus:ring-2 focus:ring-orange-500"
                            maxLength={10}
                          />
                        </div>
                        <p className="text-xs text-gray-500">Formato: 10 dígitos comenzando con 3</p>
                      </div>
                    </div>
                  )}

                  <DialogFooter className="gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingUser(false)
                        setEditingUser(null)
                      }}
                      className="rounded-2xl border-gray-200 hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleEditUser}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 rounded-2xl shadow-lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800">Lista de Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Cargando usuarios...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                    <TableHead className="font-semibold text-gray-700 py-4">Cédula</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nombres</TableHead>
                    <TableHead className="font-semibold text-gray-700">Celular</TableHead>
                    <TableHead className="font-semibold text-gray-700">Fecha Vencimiento</TableHead>
                    <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                    <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border-b border-gray-50"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    <TableCell className="font-mono font-semibold text-gray-800 py-4">{user.cedula}</TableCell>
                    <TableCell className="font-medium text-gray-700">{user.nombres}</TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        +57 {user.celular}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        {user.fechaVencimiento}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(user.fechaVencimiento, user.notificado)}
                        {user.notificado && user.lastNotification && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            Recordatorio enviado {user.lastNotification}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <WhatsAppButton
                          user={user}
                          onSend={() => handleSendWhatsApp(user)}
                          isLoading={sendingNotification === user.id}
                          disabled={getDaysUntilDue(user.fechaVencimiento) < -30}
                        />
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(user)
                            setIsEditingUser(true)
                          }}
                          className="h-8 w-8 p-0 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                          title="Editar usuario"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id, user.nombres)}
                          className="h-8 w-8 p-0 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
