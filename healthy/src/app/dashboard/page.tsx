'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PreferenciasAlimenticias from '@/components/PreferenciasAlimenticias';
import type { PreferenciasUsuario } from '@/types';

// Mapeo de nombres de alimentos para mostrar
const nombresAlimentos: Record<string, string> = {
  'pollo': 'Pollo', 'pescado': 'Pescado', 'huevos': 'Huevos', 'carne_magra': 'Carne magra',
  'tofu': 'Tofu', 'lentejas': 'Lentejas', 'arroz_integral': 'Arroz integral', 'quinoa': 'Quinoa',
  'avena': 'Avena', 'papa': 'Papa o batata', 'pan_integral': 'Pan integral', 'brocoli': 'Brocoli',
  'espinacas': 'Espinacas', 'zanahoria': 'Zanahoria', 'tomate': 'Tomate', 'pepino': 'Pepino',
  'pimiento': 'Pimiento', 'manzana': 'Manzana', 'platano': 'Platano', 'naranja': 'Naranja',
  'fresas': 'Fresas', 'kiwi': 'Kiwi', 'arandanos': 'Arandanos', 'aguacate': 'Aguacate',
  'aceite_oliva': 'Aceite de oliva', 'nueces': 'Nueces', 'almendras': 'Almendras',
  'semillas_chia': 'Semillas de chia', 'yogur_griego': 'Yogur griego', 'leche': 'Leche',
  'queso': 'Queso fresco', 'requeson': 'Requeson'
};

