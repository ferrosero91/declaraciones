# Sistema de Control de Declaraciones Tributarias Colombia 2025

Sistema profesional para gestión de recordatorios de declaración de renta con WhatsApp personal.

## 🚀 Características

- ✅ Gestión completa de usuarios (CRUD)
- 📅 Cálculo automático de fechas según calendario tributario oficial
- 📱 Envío de recordatorios por WhatsApp personal (sin APIs)
- 📊 Estadísticas en tiempo real
- 📋 Importación masiva desde Excel
- 🎨 Interfaz moderna y responsive

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **UI**: Shadcn/ui, Radix UI
- **Base de datos**: PostgreSQL con Docker

## 📦 Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repo>
   cd declaraciones-renta
   ```

2. **Instalar dependencias**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales
   ```

4. **Iniciar PostgreSQL con Docker**
   ```bash
   docker run --name declaraciones_db -e POSTGRES_DB=declaraciones_tributarias -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password123 -p 5434:5432 -d postgres:15
   ```

5. **Inicializar base de datos**
   ```bash
   npm run db:init
   npm run db:seed
   ```

6. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

## 🌐 Deploy en Render

### Paso 1: Preparar el repositorio
1. Subir código a GitHub/GitLab
2. Asegurarse de que `.env.local` esté en `.gitignore`

### Paso 2: Crear base de datos en Render
1. Ir a [Render Dashboard](https://dashboard.render.com)
2. Crear nueva PostgreSQL Database
3. Copiar la URL de conexión interna

### Paso 3: Crear Web Service
1. Conectar repositorio de GitHub
2. Configurar:
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Paso 4: Variables de entorno
Agregar en Render:
```
NODE_ENV=production
DATABASE_URL=postgresql://root:R2GhhcqD3gZujfpZ4FIvO7y6ktslva9n@dpg-d25r8pali9vc73euvhog-a/declaraciones_tributarias
NEXT_PUBLIC_APP_URL=https://tu-app.onrender.com
```

### Paso 5: Deploy
1. Hacer push al repositorio
2. Render automáticamente hará el deploy
3. La base de datos se inicializará automáticamente

## 📋 Uso del Sistema

### Gestión de Usuarios
- **Agregar**: Clic en "Agregar Usuario"
- **Editar**: Clic en el ícono de lápiz
- **Eliminar**: Clic en el ícono de papelera
- **Buscar**: Usar la barra de búsqueda

### Envío de Recordatorios
1. Clic en "Enviar Recordatorio"
2. Se abre WhatsApp con mensaje personalizado
3. Revisar y enviar manualmente
4. El sistema marca como "enviado"

### Importación Excel
1. Ir a pestaña "Importar Excel"
2. Subir archivo con columnas: Cédula, Nombres, Celular
3. Revisar vista previa
4. Confirmar importación

## 🗓️ Calendario Tributario 2025

El sistema calcula automáticamente las fechas de vencimiento según los últimos 2 dígitos de la cédula:

- **Agosto**: 01-02 → 12/8, 03-04 → 13/8, etc.
- **Septiembre**: 27-28 → 1/9, 29-30 → 2/9, etc.
- **Octubre**: 67-68 → 1/10, 69-70 → 2/10, etc.

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Iniciar producción
npm run db:init      # Crear tablas
npm run db:seed      # Insertar datos
npm run db:setup     # Init + seed
```

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al desarrollador.

---

**Desarrollado para la gestión profesional de declaraciones tributarias en Colombia 2025**