'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import Perfil from './Perfil';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const { user, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname, user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              HealthyIA
            </Link>
            
            <div className="flex space-x-4 items-center">
              {!isLoggedIn ? (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-green-600 transition">
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="bg-linear-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                    Registrarse
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setMostrarPerfil(true)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition"
                  >
                    <span>👤</span>
                    <span>{user?.name?.split(' ')[0]}</span>
                  </button>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition">
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Perfil */}
      {mostrarPerfil && (
        <Perfil onClose={() => setMostrarPerfil(false)} />
      )}
    </>
  );
}