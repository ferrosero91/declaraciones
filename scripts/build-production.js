#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Iniciando build de producción...');

try {
  // Instalar dependencias
  console.log('📦 Instalando dependencias...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  // Build de Next.js
  console.log('🔨 Construyendo aplicación...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Configurar base de datos
  console.log('🗄️ Configurando base de datos...');
  execSync('npm run setup:production', { stdio: 'inherit' });
  
  console.log('✅ Build completado exitosamente!');
} catch (error) {
  console.error('❌ Error en el build:', error.message);
  process.exit(1);
}