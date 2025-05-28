import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaCog, FaClipboardList, FaSignOutAlt, FaUsers } from 'react-icons/fa';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirigir a la página de inicio si no hay sesión
  if (!session) {
    redirect('/');
  }

  const userRole = session.user.role;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black backdrop-blur-xl border-r border-white/10 p-6">
        <h1 className="text-2xl font-bold mb-8">Panel de Usuario</h1>
        <nav className="space-y-4">
          <Link href="/usuarios" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <FaUser className="w-5 h-5" />
            <span>Perfil</span>
          </Link>
          <Link href="/usuarios/tareas" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <FaClipboardList className="w-5 h-5" />
            <span>Tareas</span>
          </Link>
          <Link href="/usuarios/configuracion" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <FaCog className="w-5 h-5" />
            <span>Configuración</span>
          </Link>

          {/* Enlace de Gestión de Usuarios para Admin */}
          {userRole === 'admin' && (
            <Link href="/usuarios/gestion" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
              <FaUsers className="w-5 h-5" />
              <span>Gestión de Usuarios</span>
            </Link>
          )}
        </nav>

        {/* User Role Display */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg">
            <FaUser className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-sm font-medium text-gray-300">{userRole}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/20">
          {children}
        </div>
      </div>
    </div>
  );
}