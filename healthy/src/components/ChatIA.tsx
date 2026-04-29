'use client';
import { useState, useRef, useEffect } from 'react';
import type { PlanNutricional, User, Mensaje } from '@/types';

interface ChatIAProps {
  plan: PlanNutricional;
  user: User | null;
  onBack: () => void;
}

// Preguntas sugeridas por categoría
const preguntasSugeridas = {
  comidas: [
    "¿Puedo cambiar el desayuno por algo más ligero?",
    "¿Qué puedo comer si no tengo tiempo para cocinar?",
    "¿Cómo puedo hacer más variado mi almuerzo?",
    "¿Qué cena ligera puedo hacer antes de dormir?"
  ],
  reemplazos: [
    "¿Cómo reemplazo el pollo si soy vegetariano?",
    "¿Qué puedo usar en lugar de arroz?",
    "Alternativas sin gluten para mi plan",
    "¿Cómo sustituyo los lácteos?"
  ],
  porciones: [
    "¿Cómo calculo las porciones correctas?",
    "¿Cuánta proteína debo comer por comida?",
    "¿Puedo comer más vegetales sin límite?",
    "¿Cómo ajusto las porciones si hago ejercicio?"
  ],
  snacks: [
    "Snacks saludables para la noche",
    "¿Qué puedo comer entre comidas?",
    "Snacks pre-entrenamiento",
    "¿Frutos secos, cuántos puedo comer?"
  ],
  tips: [
    "¿Cómo mantener la dieta fuera de casa?",
    "Consejos para evitar antojos",
    "¿Cómo hidratarme correctamente?",
    "¿Qué hacer si como de más un día?"
  ]
};

export default function ChatIA({ plan, user, onBack }: ChatIAProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      tipo: 'ia',
      contenido: `¡Hola ${user?.name || 'usuario'}! 👋 Soy HealthyIA, tu asistente nutricional personalizado.\n\nBasado en tu plan actual de ${plan.caloriasDiarias} kcal/día con objetivo de ${plan.objetivo === 'perder_peso' ? 'perder peso' : plan.objetivo === 'masa_muscular' ? 'ganar masa muscular' : 'recomposición corporal'}, puedo ayudarte con:\n\n🍽️ **Modificaciones a tu plan**\n🔄 **Reemplazos de alimentos**\n📏 **Porciones y cantidades**\n🍎 **Snacks saludables**\n💡 **Tips y consejos prácticos**\n\n¿En qué puedo ayudarte hoy?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<string>('comidas');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            objetivo: plan.objetivo,
            calorias: plan.caloriasDiarias,
            alimentosPlan: `${plan.desayuno} ${plan.almuerzo} ${plan.cena}`,
            preferencias: plan.preferenciasUsadas,
            historial: mensajes.slice(-10).map(m => ({
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

  const limpiarConversacion = () => {
    setMensajes([
      {
        tipo: 'ia',
        contenido: `Conversación reiniciada. ¿En qué más puedo ayudarte con tu plan nutricional?`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
          >
            ← Volver al plan
          </button>
          <div className="text-center">
            <h1 className="font-bold text-gray-800">HealthyIA</h1>
            <p className="text-xs text-gray-500">Asistente Nutricional 24/7</p>
          </div>
          <button
            onClick={limpiarConversacion}
            className="text-gray-400 hover:text-gray-600 text-sm"
            title="Limpiar conversación"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Información del plan actual */}
      <div className="bg-green-50 border-b border-green-200 p-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-700">📊 Plan activo:</span>
              <span className="text-gray-600">{plan.caloriasDiarias} kcal/día</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-700">🎯 Objetivo:</span>
              <span className="text-gray-600 capitalize">
                {plan.objetivo === 'perder_peso' ? 'Perder peso' : 
                 plan.objetivo === 'masa_muscular' ? 'Ganar masa muscular' : 
                 'Recomposición corporal'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-700">🍽️ Alimentos disponibles:</span>
              <span className="text-gray-600">{plan.preferenciasUsadas?.length || 0} items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {mensajes.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.tipo === 'usuario'
                    ? 'bg-green-500 text-white'
                    : 'bg-white shadow-md text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.contenido}</div>
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
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Categorías de preguntas sugeridas */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setCategoriaActiva('comidas')}
              className={`px-3 py-1 rounded-full text-sm transition ${
                categoriaActiva === 'comidas'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🍽️ Comidas
            </button>
            <button
              onClick={() => setCategoriaActiva('reemplazos')}
              className={`px-3 py-1 rounded-full text-sm transition ${
                categoriaActiva === 'reemplazos'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔄 Reemplazos
            </button>
            <button
              onClick={() => setCategoriaActiva('porciones')}
              className={`px-3 py-1 rounded-full text-sm transition ${
                categoriaActiva === 'porciones'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📏 Porciones
            </button>
            <button
              onClick={() => setCategoriaActiva('snacks')}
              className={`px-3 py-1 rounded-full text-sm transition ${
                categoriaActiva === 'snacks'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🍎 Snacks
            </button>
            <button
              onClick={() => setCategoriaActiva('tips')}
              className={`px-3 py-1 rounded-full text-sm transition ${
                categoriaActiva === 'tips'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💡 Tips
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-2">
            {preguntasSugeridas[categoriaActiva as keyof typeof preguntasSugeridas].map((pregunta, idx) => (
              <button
                key={idx}
                onClick={() => sugerirPregunta(pregunta)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 whitespace-nowrap transition flex-shrink-0"
              >
                {pregunta}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta aquí... (Ej: ¿Puedo cambiar el pollo por pescado? ¿Cuánta proteína necesito?)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={2}
              style={{ minHeight: '60px', maxHeight: '120px' }}
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
          <div className="mt-2 text-xs text-gray-400 flex justify-between">
            <span>💡 HealthyIA puede ayudarte con nutrición, planes alimenticios y hábitos saludables</span>
            <span className="font-mono">Enter para enviar</span>
          </div>
        </div>
      </div>
    </div>
  );
}