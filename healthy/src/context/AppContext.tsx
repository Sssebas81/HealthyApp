'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, PlanNutricional, PreferenciasUsuario } from '@/types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  planes: PlanNutricional[];
  setPlanes: (planes: PlanNutricional[]) => void;
  preferencias: PreferenciasUsuario | null;
  setPreferencias: (preferencias: PreferenciasUsuario | null) => void;
  agregarPlan: (plan: PlanNutricional) => void;
  logout: () => void;
  cargarDatosUsuario: () => void;
  actualizarPreferencias: (userId: number, itemsSeleccionados: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [planes, setPlanes] = useState<PlanNutricional[]>([]);
  const [preferencias, setPreferencias] = useState<PreferenciasUsuario | null>(null);

  const cargarDatosUsuario = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          // Solo actualizar si es diferente para evitar ciclos
          setUser(prevUser => {
            if (prevUser?.id === parsedUser.id) return prevUser;
            return parsedUser;
          });

          // Resto del código...
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const actualizarPreferencias = (userId: number, itemsSeleccionados: string[]) => {
    try {
      console.log('Actualizando preferencias para usuario:', userId);
      console.log('Items seleccionados:', itemsSeleccionados);

      const nuevaPreferencia: PreferenciasUsuario = {
        userId: userId,
        itemsSeleccionados: itemsSeleccionados
      };

      setPreferencias(nuevaPreferencia);

      const allPreferencias = JSON.parse(localStorage.getItem('preferencias_usuarios') || '[]');
      const existingIndex = allPreferencias.findIndex((p: PreferenciasUsuario) => p.userId === userId);

      if (existingIndex !== -1) {
        allPreferencias[existingIndex] = nuevaPreferencia;
      } else {
        allPreferencias.push(nuevaPreferencia);
      }

      localStorage.setItem('preferencias_usuarios', JSON.stringify(allPreferencias));
      console.log('Preferencias guardadas exitosamente');
      alert(`Preferencias guardadas! Has seleccionado ${itemsSeleccionados.length} alimentos.`);
    } catch (error) {
      console.error('Error guardando preferencias:', error);
      alert('Error al guardar preferencias');
    }
  };

  const agregarPlan = (plan: PlanNutricional) => {
    const allPlanes = JSON.parse(localStorage.getItem('planes_nutricionales') || '[]');
    allPlanes.push(plan);
    localStorage.setItem('planes_nutricionales', JSON.stringify(allPlanes));
    setPlanes([...planes, plan]);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    setPlanes([]);
    setPreferencias(null);
  };

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      planes,
      setPlanes,
      preferencias,
      setPreferencias,
      agregarPlan,
      logout,
      cargarDatosUsuario,
      actualizarPreferencias
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}