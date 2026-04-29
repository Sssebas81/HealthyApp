export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  peso?: number;
  altura?: number;
  imc?: number;
  fechaRegistro: string;
  pesoActualizado?: string;
}

export interface PreferenciaAlimenticia {
  id: string;
  nombre: string;
  categoria: string;
  icono?: string;
}

export interface PreferenciasUsuario {
  userId: number;
  itemsSeleccionados: string[];
}

export interface PlanNutricional {
  id: number;
  userId: number;
  fechaCreacion: string;
  objetivo: string;
  caloriasDiarias: number;
  desayuno: string;
  almuerzo: string;
  cena: string;
  snacks?: string;
  recomendaciones: string;
  preferenciasUsadas: string[];
  activo: boolean;
}

export interface PlanContenido {
  desayuno: string;
  almuerzo: string;
  cena: string;
  snacks: string;
}

export interface Mensaje {
  tipo: 'usuario' | 'ia';
  contenido: string;
  timestamp: Date;
}

export interface Alimento {
  id: string;
  nombre: string;
  categoria: 'proteinas' | 'carbohidratos' | 'grasasSaludables' | 'vegetales' | 'frutas' | 'lacteos';
  caloriasPorcion: number;
  porcion: string;
}