# Declaraciones Tributarias Colombia 2025

Sistema minimalista para gestión de recordatorios de declaración de renta a través de WhatsApp personal (sin APIs de pago).

## Características

- Gestión de usuarios (CRUD) con cédula, nombres y celular
- Cálculo automático de fechas según calendario tributario DIAN 2025
- Envío de recordatorios por WhatsApp personal (vía `wa.me`, 100% gratuito)
- Importación masiva desde `.xlsx` / `.csv`
- Estadísticas en tiempo real
- Base de datos PostgreSQL externa (Dokploy u otro proveedor)

## Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Base de datos**: PostgreSQL (mediante `pg`)

## Instalación local

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# Editar .env.local con tu DATABASE_URL
npm run db:setup   # crea tablas + inserta datos de ejemplo
npm run dev
```

## Variables de entorno

| Variable         | Descripción                              | Default                          |
|------------------|------------------------------------------|----------------------------------|
| `DATABASE_URL`    | URL de conexión PostgreSQL                | `postgresql://user:password@host:port/database` |
| `DATABASE_SSL`   | Activa SSL en la conexión (`true`/`false`) | `false`                          |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app               | `http://localhost:3000`          |

## Scripts

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servidor producción
npm run db:init    # crear esquema
npm run db:seed    # insertar datos de ejemplo
npm run db:setup   # init + seed
npm run lint       # eslint
```

## Deploy en Render + Dokploy Postgres

1. **Crear un servidor PostgreSQL en Dokploy** (o cualquier otro proveedor).
2. **Exponer el puerto externamente** en Dokploy (Settings → External Port). Una vez expuesto, la URL queda:
   ```
   postgresql://declaraciones:declaraciones@<IP_PUBLICA_VPS>:<PUERTO_EXTERNO>/declaraciones
   ```
3. **En Render**:
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm start`
   - **Variables de entorno**:
     - `DATABASE_URL` = URL externa del paso 2
     - `DATABASE_SSL` = `false` (o `true` si configuraste TLS en el VPS)
     - `NEXT_PUBLIC_APP_URL` = `https://declaraciones-tributarias.onrender.com`
4. **Inicializar BD** (una sola vez): desde la Shell de Render ejecuta:
   ```bash
   npm run db:setup
   ```

> ⚠️ **Seguridad**: exponer PostgreSQL a internet debe ir acompañado de:
> - Firewall que permita solo la IP de Render
> - Conexión fortalecida (contraseña larga, `pg_hba.conf` restrictivo)
> - Idealmente TLS habilitado (`DATABASE_SSL=true`)

## Calendario Tributario 2025

El sistema calcula las fechas de vencimiento según los últimos 2 dígitos de la cédula (`lib/tax-calendar.ts`):

- Agosto: terminaciones 01–26
- Septiembre: terminaciones 27–66
- Octubre: terminaciones 67–00

Para futuros años, actualiza el mapa en `lib/tax-calendar.ts`.