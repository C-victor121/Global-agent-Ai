import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from "../providers/AuthProvider"
import type { Session } from "next-auth"

const inter = Inter({ subsets: ['latin'] })

import icon from '../images/Logo.png';

export const metadata = {
  title: 'Global Agent AI ',
  description: 'Una aplicación de agentes AI moderna y eficiente',
  icons: {
    icon: icon.src,
  },
}

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
      <AuthProvider session={session}>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
      </AuthProvider>
      </body>
    </html>
  )
}