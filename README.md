# Declaraciones Tributarias Colombia 2025

Sistema minimalista para gestión de recordatorios de declaración de renta a través de WhatsApp personal (sin APIs de pago).

## Características

- Gestión de usuarios (CRUD) con cédula, nombres y celular
- Cálculo automático de fechas según calendario tributario DIAN 2025
- Envío de recordatorios por WhatsApp personal (vía `wa.me`, 100% gratuito)
- Importación masiva desde `.xlsx` / `.csv`
- Estadísticas en tiempo real
- Almacenamiento en SQLite (sin servicios externos)

## Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Base de datos**: SQLite (better-sqlite3) — archivo único, sin servidor

## Instalación local

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
npm run db:setup   # crea data/declaraciones.db + datos de ejemplo
npm run dev
```

La base de datos se crea automáticamente en `./data/declaraciones.db` al primer arranque.

## Variables de entorno

| Variable         | Descripción                              | Default                          |
|------------------|------------------------------------------|----------------------------------|
| `DATABASE_PATH`  | Ruta del archivo SQLite                  | `./data/declaraciones.db`       |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app               | `http://localhost:3000`          |

## Scripts

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servidor producción
npm run db:init    # crear tablas (auto al primer arranque)
npm run db:seed    # insertar datos de ejemplo
npm run db:setup   # init + seed
npm run lint       # eslint
```

## Deploy en Render

SQLite requiere almacenamiento persistente. Configura un **Disk** en el servicio web:

1. Crear Web Service conectando el repo
2. Build Command: `npm install --legacy-peer-deps && npm run build`
3. Start Command: `npm start`
4. Agregar Disk (montado en `/opt/render/data`, mínimo 1 GB)
5. Variable de entorno:
   - `DATABASE_PATH=/opt/render/data/declaraciones.db`

> **Nota**: El plan `free` de Render no permite Disks persistentes — los datos se reinician entre deploys. Considera un plan de pago o usa Docker/volumen externo.

El `render.yaml` ya incluye la configuración del disk.

## Calendario Tributario 2025

El sistema calcula las fechas de vencimiento según los últimos 2 dígitos de la cédula (definido en `lib/tax-calendar.ts`):

- Agosto: terminaciones 01–26
- Septiembre: terminaciones 27–66
- Octubre: terminaciones 67–00

Para futuros años, actualiza el mapa en `lib/tax-calendar.ts`.