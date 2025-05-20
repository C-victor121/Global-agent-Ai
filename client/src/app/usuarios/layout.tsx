import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Redirigir a la página de inicio si no hay sesión
  if (!session) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Usuario</h1>
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/20">
        {children}
      </div>
    </div>
  );
}