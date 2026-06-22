#!/bin/sh
set -e

echo "Inicializando esquema de base de datos (idempotente)..."
node scripts/init-db.js || {
  echo "Aviso: init-db fallo. La app arrancara igualmente."
}

echo "Arrancando Next.js en produccion..."
exec npm start