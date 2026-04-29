'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleStart = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in">
          ¡Bienvenido a HealthyIA!
        </h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <p className="text-xl text-gray-700 leading-relaxed">
            HealthyIA es tu asistente personal de nutrición impulsado por inteligencia artificial. 
            Diseñamos planes alimenticios personalizados basados en tus objetivos, 
            preferencias y necesidades específicas. ¡Empieza hoy tu transformación!
          </p>
        </div>
        
        <button
          onClick={handleStart}
          className="bg-linear-to-r from-green-500 to-blue-500 text-white text-xl font-semibold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-bounce-slow"
        >
          ¡Empecemos!
        </button>
      </div>
    </div>
  );
}