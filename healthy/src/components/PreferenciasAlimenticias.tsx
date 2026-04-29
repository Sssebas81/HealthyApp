'use client';
import { useState, useEffect } from 'react';
import { alimentosPorCategoria, categoriasInfo } from '@/data/alimentos';
import type { Alimento } from '@/types';

interface PreferenciasAlimenticiasProps {
  onComplete: (seleccionados: string[]) => void;
  initialSeleccionados?: string[];
  onCancel?: () => void;
}

export default function PreferenciasAlimenticias({ 
  onComplete, 
  initialSeleccionados = [],
  onCancel 
}: PreferenciasAlimenticiasProps) {
  const [seleccionados, setSeleccionados] = useState<string[]>(initialSeleccionados);
  const [categoriaActiva, setCategoriaActiva] = useState<keyof typeof alimentosPorCategoria>('proteinas');

  // Sincronizar cuando cambian las props
  useEffect(() => {
    setSeleccionados(initialSeleccionados);
  }, [initialSeleccionados]);

  const toggleAlimento = (alimentoId: string) => {
    setSeleccionados(prev => {
      if (prev.includes(alimentoId)) {
        return prev.filter(id => id !== alimentoId);
      } else {
        return [...prev, alimentoId];
      }
    });
  };

  const getAlimentosSeleccionadosInfo = (): Alimento[] => {
    const allAlimentos: Alimento[] = Object.values(alimentosPorCategoria).flat();
    return allAlimentos.filter(a => seleccionados.includes(a.id));
  };

  const handleGuardar = () => {
    console.log('Guardando preferencias:', seleccionados);
    onComplete(seleccionados);
  };

  const alimentosActuales: Alimento[] = alimentosPorCategoria[categoriaActiva];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Que alimentos consumes regularmente?</h3>
        <p className="text-gray-600 text-sm">
          Selecciona los alimentos que tienes en casa o consumes frecuentemente. 
          HealthyIA usara esta informacion para crear un plan personalizado.
        </p>
      </div>

      {/* Categorias tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {(Object.keys(alimentosPorCategoria) as Array<keyof typeof alimentosPorCategoria>).map(categoria => (
          <button
            key={categoria}
            onClick={() => setCategoriaActiva(categoria)}
            className={`px-4 py-2 rounded-t-lg transition ${
              categoriaActiva === categoria
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{categoriasInfo[categoria].icono}</span>
            {categoriasInfo[categoria].nombre}
          </button>
        ))}
      </div>

      {/* Mostrar alimentos de la categoria activa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
        {alimentosActuales.map((alimento: Alimento) => (
          <label
            key={alimento.id}
            className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition ${
              seleccionados.includes(alimento.id)
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <input
              type="checkbox"
              checked={seleccionados.includes(alimento.id)}
              onChange={() => toggleAlimento(alimento.id)}
              className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{alimento.nombre}</div>
              <div className="text-sm text-gray-500">
                {alimento.porcion} - {alimento.caloriasPorcion} kcal
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Resumen de seleccionados */}
      {seleccionados.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">
            Alimentos seleccionados ({seleccionados.length})
          </h4>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {getAlimentosSeleccionadosInfo().map(alimento => (
              <span key={alimento.id} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {alimento.nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={handleGuardar}
          className="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition"
        >
          Guardar preferencias
        </button>
      </div>
    </div>
  );
}