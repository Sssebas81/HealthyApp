'use client';
import { useState, useRef, useEffect } from 'react';
import type { PlanNutricional, User, Mensaje } from '@/types';

interface ChatIAProps {
  plan: PlanNutricional;
  user: User | null;
  onBack: () => void;
}

export default function ChatIA({ plan, user, onBack }: ChatIAProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      tipo: 'ia',
      contenido: `¡Hola ${user?.name || 'usuario'}! Soy HealthyIA, tu asistente nutricional. 🌱\n\nPuedo ayudarte con:\n• Modificaciones a tu plan alimenticio\n• Reemplazos de alimentos\n• Dudas sobre porciones\n• Recomendaciones para tu objetivo\n\n¿En qué puedo ayudarte hoy?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [contextoIA, setContextoIA] = useState({
    objetivo: plan.objetivo,
    calorias: plan.caloriasDiarias,
    alimentosPlan: `${plan.desayuno} ${plan.almuerzo} ${plan.cena}`,
    preferencias: plan.preferenciasUsadas
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!input.trim() || cargando) return;

    const mensajeUsuario = input.trim();
    setInput('');
    
    // Agregar mensaje del usuario
    setMensajes(prev => [...prev, {
      tipo: 'usuario',
      contenido: mensajeUsuario,
      timestamp: new Date()
    }]);
    
    setCargando(true);

    try {
      const response = await fetch('/api/chat-ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensaje: mensajeUsuario,
          contexto: {
            ...contextoIA,
            historial: mensajes.slice(-5).map(m => ({
              rol: m.tipo === 'ia' ? 'asistente' : 'usuario',
              contenido: m.contenido
            }))
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMensajes(prev => [...prev, {
          tipo: 'ia',
          contenido: data.respuesta,
          timestamp: new Date()
        }]);
      } else {
        setMensajes(prev => [...prev, {
          tipo: 'ia',
          contenido: 'Lo siento, tuve un problema técnico. Por favor, intenta de nuevo.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajes(prev => [...prev, {
        tipo: 'ia',
        contenido: 'Lo siento, no puedo conectar con el servidor. Por favor, intenta más tarde.',
        timestamp: new Date()
      }]);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const sugerirPregunta = (pregunta: string) => {
    setInput(pregunta);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
          >
            ← Volver al plan
          </button>
          <div className="text-center">
            <h1 className="font-bold text-gray-800">HealthyIA</h1>
            <p className="text-xs text-gray-500">Asistente Nutricional</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {mensajes.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.tipo === 'usuario'
                    ? 'bg-green-500 text-white'
                    : 'bg-white shadow-md text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.contenido}</div>
                <div className={`text-xs mt-2 ${msg.tipo === 'usuario' ? 'text-green-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {cargando && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md rounded-2xl p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sugerencias rápidas */}
      <div className="bg-white border-t border-gray-200 p-2">
        <div className="max-w-4xl mx-auto flex overflow-x-auto gap-2 pb-2">
          {[
            "¿Puedo cambiar el pollo por tofu?",
            "¿Cómo puedo aumentar las proteínas?",
            "Snacks saludables para la noche",
            "¿Puedo comer fuera de casa?",
            "¿Cómo ajusto las porciones?",
            "Alternativas sin gluten"
          ].map(sugerencia => (
            <button
              key={sugerencia}
              onClick={() => sugerirPregunta(sugerencia)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 whitespace-nowrap transition"
            >
              {sugerencia}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '100px' }}
            disabled={cargando}
          />
          <button
            onClick={enviarMensaje}
            disabled={cargando || !input.trim()}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-2 text-xs text-gray-400">
          HealthyIA puede responder preguntas sobre nutrición, planes alimenticios, reemplazos de alimentos y consejos saludables
        </div>
      </div>
    </div>
  );
}