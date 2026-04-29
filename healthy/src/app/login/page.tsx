'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@/types';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Verificar si ya está logueado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Obtener usuarios del localStorage
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Buscar usuario por email y password
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (user) {
        // Guardar token y usuario
        localStorage.setItem('token', 'fake-jwt-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirigir al dashboard
        router.push('/dashboard');
      } else {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-500 mt-2">Bienvenido de vuelta a HealthyIA</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="tu@email.com"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </span>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold transition">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Demo credentials - útil para pruebas */}
        <div className="mt-8 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500 text-center mb-1">📝 Credenciales de prueba:</p>
          <p className="text-xs text-gray-400 text-center">
            Email: <span className="font-mono">test@test.com</span> / Contraseña: <span className="font-mono">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
}