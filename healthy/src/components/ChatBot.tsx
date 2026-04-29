'use client';
import { useState, useEffect } from 'react';
import type { Preferencias, Mensaje, PlanAlimenticio } from '@/types';

interface ChatBotProps {
  objetivo: string;
  preferencias: Preferencias;
}

export default function ChatBot({ objetivo, preferencias }: ChatBotProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    generarPlanAlimenticio();
  }, []);

  const generarPlanAlimenticio = () => {
    setTimeout(() => {
      const peso = localStorage.getItem('peso');
      const altura = localStorage.getItem('altura');
      const imc = localStorage.getItem('imc');
      
      let caloriasBase = 2000;
      let plan: PlanAlimenticio = {
        desayuno: '',
        almuerzo: '',
        cena: ''
      };
      
      if (objetivo === 'perder_peso') {
        caloriasBase = 1800;
        plan = {
          desayuno: "3 claras de huevo revueltas + 1 rebanada de pan integral + 1/2 aguacate (350 kcal)",
          almuerzo: "150g pechuga de pollo a la plancha + 100g quinoa + ensalada verde (500 kcal)",
          cena: "200g pescado blanco + verduras al vapor + 1 cucharada de aceite de oliva (450 kcal)"
        };
      } else if (objetivo === 'masa_muscular') {
        caloriasBase = 2500;
        plan = {
          desayuno: "4 claras + 2 huevos enteros + 50g avena + 1 banana (600 kcal)",
          almuerzo: "200g carne magra + 200g arroz integral + 100g brócoli (700 kcal)",
          cena: "150g salmón + 300g batata + espinacas (650 kcal)"
        };
      } else {
        caloriasBase = 2200;
        plan = {
          desayuno: "Yogur griego + 40g granola + frutos rojos (450 kcal)",
          almuerzo: "150g pavo + quinoa + vegetales mixtos (550 kcal)",
          cena: "Tofu salteado con vegetales + 100g arroz integral (500 kcal)"
        };
      }

      const preferenciasActivas = Object.keys(preferencias).filter(k => preferencias[k as keyof Preferencias]).join(', ') || 'Ninguna específica';
      
      const mensajeIA: Mensaje = {
        tipo: 'ia',
        contenido: `
          🎯 **Plan Personalizado HealthyIA**
          
          Basado en tus datos:
          - Peso: ${peso}kg | Altura: ${altura}cm | IMC: ${imc}
          - Objetivo: ${objetivo}
          - Preferencias activas: ${preferenciasActivas}
          
          📊 **Calorías diarias recomendadas: ${caloriasBase} kcal**
          
          🍳 **Desayuno** (${Math.round(caloriasBase*0.25)} kcal):
          ${plan.desayuno}
          
          🥗 **Almuerzo** (${Math.round(caloriasBase*0.35)} kcal):
          ${plan.almuerzo}
          
          🍽️ **Cena** (${Math.round(caloriasBase*0.3)} kcal):
          ${plan.cena}
          
          💧 **Recomendaciones adicionales:**
          - Bebe 2-3 litros de agua al día
          - Realiza 4-5 comidas al día para mantener el metabolismo activo
          - Ajusta las porciones según tu hambre y nivel de actividad física
          
          ¿Te gustaría que ajuste alguna parte del plan?
        `
      };
      
      setMensajes([mensajeIA]);
      setCargando(false);
    }, 1500);
  };

  const enviarMensaje = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
    const mensaje = input.value.trim();
    
    if (!mensaje) return;
    
    setMensajes(prev => [...prev, { tipo: 'usuario', contenido: mensaje }]);
    input.value = '';
    
    setTimeout(() => {
      setMensajes(prev => [...prev, { 
        tipo: 'ia', 
        contenido: "Gracias por tu consulta. ¿Te gustaría que modifique las porciones, cambie algún alimento o te dé más opciones para tus comidas?" 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-green-50 to-blue-50">
      <div className="bg-white shadow-md p-4">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="text-green-600 hover:text-green-700 font-semibold"
        >
          ← Volver al dashboard
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        {cargando ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generando tu plan personalizado...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {mensajes.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-lg p-4 ${
                    msg.tipo === 'usuario'
                      ? 'bg-green-500 text-white'
                      : 'bg-white shadow-md text-gray-800'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {msg.contenido.split('\n').map((line: string, i: number) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={enviarMensaje} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Pregúntale a HealthyIA..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-linear-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}