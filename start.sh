#!/bin/sh
set -e

echo "Inicializando esquema de base de datos (idempotente)..."
node scripts/init-db.js || {
  echo "Aviso: init-db fallo (probablemente DATABASE_URL no lista todavia)."
  echo "La app arrancara igual; reintentara en el proximo inicio."
}

echo "Arrancando Next.js en produccion..."
exec npm start