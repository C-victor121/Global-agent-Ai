'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiLogOut, FiUser } from 'react-icons/fi';

interface UserMenuProps {
  avatar: string;
  userName: string;
}

export default function UserMenu({ avatar, userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="relative flex items-center" ref={menuRef}>
      <Link href="/usuarios" className="block">
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500 hover:border-blue-400 transition-colors cursor-pointer">
          <Image 
            src={avatar || '/placeholder-avatar.svg'} 
            alt={userName || 'Usuario'}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 text-white hover:text-gray-300 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-lg rounded-lg shadow-lg py-1 border border-white/10 z-50"
          >
            <div className="px-4 py-2 border-b border-white/10">
              <p className="text-sm font-medium text-white truncate">{userName || 'Usuario'}</p>
            </div>

            <Link 
              href="/perfil"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FiUser className="mr-2 h-4 w-4" />
              Mi Perfil
            </Link>

            <Link 
              href="/ajustes"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FiSettings className="mr-2 h-4 w-4" />
              Ajustes
            </Link>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}