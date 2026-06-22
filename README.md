# Declaraciones Tributarias Colombia 2025

Sistema minimalista para gestión de recordatorios de declaración de renta a través de WhatsApp personal (sin APIs de pago).

## Características

- Gestión de usuarios (CRUD) con cédula, nombres y celular
- Cálculo automático de fechas según calendario tributario DIAN 2025
- Envío de recordatorios por WhatsApp personal (vía `wa.me`, 100% gratuito)
- Importación masiva desde `.xlsx` / `.csv`
- Estadísticas en tiempo real
- Base de datos PostgreSQL (Dokploy u otro proveedor)

## Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Base de datos**: PostgreSQL
- **Despliegue**: Dokploy + Docker Compose

## Instalación local

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# Editar .env.local con tu DATABASE_URL
npm run db:setup   # crea tablas + inserta datos de ejemplo
npm run dev
```

## Variables de entorno

| Variable         | Descripción                              | Ejemplo                                   |
|------------------|------------------------------------------|-------------------------------------------|
| `DATABASE_URL`    | URL de conexión PostgreSQL (obligatoria) | `postgresql://declaraciones:declaraciones@dbrender-declaraciones-ofbykv:5432/declaraciones` |
| `DATABASE_SSL`   | Activa SSL en la conexión                | `false`                                   |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app               | `https://declaraciones.tudominio.com`     |
| `PORT`           | Puerto expuesto por el contenedor        | `3000`                                    |

## Despliegue en Dokploy

### 1. Crear base de datos PostgreSQL en Dokploy

Ya creada según tus credenciales:
- **Host interno**: `dbrender-declaraciones-ofbykv`
- **Puerto interno**: `5432`
- **DB / User / Password**: `declaraciones`

### 2. Crear aplicación en Dokploy

- Tipo: **Docker Compose**
- Source: tu repositorio Git (rama `main`)
- Dokploy detecta automáticamente `docker-compose.yml` y `Dockerfile` en la raíz

### 3. Variables de entorno (Environment)

Configurar en Dokploy → Application → Environment:

```
DATABASE_URL=postgresql://declaraciones:declaraciones@dbrender-declaraciones-ofbykv:5432/declaraciones
DATABASE_SSL=false
NEXT_PUBLIC_APP_URL=https://declaraciones.tudominio.com
NODE_ENV=production
PORT=3000
```

### 4. Configurar dominio

- Dokploy → Application → Domains → agregar tu dominio o subdominio generado
- Target Port: `3000`

### 5. Desplegar

- Click en **Deploy**
- En el primer arranque, el contenedor ejecuta `node scripts/init-db.js` automáticamente (idempotente), creando las tablas necesarias

### 6. (Opcional) Cargar datos de ejemplo

Vía Dokploy → Application → Terminal:

```bash
node scripts/seed-data.js
```

## Red Docker

El `docker-compose.yml` incluye `networks: dokploy-network (external: true)`. Esta red la crea Dokploy automáticamente y comparte entre apps y bases de datos. Si el nombre difiere en tu instancia, edítalo en el compose.

## Scripts

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servidor producción
npm run db:init    # crear esquema (idempotente)
npm run db:seed    # insertar datos de ejemplo
npm run db:setup   # init + seed
npm run lint       # eslint
```

## Calendario Tributario 2025

El sistema calcula las fechas de vencimiento según los últimos 2 dígitos de la cédula (`lib/tax-calendar.ts`):

- Agosto: terminaciones 01–26
- Septiembre: terminaciones 27–66
- Octubre: terminaciones 67–00

Para futuros años, actualiza el mapa en `lib/tax-calendar.ts`.