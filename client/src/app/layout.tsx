import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Global Agent AI ',
  description: 'Una aplicación de agentes AI moderna y eficiente',
}

import Navbar from '../components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-[80vh] max-w-[90v] mx-auto py-24  ">
          {children}
        </main>
      </body>
    </html>
  )
}