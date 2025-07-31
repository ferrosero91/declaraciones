import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/user-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let users
    if (search) {
      users = await UserService.searchUsers(search)
    } else {
      users = await UserService.getAllUsers()
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error en GET /api/users:', error)
    return NextResponse.json(
      { error: "Error al obtener usuarios" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cedula, nombres, celular, bulk } = body

    // Validaciones básicas
    if (!cedula || !nombres || !celular) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" }, 
        { status: 400 }
      )
    }

    // Validar formato de celular colombiano
    if (!/^3\d{9}$/.test(celular)) {
      return NextResponse.json(
        { error: "El celular debe tener 10 dígitos y comenzar con 3" }, 
        { status: 400 }
      )
    }

    // Si es importación masiva
    if (bulk && Array.isArray(body.users)) {
      const result = await UserService.createMultipleUsers(body.users)
      return NextResponse.json(result, { status: 201 })
    }

    // Crear usuario individual
    const newUser = await UserService.createUser({
      cedula: cedula.trim(),
      nombres: nombres.trim().toUpperCase(),
      celular: celular.trim()
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/users:', error)
    
    if (error instanceof Error && error.message.includes('Ya existe')) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, cedula, nombres, celular } = body

    // Validaciones básicas
    if (!id || !cedula || !nombres || !celular) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" }, 
        { status: 400 }
      )
    }

    // Validar formato de celular colombiano
    if (!/^3\d{9}$/.test(celular)) {
      return NextResponse.json(
        { error: "El celular debe tener 10 dígitos y comenzar con 3" }, 
        { status: 400 }
      )
    }

    // Actualizar usuario
    const updatedUser = await UserService.updateUser(id, {
      cedula: cedula.trim(),
      nombres: nombres.trim().toUpperCase(),
      celular: celular.trim()
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error en PUT /api/users:', error)
    
    if (error instanceof Error && error.message.includes('Ya existe')) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 409 }
      )
    }

    if (error instanceof Error && error.message.includes('no encontrado')) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "ID de usuario requerido" }, 
        { status: 400 }
      )
    }

    await UserService.deleteUser(id)

    return NextResponse.json({ message: "Usuario eliminado exitosamente" })
  } catch (error) {
    console.error('Error en DELETE /api/users:', error)
    
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}
