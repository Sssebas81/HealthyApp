'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ChatIA from '@/components/ChatIA';
import type { PlanNutricional } from '@/types';

export default function PlanDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { planes, user } = useApp();
  const [plan, setPlan] = useState<PlanNutricional | null>(null);
  const [mostrarChat, setMostrarChat] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const planEncontrado = planes.find(p => p.id === parseInt(id as string));
    if (planEncontrado) {
      setPlan(planEncontrado);
    } else {
      router.push('/dashboard');
    }
  }, [id, planes, router]);

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (mostrarChat) {
    return (
      <ChatIA 
        plan={plan}
        user={user}
        onBack={() => setMostrarChat(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón para volver */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
        >
          ← Volver al dashboard
        </button>

        {/* Header del plan */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {plan.objetivo === 'perder_peso' && '🏃‍♂️ Plan para Perder Peso'}
                {plan.objetivo === 'masa_muscular' && '💪 Plan para Ganar Masa Muscular'}
                {plan.objetivo === 'recomposicion' && '🔄 Plan de Recomposición Corporal'}
              </h1>
              <p className="text-gray-500">
                Creado: {new Date(plan.fechaCreacion).toLocaleDateString()} - {plan.caloriasDiarias} kcal/día
              </p>
            </div>
            <button
              onClick={() => setMostrarChat(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 flex items-center gap-2"
            >
              <span>💬</span>
              Consultar con HealthyIA
            </button>
          </div>
        </div>

        {/* Plan detallado */}
        <div className="grid gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🍳 Desayuno</h2>
            <p className="text-gray-700 leading-relaxed">{plan.desayuno}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🥗 Almuerzo</h2>
            <p className="text-gray-700 leading-relaxed">{plan.almuerzo}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🍽️ Cena</h2>
            <p className="text-gray-700 leading-relaxed">{plan.cena}</p>
          </div>

          {plan.snacks && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🍎 Snacks</h2>
              <p className="text-gray-700 leading-relaxed">{plan.snacks}</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Recomendaciones</h2>
            <p className="text-gray-700 leading-relaxed">{plan.recomendaciones}</p>
          </div>
        </div>

        {/* Footer con preguntas sugeridas */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold text-gray-700 mb-3">📌 Preguntas que puedes hacerle a HealthyIA:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => setMostrarChat(true)}
              className="text-left text-green-600 hover:text-green-700 text-sm p-2 hover:bg-green-50 rounded-lg transition"
            >
              • ¿Puedo reemplazar algún alimento de mi plan?
            </button>
            <button
              onClick={() => setMostrarChat(true)}
              className="text-left text-green-600 hover:text-green-700 text-sm p-2 hover:bg-green-50 rounded-lg transition"
            >
              • ¿Qué puedo comer si soy vegano/vegetariano?
            </button>
            <button
              onClick={() => setMostrarChat(true)}
              className="text-left text-green-600 hover:text-green-700 text-sm p-2 hover:bg-green-50 rounded-lg transition"
            >
              • ¿Cómo ajusto las porciones para mi actividad física?
            </button>
            <button
              onClick={() => setMostrarChat(true)}
              className="text-left text-green-600 hover:text-green-700 text-sm p-2 hover:bg-green-50 rounded-lg transition"
            >
              • ¿Qué snacks saludables puedo comer entre comidas?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}