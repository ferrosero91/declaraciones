import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'Declaraciones Tributarias Colombia 2025',
  description: 'Gestión de recordatorios de declaración de renta',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}