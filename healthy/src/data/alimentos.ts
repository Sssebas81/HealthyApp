import type { Alimento } from '@/types';

export const alimentosPorCategoria = {
  proteinas: [
    { id: 'pollo', nombre: 'Pollo a la plancha', categoria: 'proteinas' as const, caloriasPorcion: 165, porcion: '100g' },
    { id: 'pescado', nombre: 'Pescado blanco', categoria: 'proteinas' as const, caloriasPorcion: 120, porcion: '150g' },
    { id: 'huevos', nombre: 'Huevos', categoria: 'proteinas' as const, caloriasPorcion: 155, porcion: '2 unidades' },
    { id: 'carne_magra', nombre: 'Carne magra', categoria: 'proteinas' as const, caloriasPorcion: 250, porcion: '150g' },
    { id: 'tofu', nombre: 'Tofu', categoria: 'proteinas' as const, caloriasPorcion: 144, porcion: '100g' },
    { id: 'lentejas', nombre: 'Lentejas', categoria: 'proteinas' as const, caloriasPorcion: 116, porcion: '100g cocidas' }
  ],
  carbohidratos: [
    { id: 'arroz_integral', nombre: 'Arroz integral', categoria: 'carbohidratos' as const, caloriasPorcion: 111, porcion: '100g cocido' },
    { id: 'quinoa', nombre: 'Quinoa', categoria: 'carbohidratos' as const, caloriasPorcion: 120, porcion: '100g cocida' },
    { id: 'avena', nombre: 'Avena', categoria: 'carbohidratos' as const, caloriasPorcion: 389, porcion: '50g' },
    { id: 'papa', nombre: 'Papa o batata', categoria: 'carbohidratos' as const, caloriasPorcion: 86, porcion: '100g' },
    { id: 'pan_integral', nombre: 'Pan integral', categoria: 'carbohidratos' as const, caloriasPorcion: 265, porcion: '2 rebanadas' }
  ],
  grasasSaludables: [
    { id: 'aguacate', nombre: 'Aguacate', categoria: 'grasasSaludables' as const, caloriasPorcion: 160, porcion: '1/2 unidad' },
    { id: 'aceite_oliva', nombre: 'Aceite de oliva', categoria: 'grasasSaludables' as const, caloriasPorcion: 120, porcion: '1 cucharada' },
    { id: 'nueces', nombre: 'Nueces', categoria: 'grasasSaludables' as const, caloriasPorcion: 185, porcion: '30g' },
    { id: 'almendras', nombre: 'Almendras', categoria: 'grasasSaludables' as const, caloriasPorcion: 160, porcion: '20g' },
    { id: 'semillas_chia', nombre: 'Semillas de chia', categoria: 'grasasSaludables' as const, caloriasPorcion: 138, porcion: '2 cucharadas' }
  ],
  vegetales: [
    { id: 'brocoli', nombre: 'Brocoli', categoria: 'vegetales' as const, caloriasPorcion: 34, porcion: '100g' },
    { id: 'espinacas', nombre: 'Espinacas', categoria: 'vegetales' as const, caloriasPorcion: 23, porcion: '100g' },
    { id: 'zanahoria', nombre: 'Zanahoria', categoria: 'vegetales' as const, caloriasPorcion: 41, porcion: '1 unidad' },
    { id: 'tomate', nombre: 'Tomate', categoria: 'vegetales' as const, caloriasPorcion: 18, porcion: '1 unidad' },
    { id: 'pepino', nombre: 'Pepino', categoria: 'vegetales' as const, caloriasPorcion: 15, porcion: '1 unidad' },
    { id: 'pimiento', nombre: 'Pimiento', categoria: 'vegetales' as const, caloriasPorcion: 31, porcion: '1 unidad' }
  ],
  frutas: [
    { id: 'manzana', nombre: 'Manzana', categoria: 'frutas' as const, caloriasPorcion: 95, porcion: '1 unidad' },
    { id: 'platano', nombre: 'Platano', categoria: 'frutas' as const, caloriasPorcion: 105, porcion: '1 unidad' },
    { id: 'naranja', nombre: 'Naranja', categoria: 'frutas' as const, caloriasPorcion: 62, porcion: '1 unidad' },
    { id: 'fresas', nombre: 'Fresas', categoria: 'frutas' as const, caloriasPorcion: 32, porcion: '100g' },
    { id: 'kiwi', nombre: 'Kiwi', categoria: 'frutas' as const, caloriasPorcion: 61, porcion: '1 unidad' },
    { id: 'arandanos', nombre: 'Arandanos', categoria: 'frutas' as const, caloriasPorcion: 84, porcion: '100g' }
  ],
  lacteos: [
    { id: 'yogur_griego', nombre: 'Yogur griego', categoria: 'lacteos' as const, caloriasPorcion: 150, porcion: '200g' },
    { id: 'leche', nombre: 'Leche desnatada', categoria: 'lacteos' as const, caloriasPorcion: 85, porcion: '200ml' },
    { id: 'queso', nombre: 'Queso fresco', categoria: 'lacteos' as const, caloriasPorcion: 98, porcion: '50g' },
    { id: 'requeson', nombre: 'Requeson', categoria: 'lacteos' as const, caloriasPorcion: 98, porcion: '100g' }
  ]
};

export const categoriasInfo = {
  proteinas: { nombre: 'Proteinas', icono: '🥩', descripcion: 'Esenciales para la construccion muscular' },
  carbohidratos: { nombre: 'Carbohidratos', icono: '🍚', descripcion: 'Energia para tu dia a dia' },
  grasasSaludables: { nombre: 'Grasas Saludables', icono: '🥑', descripcion: 'Beneficiosas para el corazon y el cerebro' },
  vegetales: { nombre: 'Vegetales', icono: '🥦', descripcion: 'Vitaminas, minerales y fibra' },
  frutas: { nombre: 'Frutas', icono: '🍎', descripcion: 'Antioxidantes y fibra natural' },
  lacteos: { nombre: 'Lacteos', icono: '🥛', descripcion: 'Calcio y proteinas' }
};