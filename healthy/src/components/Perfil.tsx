'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { PlanNutricional } from '@/types';

interface PerfilProps {
  onClose: () => void;
}

export default function Perfil({ onClose }: PerfilProps) {
  const { user, planes, setUser } = useApp();
  const [editando, setEditando] = useState(false);
  const [pesoEdit, setPesoEdit] = useState(user?.peso || 0);
  const [alturaEdit, setAlturaEdit] = useState(user?.altura || 0);
  const [planSeleccionado, setPlanSeleccionado] = useState<number | null>(null);

  const guardarCambios = () => {
    if (user) {
      const alturaMetros = alturaEdit / 100;
      const imcCalculado = pesoEdit / (alturaMetros * alturaMetros);
      
      const updatedUser = { 
        ...user, 
        peso: pesoEdit, 
        altura: alturaEdit,
        imc: parseFloat(imcCalculado.toFixed(1)),
        pesoActualizado: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Actualizar en la lista de usuarios
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      setEditando(false);
    }
  };

  const calcularIMC = () => {
    if (user?.peso && user?.altura) {
      const alturaMetros = user.altura / 100;
      const imc = user.peso / (alturaMetros * alturaMetros);
      return imc.toFixed(1);
    }
    return 'No disponible';
  };

  const getClasificacionIMC = () => {
    const imc = parseFloat(calcularIMC());
    if (isNaN(imc)) return 'Sin datos';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Información personal */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Información Personal</h3>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  ✏️ Editar
                </button>
              )}
            </div>
            
            {editando ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    value={pesoEdit}
                    onChange={(e) => setPesoEdit(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    value={alturaEdit}
                    onChange={(e) => setAlturaEdit(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={guardarCambios}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditando(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><span className="font-semibold">Nombre:</span> {user?.name}</p>
                <p><span className="font-semibold">Email:</span> {user?.email}</p>
                <p><span className="font-semibold">Peso:</span> {user?.peso || 'No registrado'} kg</p>
                <p><span className="font-semibold">Altura:</span> {user?.altura || 'No registrado'} cm</p>
                <p><span className="font-semibold">IMC:</span> {calcularIMC()} - <span className="text-green-600">{getClasificacionIMC()}</span></p>
                {user?.pesoActualizado && (
                  <p className="text-xs text-gray-500">Última actualización: {new Date(user.pesoActualizado).toLocaleDateString()}</p>
                )}
                <p><span className="font-semibold">Miembro desde:</span> {user?.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}</p>
              </div>
            )}
          </div>

          {/* Planes nutricionales */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Mis Planes Nutricionales</h3>
            {planes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Aún no tienes planes nutricionales</p>
                <p className="text-sm text-gray-400 mt-2">Genera tu primer plan desde el dashboard</p>
              </div>
            ) : (
              <div className="space-y-3">
                {planes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()).map((plan) => (
                  <div
                    key={plan.id}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => setPlanSeleccionado(planSeleccionado === plan.id ? null : plan.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-green-600">
                          {plan.objetivo === 'perder_peso' ? '🏃‍♂️ Perder peso' : 
                           plan.objetivo === 'masa_muscular' ? '💪 Ganar masa muscular' : 
                           '🔄 Recomposición corporal'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Creado: {new Date(plan.fechaCreacion).toLocaleDateString()} {new Date(plan.fechaCreacion).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {plan.caloriasDiarias} kcal/día
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {plan.activo ? 'Activo' : 'Archivado'}
                      </span>
                    </div>
                    
                    {planSeleccionado === plan.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <p className="font-semibold text-gray-700">🍳 Desayuno</p>
                          <p className="text-gray-600">{plan.desayuno}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">🥗 Almuerzo</p>
                          <p className="text-gray-600">{plan.almuerzo}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">🍽️ Cena</p>
                          <p className="text-gray-600">{plan.cena}</p>
                        </div>
                        {plan.snacks && (
                          <div>
                            <p className="font-semibold text-gray-700">🍎 Snacks</p>
                            <p className="text-gray-600">{plan.snacks}</p>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-700">💡 Recomendaciones</p>
                          <p className="text-gray-600">{plan.recomendaciones}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}