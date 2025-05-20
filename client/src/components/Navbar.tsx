import Link from 'next/link';


const Navbar = () => {
  return (
    <nav className="absolute w-full bg-white text-primary shadow-md py-4 px-6 flex justify-between items-center ">
      <div className="text-2xl font-bold text-blue-600">Global Agente IA</div>
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className="hover:text-blue-500 transition-colors">Inicio</Link>
        </li>
        <li>
          <Link href="/servicios" className="hover:text-blue-500 transition-colors">Servicios</Link>
        </li>
        <li>
          <Link href="/testimonios" className="hover:text-blue-500 transition-colors">Testimonios</Link>
        </li>
        <li>
          <Link href="/contacto" className="hover:text-blue-500 transition-colors">Contacto</Link>
        </li>
        <li>
          <Link href="/planes" className="hover:text-blue-500 transition-colors">Planes</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;