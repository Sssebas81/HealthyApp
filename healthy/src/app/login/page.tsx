'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@/types';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Obtener usuarios del localStorage
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Usuarios registrados:', users);
      
      // Buscar usuario por email y password
      const user = users.find((u: User) => u.email === email && u.password === password);
      console.log('Usuario encontrado:', user);
      
      if (user) {
        // Guardar token y usuario
        localStorage.setItem('token', 'fake-jwt-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(user));
        
        // También guardar en sessionStorage para respaldo
        sessionStorage.setItem('token', 'fake-jwt-token-' + Date.now());
        sessionStorage.setItem('user', JSON.stringify(user));
        
        console.log('Usuario guardado en localStorage:', user);
        console.log('Token guardado:', localStorage.getItem('token'));
        
        // Pequeño delay para asegurar que se guardó
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Iniciar Sesión</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}