export default function Dashboard() {
  const [peso, setPeso] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [showIMC, setShowIMC] = useState<boolean>(false);
  const [imc, setImc] = useState<number | null>(null);
  const [mostrarPreferencias, setMostrarPreferencias] = useState<boolean>(false);
  const [objetivo, setObjetivo] = useState<string>('');
  const [generando, setGenerando] = useState<boolean>(false);
  const [mostrarInfoIMC, setMostrarInfoIMC] = useState<boolean>(false);
  const [mostrarResumenAlimentos, setMostrarResumenAlimentos] = useState<boolean>(false);
  const [cargandoUsuario, setCargandoUsuario] = useState<boolean>(true);
  const { user, setUser, preferencias, setPreferencias, agregarPlan, actualizarPreferencias, cargarDatosUsuario } = useApp();
  const router = useRouter();

  // Cargar usuario desde localStorage si el contexto no tiene usuario
  useEffect(() => {
    const loadUserData = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('Dashboard - Token:', !!token);
        console.log('Dashboard - UserData:', userData);
        
        if (!token || !userData) {
          console.log('No autenticado, redirigiendo a login');
          router.push('/login');
          return;
        }
        
        // Si el contexto no tiene usuario, cargarlo manualmente
        if (!user && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Cargando usuario manualmente:', parsedUser);
          setUser(parsedUser);
          
          // También cargar preferencias
          const allPreferencias = JSON.parse(localStorage.getItem('preferencias_usuarios') || '[]');
          const userPrefs = allPreferencias.find((p: PreferenciasUsuario) => p.userId === parsedUser.id);
          if (userPrefs) {
            setPreferencias(userPrefs);
          }
        } else if (user) {
          console.log('Usuario ya está en contexto:', user);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        router.push('/login');
      } finally {
        setCargandoUsuario(false);
      }
    };
    
    loadUserData();
    cargarDatosUsuario();
  }, [router, user, setUser, setPreferencias, cargarDatosUsuario]);

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
      } else {
        // Si no hay usuario en contexto pero hay en localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const existingUser = JSON.parse(userData);
          const updatedUser = { 
            ...existingUser, 
            peso: pesoNum, 
            altura: alturaNum,
            imc: nuevoImc,
            pesoActualizado: new Date().toISOString()
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: any) => u.id === existingUser.id);
          if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
      }
    }
  };

  const guardarPreferencias = (seleccionados: string[]) => {
    console.log('Guardando preferencias:', seleccionados);
    
    // Intentar obtener usuario del contexto o localStorage
    let currentUser = user;
    if (!currentUser) {
      const userData = localStorage.getItem('user');
      if (userData) {
        currentUser = JSON.parse(userData);
      }
    }
    
    if (currentUser && currentUser.id) {
      actualizarPreferencias(currentUser.id, seleccionados);
      setMostrarPreferencias(false);
    } else {
      console.error('No hay usuario logueado');
      alert('Error: No se encontró usuario. Por favor, inicia sesión nuevamente.');
      router.push('/login');
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
      // Obtener usuario actual
      let currentUser = user;
      if (!currentUser) {
        const userData = localStorage.getItem('user');
        if (userData) {
          currentUser = JSON.parse(userData);
        }
      }
      
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objetivo,
          preferencias: preferencias.itemsSeleccionados,
          user: {
            id: currentUser?.id,
            name: currentUser?.name,
            peso: currentUser?.peso,
            altura: currentUser?.altura,
            imc: currentUser?.imc
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

  // Agrupar alimentos por tipo para mostrar mejor
  const agruparAlimentosPorTipo = (items: string[]) => {
    const tipos: Record<string, string[]> = {
      proteinas: [], carbohidratos: [], grasas: [], vegetales: [], frutas: [], lacteos: []
    };
    
    const mapaTipos: Record<string, string> = {
      'pollo': 'proteinas', 'pescado': 'proteinas', 'huevos': 'proteinas', 'carne_magra': 'proteinas',
      'tofu': 'proteinas', 'lentejas': 'proteinas', 'arroz_integral': 'carbohidratos', 'quinoa': 'carbohidratos',
      'avena': 'carbohidratos', 'papa': 'carbohidratos', 'pan_integral': 'carbohidratos', 'brocoli': 'vegetales',
      'espinacas': 'vegetales', 'zanahoria': 'vegetales', 'tomate': 'vegetales', 'pepino': 'vegetales',
      'pimiento': 'vegetales', 'manzana': 'frutas', 'platano': 'frutas', 'naranja': 'frutas', 'fresas': 'frutas',
      'kiwi': 'frutas', 'arandanos': 'frutas', 'aguacate': 'grasas', 'aceite_oliva': 'grasas', 'nueces': 'grasas',
      'almendras': 'grasas', 'semillas_chia': 'grasas', 'yogur_griego': 'lacteos', 'leche': 'lacteos',
      'queso': 'lacteos', 'requeson': 'lacteos'
    };
    
    items.forEach(id => {
      const tipo = mapaTipos[id] || 'otros';
      if (tipos[tipo]) {
        tipos[tipo].push(nombresAlimentos[id] || id);
      }
    });
    
    return tipos;
  };

  // Mostrar loading mientras se carga el usuario
  if (cargandoUsuario) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (mostrarPreferencias) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Que alimentos consumes regularmente?
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
            initialSeleccionados={preferencias?.itemsSeleccionados || []}
            onCancel={() => setMostrarPreferencias(false)}
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
    
    // Preparar resumen de alimentos seleccionados
    const alimentosPorTipo = preferencias?.itemsSeleccionados?.length 
      ? agruparAlimentosPorTipo(preferencias.itemsSeleccionados)
      : null;
    
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Hola, {user?.name || 'Usuario'}! 👋
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
              <>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-3">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    ✅ Tienes {preferencias.itemsSeleccionados.length} alimentos seleccionados
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    HealthyIA usara estos alimentos para crear tu plan personalizado
                  </p>
                </div>
                
                <button
                  onClick={() => setMostrarResumenAlimentos(!mostrarResumenAlimentos)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {mostrarResumenAlimentos ? '▼ Ocultar' : '▶ Ver'} detalle de tus alimentos
                </button>
                
                {mostrarResumenAlimentos && alimentosPorTipo && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">Distribucion de tus alimentos:</h4>
                    <div className="space-y-2 text-sm">
                      {alimentosPorTipo.proteinas.length > 0 && (
                        <div><span className="font-medium text-red-600">🥩 Proteinas:</span> {alimentosPorTipo.proteinas.join(', ')}</div>
                      )}
                      {alimentosPorTipo.carbohidratos.length > 0 && (
                        <div><span className="font-medium text-orange-600">🍚 Carbohidratos:</span> {alimentosPorTipo.carbohidratos.join(', ')}</div>
                      )}
                      {alimentosPorTipo.vegetales.length > 0 && (
                        <div><span className="font-medium text-green-600">🥬 Vegetales:</span> {alimentosPorTipo.vegetales.join(', ')}</div>
                      )}
                      {alimentosPorTipo.frutas.length > 0 && (
                        <div><span className="font-medium text-purple-600">🍎 Frutas:</span> {alimentosPorTipo.frutas.join(', ')}</div>
                      )}
                      {alimentosPorTipo.lacteos.length > 0 && (
                        <div><span className="font-medium text-blue-600">🥛 Lacteos:</span> {alimentosPorTipo.lacteos.join(', ')}</div>
                      )}
                      {alimentosPorTipo.grasas.length > 0 && (
                        <div><span className="font-medium text-yellow-600">🥑 Grasas saludables:</span> {alimentosPorTipo.grasas.join(', ')}</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Tu plan se creara combinando estos alimentos de manera balanceada
                    </p>
                  </div>
                )}
              </>
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
                Generando plan con IA usando tus alimentos...
              </span>
            ) : (
              '✨ Generar plan de alimentacion con IA ✨'
            )}
          </button>

          <div className="mt-6 text-center text-xs text-gray-400">
            💡 La IA generara un plan usando SOLO los alimentos que seleccionaste en tus preferencias
          </div>
        </div>
      </div>
    );
  }

  return null;
}