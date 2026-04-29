'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PreferenciasAlimenticias from '@/components/PreferenciasAlimenticias';
import type { PreferenciasUsuario } from '@/types';

export default function Dashboard() {
  const [peso, setPeso] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [showIMC, setShowIMC] = useState<boolean>(false);
  const [imc, setImc] = useState<number | null>(null);
  const [mostrarPreferencias, setMostrarPreferencias] = useState<boolean>(false);
  const [objetivo, setObjetivo] = useState<string>('');
  const [generando, setGenerando] = useState<boolean>(false);
  const [mostrarInfoIMC, setMostrarInfoIMC] = useState<boolean>(false);
  const { user, setUser, preferencias, setPreferencias, agregarPlan } = useApp();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const tieneDatosFisicos = user?.peso && user?.altura;

  const calcularIMC = () => {
    if (peso && altura) {
      const pesoNum = parseFloat(peso);
      const alturaNum = parseFloat(altura);
      const alturaMetros = alturaNum / 100;
      const imcCalculado = pesoNum / (alturaMetros * alturaMetros);
      const nuevoImc = Number(imcCalculado.toFixed(1));
      setImc(nuevoImc);
      setShowIMC(true);
      
      if (user) {
        const updatedUser = { 
          ...user, 
          peso: pesoNum, 
          altura: alturaNum,
          imc: nuevoImc,
          pesoActualizado: new Date().toISOString()
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
    }
  };

  const guardarPreferencias = (seleccionados: string[]) => {
    if (user) {
      const nuevaPreferencia: PreferenciasUsuario = {
        userId: user.id,
        itemsSeleccionados: seleccionados
      };
      setPreferencias(nuevaPreferencia);
      
      const allPreferencias = JSON.parse(localStorage.getItem('preferencias_usuarios') || '[]');
      const existingIndex = allPreferencias.findIndex((p: PreferenciasUsuario) => p.userId === user.id);
      
      if (existingIndex !== -1) {
        allPreferencias[existingIndex] = nuevaPreferencia;
      } else {
        allPreferencias.push(nuevaPreferencia);
      }
      
      localStorage.setItem('preferencias_usuarios', JSON.stringify(allPreferencias));
      setMostrarPreferencias(false);
    }
  };

  const generarPlan = async () => {
    if (!objetivo) {
      alert('Por favor, selecciona un objetivo');
      return;
    }

    if (!preferencias || preferencias.itemsSeleccionados.length === 0) {
      alert('Por favor, configura tus preferencias alimenticias primero');
      setMostrarPreferencias(true);
      return;
    }

    setGenerando(true);
    
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objetivo,
          preferencias: preferencias.itemsSeleccionados,
          user: {
            id: user?.id,
            name: user?.name,
            peso: user?.peso,
            altura: user?.altura,
            imc: user?.imc
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        agregarPlan(data.plan);
        router.push(`/plan/${data.plan.id}`);
      } else {
        alert('Error al generar el plan: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setGenerando(false);
    }
  };

  const getRecomendacionIMC = (imcValor: number) => {
    if (imcValor < 18.5) return { texto: "Bajo peso - Consulta con un profesional", color: "text-blue-600" };
    if (imcValor < 25) return { texto: "Peso saludable - Excelente! Manten tus habitos", color: "text-green-600" };
    if (imcValor < 30) return { texto: "Sobrepeso - Enfocate en habitos saludables", color: "text-yellow-600" };
    return { texto: "Obesidad - Trabaja con un profesional de la salud", color: "text-red-600" };
  };

  if (mostrarPreferencias) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              ¿Que alimentos consumes regularmente?
            </h2>
            <button
              onClick={() => setMostrarPreferencias(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              x
            </button>
          </div>
          <PreferenciasAlimenticias 
            onComplete={guardarPreferencias}
            initialSeleccionados={preferencias?.itemsSeleccionados}
          />
        </div>
      </div>
    );
  }

  if (!tieneDatosFisicos && !showIMC) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Tus Datos Fisicos
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Ingresa tus datos para calcular tu IMC. Esta informacion se guardara en tu perfil.
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: 70"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: 170"
              />
            </div>
            
            <button
              onClick={calcularIMC}
              disabled={!peso || !altura}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              Calcular IMC y Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showIMC || (tieneDatosFisicos && !mostrarPreferencias)) {
    const imcMostrar = imc || user?.imc || 0;
    const pesoMostrar = peso || user?.peso;
    const alturaMostrar = altura || user?.altura;
    const recomendacion = getRecomendacionIMC(imcMostrar);
    
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Hola, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Basado en tus datos, vamos a crear tu plan nutricional personalizado
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Tu IMC es: <span className="text-green-600">{imcMostrar}</span>
              </h2>
              <p className={`font-semibold ${recomendacion.color}`}>
                {recomendacion.texto}
              </p>
            </div>
            
            <button
              onClick={() => setMostrarInfoIMC(!mostrarInfoIMC)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 w-full text-center"
            >
              {mostrarInfoIMC ? '▼ Ocultar tabla IMC' : '▶ Ver tabla de referencia IMC'}
            </button>
            
            {mostrarInfoIMC && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Clasificacion</th>
                      <th className="px-4 py-2 border">IMC (kg/m²)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={imcMostrar < 18.5 ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-2 border">Bajo peso</td>
                      <td className="px-4 py-2 border">&lt; 18.5</td>
                    </tr>
                    <tr className={imcMostrar >= 18.5 && imcMostrar < 25 ? 'bg-green-50' : ''}>
                      <td className="px-4 py-2 border">Peso normal</td>
                      <td className="px-4 py-2 border">18.5 – 24.9</td>
                    </tr>
                    <tr className={imcMostrar >= 25 && imcMostrar < 30 ? 'bg-yellow-50' : ''}>
                      <td className="px-4 py-2 border">Sobrepeso</td>
                      <td className="px-4 py-2 border">25 – 29.9</td>
                    </tr>
                    <tr className={imcMostrar >= 30 ? 'bg-red-50' : ''}>
                      <td className="px-4 py-2 border">Obesidad</td>
                      <td className="px-4 py-2 border">≥ 30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500 text-center bg-white/50 rounded-lg p-2">
              Datos registrados: {pesoMostrar} kg | {alturaMostrar} cm
              {user?.pesoActualizado && (
                <span className="block text-xs mt-1">
                  Ultima actualizacion: {new Date(user.pesoActualizado).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-bold mb-3">
              Elige tu objetivo principal:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { 
                  value: 'perder_peso', 
                  label: 'Perder peso', 
                  emoji: '🏃‍♂️',
                  descripcion: 'Deficit calorico controlado',
                  recomendacion: 'Ideal para reducir grasa corporal manteniendo musculo'
                },
                { 
                  value: 'masa_muscular', 
                  label: 'Ganar masa muscular', 
                  emoji: '💪',
                  descripcion: 'Superavit calorico con alta proteina',
                  recomendacion: 'Perfecto para aumentar fuerza y volumen muscular'
                },
                { 
                  value: 'recomposicion', 
                  label: 'Recomposicion corporal', 
                  emoji: '🔄',
                  descripcion: 'Equilibrio para ganar musculo y perder grasa',
                  recomendacion: 'Para quienes buscan transformacion completa'
                }
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    objetivo === opt.value
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="objetivo"
                    value={opt.value}
                    checked={objetivo === opt.value}
                    onChange={(e) => setObjetivo(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{opt.emoji}</div>
                    <div className="font-semibold text-gray-800">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{opt.descripcion}</div>
                    {objetivo === opt.value && (
                      <div className="text-xs text-green-600 mt-2">
                        {opt.recomendacion}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Tus preferencias alimenticias</h3>
              <button
                onClick={() => setMostrarPreferencias(true)}
                className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center gap-1"
              >
                {preferencias?.itemsSeleccionados?.length ? '✏️ Editar' : '➕ Agregar'}
              </button>
            </div>
            {preferencias?.itemsSeleccionados?.length ? (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  ✅ Tienes {preferencias.itemsSeleccionados.length} alimentos seleccionados
                </p>
                <p className="text-xs text-green-600 mt-1">
                  HealthyIA usara estos alimentos para crear tu plan personalizado
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 flex items-center gap-2">
                  ⚠️ Aun no has configurado tus preferencias alimenticias
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Selecciona los alimentos que tienes en casa para un plan mas personalizado
                </p>
              </div>
            )}
          </div>

          <button
            onClick={generarPlan}
            disabled={generando}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-4 rounded-lg hover:opacity-90 transition transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
          >
            {generando ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando plan con IA...
              </span>
            ) : (
              '✨ Generar plan de alimentacion con IA ✨'
            )}
          </button>

          <div className="mt-6 text-center text-xs text-gray-400">
            💡 La IA generara un plan basado en tus objetivos, preferencias y datos fisicos
          </div>
        </div>
      </div>
    );
  }

  return null;
}