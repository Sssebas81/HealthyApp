import { NextRequest, NextResponse } from 'next/server';

// Mapeo completo de alimentos con sus propiedades
const alimentosData: Record<string, any> = {
  // Proteinas
  'pollo': { nombre: 'Pollo a la plancha', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 248 },
  'pescado': { nombre: 'Pescado blanco', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 180 },
  'huevos': { nombre: 'Huevos', tipo: 'proteina', porcionTipica: '2 unidades', caloriasPorcion: 155 },
  'carne_magra': { nombre: 'Carne magra', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 250 },
  'tofu': { nombre: 'Tofu', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 216 },
  'lentejas': { nombre: 'Lentejas', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 174 },
  
  // Carbohidratos
  'arroz_integral': { nombre: 'Arroz integral', tipo: 'carbohidrato', porcionTipica: '100g', caloriasPorcion: 111 },
  'quinoa': { nombre: 'Quinoa', tipo: 'carbohidrato', porcionTipica: '100g', caloriasPorcion: 120 },
  'avena': { nombre: 'Avena', tipo: 'carbohidrato', porcionTipica: '50g', caloriasPorcion: 195 },
  'papa': { nombre: 'Papa o batata', tipo: 'carbohidrato', porcionTipica: '150g', caloriasPorcion: 129 },
  'pan_integral': { nombre: 'Pan integral', tipo: 'carbohidrato', porcionTipica: '2 rebanadas', caloriasPorcion: 160 },
  
  // Grasas saludables
  'aguacate': { nombre: 'Aguacate', tipo: 'grasa', porcionTipica: '1/2 unidad', caloriasPorcion: 120 },
  'aceite_oliva': { nombre: 'Aceite de oliva', tipo: 'grasa', porcionTipica: '1 cucharada', caloriasPorcion: 120 },
  'nueces': { nombre: 'Nueces', tipo: 'grasa', porcionTipica: '30g', caloriasPorcion: 196 },
  'almendras': { nombre: 'Almendras', tipo: 'grasa', porcionTipica: '30g', caloriasPorcion: 173 },
  'semillas_chia': { nombre: 'Semillas de chia', tipo: 'grasa', porcionTipica: '2 cucharadas', caloriasPorcion: 138 },
  
  // Vegetales (bajas calorías)
  'brocoli': { nombre: 'Brocoli', tipo: 'vegetal', porcionTipica: '100g', caloriasPorcion: 34 },
  'espinacas': { nombre: 'Espinacas', tipo: 'vegetal', porcionTipica: '100g', caloriasPorcion: 23 },
  'zanahoria': { nombre: 'Zanahoria', tipo: 'vegetal', porcionTipica: '1 unidad', caloriasPorcion: 41 },
  'tomate': { nombre: 'Tomate', tipo: 'vegetal', porcionTipica: '1 unidad', caloriasPorcion: 18 },
  'pepino': { nombre: 'Pepino', tipo: 'vegetal', porcionTipica: '1 unidad', caloriasPorcion: 15 },
  'pimiento': { nombre: 'Pimiento', tipo: 'vegetal', porcionTipica: '1 unidad', caloriasPorcion: 31 },
  
  // Frutas
  'manzana': { nombre: 'Manzana', tipo: 'fruta', porcionTipica: '1 unidad', caloriasPorcion: 95 },
  'platano': { nombre: 'Platano', tipo: 'fruta', porcionTipica: '1 unidad', caloriasPorcion: 105 },
  'naranja': { nombre: 'Naranja', tipo: 'fruta', porcionTipica: '1 unidad', caloriasPorcion: 62 },
  'fresas': { nombre: 'Fresas', tipo: 'fruta', porcionTipica: '100g', caloriasPorcion: 32 },
  'kiwi': { nombre: 'Kiwi', tipo: 'fruta', porcionTipica: '1 unidad', caloriasPorcion: 61 },
  'arandanos': { nombre: 'Arandanos', tipo: 'fruta', porcionTipica: '100g', caloriasPorcion: 57 },
  
  // Lácteos
  'yogur_griego': { nombre: 'Yogur griego', tipo: 'lacteo', porcionTipica: '200g', caloriasPorcion: 150 },
  'leche': { nombre: 'Leche desnatada', tipo: 'lacteo', porcionTipica: '200ml', caloriasPorcion: 84 },
  'queso': { nombre: 'Queso fresco', tipo: 'lacteo', porcionTipica: '50g', caloriasPorcion: 98 },
  'requeson': { nombre: 'Requeson', tipo: 'lacteo', porcionTipica: '100g', caloriasPorcion: 98 }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { objetivo, preferencias, user } = body;

    console.log('Generando plan con preferencias del usuario:', preferencias);

    if (!objetivo || !user) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    if (!preferencias || preferencias.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No hay preferencias alimenticias seleccionadas' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calcular calorías base según objetivo
    let caloriasBase = 2000;
    if (objetivo === 'perder_peso') {
      caloriasBase = 1800;
    } else if (objetivo === 'masa_muscular') {
      caloriasBase = 2500;
    } else {
      caloriasBase = 2200;
    }

    // Filtrar SOLO los alimentos que el usuario seleccionó
    const alimentosSeleccionados = preferencias
      .map((id: string) => alimentosData[id])
      .filter((a: any) => a !== undefined);

    console.log('Alimentos disponibles del usuario:', alimentosSeleccionados.map((a: any) => a.nombre));

    // Separar por tipo
    const proteinas = alimentosSeleccionados.filter((a: any) => a.tipo === 'proteina');
    const carbohidratos = alimentosSeleccionados.filter((a: any) => a.tipo === 'carbohidrato');
    const grasas = alimentosSeleccionados.filter((a: any) => a.tipo === 'grasa');
    const vegetales = alimentosSeleccionados.filter((a: any) => a.tipo === 'vegetal');
    const frutas = alimentosSeleccionados.filter((a: any) => a.tipo === 'fruta');
    const lacteos = alimentosSeleccionados.filter((a: any) => a.tipo === 'lacteo');

    // Función para obtener un alimento aleatorio de un array
    const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    // Asignar alimentos para cada comida (priorizando variedad)
    let proteinaDesayuno, proteinaAlmuerzo, proteinaCena;
    let carbAlmuerzo, carbCena;
    let vegetalAlmuerzo, vegetalCena;
    let frutaSnack, lacteoSnack;

    if (proteinas.length > 0) {
      proteinaDesayuno = proteinas[0];
      proteinaAlmuerzo = proteinas.length > 1 ? proteinas[1] : proteinas[0];
      proteinaCena = proteinas.length > 2 ? proteinas[2] : proteinas[0];
    }

    if (carbohidratos.length > 0) {
      carbAlmuerzo = carbohidratos[0];
      carbCena = carbohidratos.length > 1 ? carbohidratos[1] : carbohidratos[0];
    }

    if (vegetales.length > 0) {
      vegetalAlmuerzo = vegetales[0];
      vegetalCena = vegetales.length > 1 ? vegetales[1] : vegetales[0];
    }

    if (frutas.length > 0) {
      frutaSnack = frutas[0];
    }

    if (lacteos.length > 0) {
      lacteoSnack = lacteos[0];
    }

    // Construir el plan usando SOLO los alimentos del usuario
    const caloriasDesayuno = Math.round(caloriasBase * 0.25);
    const caloriasAlmuerzo = Math.round(caloriasBase * 0.35);
    const caloriasCena = Math.round(caloriasBase * 0.3);
    const caloriasSnacks = Math.round(caloriasBase * 0.1);

    // Construir desayuno
    let desayunoTexto = '';
    if (proteinaDesayuno) {
      desayunoTexto += `${proteinaDesayuno.porcionTipica} de ${proteinaDesayuno.nombre}`;
    }
    if (lacteos.length > 0 && !desayunoTexto.includes('Yogur')) {
      desayunoTexto += ` + ${lacteos[0].porcionTipica} de ${lacteos[0].nombre}`;
    }
    if (frutas.length > 0 && !desayunoTexto.includes(frutaSnack?.nombre)) {
      desayunoTexto += ` + 1 ${frutaSnack.nombre}`;
    }
    if (carbohidratos.length > 0 && objetivo === 'masa_muscular') {
      desayunoTexto += ` + ${carbohidratos[0].porcionTipica} de ${carbohidratos[0].nombre}`;
    }

    // Construir almuerzo
    let almuerzoTexto = '';
    if (proteinaAlmuerzo) {
      almuerzoTexto += `${proteinaAlmuerzo.porcionTipica} de ${proteinaAlmuerzo.nombre}`;
    }
    if (carbAlmuerzo) {
      almuerzoTexto += ` + ${carbAlmuerzo.porcionTipica} de ${carbAlmuerzo.nombre}`;
    }
    if (vegetalAlmuerzo) {
      almuerzoTexto += ` + ${vegetalAlmuerzo.porcionTipica} de ${vegetalAlmuerzo.nombre}`;
    }
    if (grasas.length > 0) {
      almuerzoTexto += ` + 1 cucharada de aceite de oliva`;
    }

    // Construir cena
    let cenaTexto = '';
    if (proteinaCena) {
      cenaTexto += `${proteinaCena.porcionTipica} de ${proteinaCena.nombre}`;
    }
    if (carbCena && objetivo !== 'perder_peso') {
      cenaTexto += ` + ${carbCena.porcionTipica} de ${carbCena.nombre}`;
    }
    if (vegetalCena) {
      cenaTexto += ` + ${vegetalCena.porcionTipica} de ${vegetalCena.nombre}`;
    }
    if (grasas.length > 0 && objetivo === 'perder_peso') {
      cenaTexto += ` + 1/2 aguacate o 1 cucharada de aceite de oliva`;
    }

    // Construir snacks
    let snacksTexto = '';
    if (frutaSnack && lacteoSnack) {
      snacksTexto = `Opcion 1: 1 ${frutaSnack.nombre}\nOpcion 2: ${lacteoSnack.porcionTipica} de ${lacteoSnack.nombre}`;
    } else if (frutaSnack) {
      snacksTexto = `Opcion 1: 1 ${frutaSnack.nombre}\nOpcion 2: 1 puñado de frutos secos`;
    } else if (lacteoSnack) {
      snacksTexto = `Opcion 1: ${lacteoSnack.porcionTipica} de ${lacteoSnack.nombre}\nOpcion 2: 1 fruta de temporada`;
    } else {
      snacksTexto = `Opcion 1: 1 manzana\nOpcion 2: 1 yogur natural\nOpcion 3: 10 almendras`;
    }

    // Generar recomendaciones personalizadas
    const alimentosDisponiblesList = alimentosSeleccionados.map((a: any) => a.nombre).join(', ');
    
    const recomendaciones = `
Basado en tu objetivo de ${objetivo === 'perder_peso' ? 'perder peso' : objetivo === 'masa_muscular' ? 'ganar masa muscular' : 'recomposicion corporal'}:

• Este plan ha sido creado usando SOLO los alimentos que seleccionaste en tus preferencias
• Alimentos disponibles en tu plan: ${alimentosDisponiblesList}
• Distribuye tus comidas cada 3-4 horas
• Bebe 2-3 litros de agua al dia
• Prioriza alimentos enteros y minimamente procesados
• Puedes intercambiar alimentos del mismo grupo (proteina por proteina, carbohidrato por carbohidrato)

${proteinas.length === 0 ? '⚠️ No seleccionaste proteinas - considera agregar pollo, pescado, huevos o legumbres' : ''}
${carbohidratos.length === 0 ? '⚠️ No seleccionaste carbohidratos - considera agregar arroz, quinoa, papa o avena' : ''}
${vegetales.length === 0 ? '⚠️ No seleccionaste vegetales - considera agregar brocoli, espinacas o zanahoria' : ''}
    `;

    const plan = {
      id: Date.now(),
      userId: user.id,
      fechaCreacion: new Date().toISOString(),
      objetivo: objetivo,
      caloriasDiarias: caloriasBase,
      desayuno: `${desayunoTexto || 'Yogur griego + frutas'} (${caloriasDesayuno} kcal)`,
      almuerzo: `${almuerzoTexto} (${caloriasAlmuerzo} kcal)`,
      cena: `${cenaTexto} (${caloriasCena} kcal)`,
      snacks: snacksTexto,
      recomendaciones: recomendaciones,
      preferenciasUsadas: preferencias,
      activo: true
    };

    console.log('Plan generado exitosamente usando preferencias del usuario');

    return NextResponse.json({ success: true, plan });

  } catch (error) {
    console.error('Error en generate-plan:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}