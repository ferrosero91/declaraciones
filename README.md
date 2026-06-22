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

| Variable         | Descripción                              | Default                                  |
|------------------|------------------------------------------|------------------------------------------|
| `POSTGRES_DB`     | Nombre de la base de datos (auto-creada) | `declaraciones`                          |
| `POSTGRES_USER`   | Usuario PostgreSQL                       | `declaraciones`                          |
| `POSTGRES_PASSWORD` | Contraseña PostgreSQL                  | `declaraciones`                          |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app               | `https://declaraciones.tudominio.com`   |
| `PORT`           | Puerto expuesto por el contenedor app    | `3000`                                   |

> `DATABASE_URL` se construye automáticamente a partir de `POSTGRES_*` en el `docker-compose.yml`. No necesitas configurarla manualmente.

## Despliegue en Dokploy

### 1. Crear aplicación en Dokploy

- **Type**: Docker Compose
- **Source**: repo `ferrosero91/declaraciones` rama `main`
- Dokploy detecta `docker-compose.yml` y `Dockerfile` automáticamente

### 2. Variables de entorno (Application → Environment)

```
POSTGRES_DB=declaraciones
POSTGRES_USER=declaraciones
POSTGRES_PASSWORD=declaraciones
NEXT_PUBLIC_APP_URL=https://declaraciones.tudominio.com
PORT=3000
```

> Cambia `POSTGRES_PASSWORD` por una contraseña segura en producción.

### 3. Configurar dominio (Application → Domains)

- Agregar dominio o subdominio
- **Target Port**: `3000`
- Dokploy genera proxy Traefik + Let's Encrypt automáticamente

### 4. Deploy

Click **Deploy**. En el primer arranque:
1. `postgres:15-alpine` arranca con el volumen `postgres_data` (persistente)
2. El healthcheck de Postgres espera a que esté listo (`pg_isready`)
3. Una vez healthy, arranca el contenedor `app`
4. `start.sh` ejecuta `node scripts/init-db.js` (idempotente, crea las tablas `users`)
5. Finalmente arranca `npm start`

### 5. (Opcional) Cargar datos de ejemplo

**Application → Terminal**:
```bash
node scripts/seed-data.js
```

## Notas técnicas

- **Volumen `postgres_data`**: Dokploy/ Docker mantiene los datos entre reinicios y deploys del app. Solo se pierde si eliminas el volumen manualmente.
- **Redes**: red `internal` (bridge) entre app y db; red `dokploy-network` (external) para que Traefik pueda enrutar el tráfico al contenedor app.
- **No exponer Postgres a Internet**: el servicio `db` no tiene mapeo de puerto, solo es accesible dentro de la red `internal`. Más seguro.
- **Inicialización automática**: `start.sh` hace `init-db` en cada arranque (idempotente) — no requiere pasos manuales.

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