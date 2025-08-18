'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // Importar Image
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';
import { useSession } from 'next-auth/react';
import logoSrc from '../images/Logo.png'; // Importar el logo
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const menuItems = [
    { title: 'Inicio', href: '/' },
    { title: 'Planes', href: '/planes' }, // Nuevo enlace a Planes
    { title: 'Servicios', href: '/servicios' },
    { title: '¿Cómo Funciona?', href: '/como-funciona' },
    { title: 'Contacto', href: '/contacto' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center text-xl font-bold">
            <Image src={logoSrc} alt="Global Agent AI Logo" width={80} height={80} className="" />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">Global Agent AI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.title}
              </Link>
            ))}
            {session ? (
              <UserMenu 
                avatar={session.user?.image || '/placeholder-avatar.svg'} 
                userName={session.user?.name || 'Usuario'} 
              />
            ) : (
              <button 
                onClick={() => router.push('/auth/signin')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                Comenzar
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/50 backdrop-blur-lg border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-4 space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              {session ? (
                <div className="py-2 px-4">
                  <UserMenu 
                    avatar={session.user?.image || '/placeholder-avatar.svg'} 
                    userName={session.user?.name || 'Usuario'} 
                  />
                </div>
              ) : (
                <button 
                  onClick={() => {
                    router.push('/auth/signin');
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Comenzar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
}