"use client";
import { useState, useRef, useEffect } from "react";
import type { PlanNutricional, User, Mensaje } from "@/types";

interface ChatIAProps {
  plan: PlanNutricional;
  user: User | null;
  onBack: () => void;
}

// Mapeo de nombres de alimentos
const nombresAlimentos: Record<string, string> = {
  pollo: "Pollo",
  pescado: "Pescado",
  huevos: "Huevos",
  carne_magra: "Carne magra",
  tofu: "Tofu",
  lentejas: "Lentejas",
  arroz_integral: "Arroz integral",
  quinoa: "Quinoa",
  avena: "Avena",
  papa: "Papa o batata",
  pan_integral: "Pan integral",
  brocoli: "Brócoli",
  espinacas: "Espinacas",
  zanahoria: "Zanahoria",
  tomate: "Tomate",
  pepino: "Pepino",
  pimiento: "Pimiento",
  manzana: "Manzana",
  platano: "Plátano",
  naranja: "Naranja",
  fresas: "Fresas",
  kiwi: "Kiwi",
  arandanos: "Arándanos",
  aguacate: "Aguacate",
  aceite_oliva: "Aceite de oliva",
  nueces: "Nueces",
  almendras: "Almendras",
  semillas_chia: "Semillas de chía",
  yogur_griego: "Yogur griego",
  leche: "Leche",
  queso: "Queso fresco",
  requeson: "Requesón",
};

export default function ChatIA({ plan, user, onBack }: ChatIAProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      tipo: "ia",
      contenido: `¡Hola ${user?.name || "usuario"}! 👋 Soy HealthyIA, tu asistente nutricional personalizado.\n\nBasado en tu plan de **${plan.caloriasDiarias} kcal/día** para **${plan.objetivo === "perder_peso" ? "perder peso" : plan.objetivo === "masa_muscular" ? "ganar masa muscular" : "recomposición corporal"}**, ¿En qué te puedo ayudar hoy? Puedes preguntarme sobre reemplazos de alimentos, opciones de snacks, consejos nutricionales o cualquier duda sobre tu alimentación.`,
      timestamp: new Date(),
    },
  ]);
  const [cargando, setCargando] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("reemplazos");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const alimentosUsuario = plan.preferenciasUsadas || [];
  const alimentosNombres = alimentosUsuario.map(
    (id) => nombresAlimentos[id] || id,
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const enviarConsulta = async (consulta: string) => {
    setCargando(true);

    setMensajes((prev) => [
      ...prev,
      {
        tipo: "usuario",
        contenido: consulta,
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await fetch("/api/chat-ia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensaje: consulta,
          contexto: {
            objetivo: plan.objetivo,
            calorias: plan.caloriasDiarias,
            preferencias: plan.preferenciasUsadas,
          },
        }),
      });

      const data = await response.json();

      setMensajes((prev) => [
        ...prev,
        {
          tipo: "ia",
          contenido: data.respuesta,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMensajes((prev) => [
        ...prev,
        {
          tipo: "ia",
          contenido: "Lo siento, hubo un error. Por favor, intenta de nuevo.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const limpiarConversacion = () => {
    setMensajes([
      {
        tipo: "ia",
        contenido: `Conversación reiniciada. ¿En qué te puedo ayudar con tu plan nutricional?\n\nPuedes preguntarme sobre nutrición, dietas o consultoría sobre tus comidas.`,
        timestamp: new Date(),
      },
    ]);
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
          <button
            onClick={limpiarConversacion}
            className="text-gray-400 hover:text-gray-600 text-sm"
            title="Limpiar conversación"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Información del plan */}
      <div className="bg-green-50 border-b border-green-200 p-3">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-700">
              📊 {plan.caloriasDiarias} kcal/día
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-700">
              🎯{" "}
              {plan.objetivo === "perder_peso"
                ? "Perder peso"
                : plan.objetivo === "masa_muscular"
                  ? "Ganar masa"
                  : "Recomposición"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-700">
              🍽️ {alimentosUsuario.length} alimentos
            </span>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {mensajes.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.tipo === "usuario" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.tipo === "usuario"
                    ? "bg-green-500 text-white"
                    : "bg-white shadow-md text-gray-800"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.contenido}
                </div>
                <div
                  className={`text-xs mt-2 ${msg.tipo === "usuario" ? "text-green-100" : "text-gray-400"}`}
                >
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
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Botones de categorías */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setCategoriaActiva("reemplazos")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                categoriaActiva === "reemplazos"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔄 REEMPLAZOS
            </button>
            <button
              onClick={() => setCategoriaActiva("porciones")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                categoriaActiva === "porciones"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📏 PORCIONES
            </button>
            <button
              onClick={() => setCategoriaActiva("snacks")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                categoriaActiva === "snacks"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🍎 SNACKS
            </button>
            <button
              onClick={() => setCategoriaActiva("tips")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                categoriaActiva === "tips"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💡 TIPS
            </button>
          </div>

          {/* Botones de REEMPLAZOS - Muestra los alimentos del usuario */}
          {categoriaActiva === "reemplazos" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                ¿Qué alimento quieres reemplazar?
              </p>
              <div className="flex flex-wrap gap-2">
                {alimentosUsuario.map((alimento, idx) => (
                  <button
                    key={idx}
                    onClick={() => enviarConsulta(`reemplazar ${alimento}`)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition"
                  >
                    🔄 Reemplazar {nombresAlimentos[alimento] || alimento}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botones de PORCIONES - Muestra los alimentos del usuario */}
          {categoriaActiva === "porciones" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                ¿De qué alimento quieres saber la porción?
              </p>
              <div className="flex flex-wrap gap-2">
                {alimentosUsuario.map((alimento, idx) => (
                  <button
                    key={idx}
                    onClick={() => enviarConsulta(`porción de ${alimento}`)}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-medium transition"
                  >
                    📏 Porción de {nombresAlimentos[alimento] || alimento}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botones de SNACKS */}
          {categoriaActiva === "snacks" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                ¿Qué tipo de snack necesitas?
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => enviarConsulta("snacks para la noche")}
                  className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm font-medium transition"
                >
                  🌙 Snacks para la noche
                </button>
                <button
                  onClick={() => enviarConsulta("snacks pre-entreno")}
                  className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm font-medium transition"
                >
                  ⚡ Snacks pre-entreno
                </button>
                <button
                  onClick={() => enviarConsulta("snacks proteicos")}
                  className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm font-medium transition"
                >
                  💪 Snacks proteicos
                </button>
              </div>
            </div>
          )}

          {/* Botones de TIPS */}
          {categoriaActiva === "tips" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">¿Qué consejo necesitas?</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => enviarConsulta("comer fuera de casa")}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-medium transition"
                >
                  🍽️ Comer fuera de casa
                </button>
                <button
                  onClick={() => enviarConsulta("controlar antojos")}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-medium transition"
                >
                  🍬 Controlar antojos
                </button>
                <button
                  onClick={() => enviarConsulta("cómo hidratarme")}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-medium transition"
                >
                  💧 Hidratación
                </button>
                <button
                  onClick={() => enviarConsulta("comer de más un día")}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-medium transition"
                >
                  💪 Si comí de más
                </button>
              </div>
            </div>
          )}

          {/* Formulario para texto libre */}
          <div className="mt-4 border-t pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem(
                  "consulta",
                ) as HTMLInputElement;
                const valor = input.value.trim();
                if (valor && !cargando) {
                  enviarConsulta(valor);
                  input.value = "";
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                name="consulta"
                placeholder="Escribe tu consulta nutricional libremente..."
                disabled={cargando}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={cargando}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
