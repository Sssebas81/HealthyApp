import { NextRequest, NextResponse } from 'next/server';

// Mapeo de alimentos con sus propiedades
const alimentosData: Record<string, any> = {
  'pollo': { nombre: 'Pollo a la plancha', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 248 },
  'pescado': { nombre: 'Pescado blanco', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 180 },
  'huevos': { nombre: 'Huevos', tipo: 'proteina', porcionTipica: '2 unidades', caloriasPorcion: 155 },
  'carne_magra': { nombre: 'Carne magra', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 250 },
  'tofu': { nombre: 'Tofu', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 216 },
  'lentejas': { nombre: 'Lentejas', tipo: 'proteina', porcionTipica: '150g', caloriasPorcion: 174 },
  'arroz_integral': { nombre: 'Arroz integral', tipo: 'carbohidrato', porcionTipica: '100g', caloriasPorcion: 111 },
  'quinoa': { nombre: 'Quinoa', tipo: 'carbohidrato', porcionTipica: '100g', caloriasPorcion: 120 },
  'avena': { nombre: 'Avena', tipo: 'carbohidrato', porcionTipica: '50g', caloriasPorcion: 195 },
  'papa': { nombre: 'Papa o batata', tipo: 'carbohidrato', porcionTipica: '150g', caloriasPorcion: 129 },
  'brocoli': { nombre: 'Brócoli', tipo: 'vegetal', porcionTipica: '100g', caloriasPorcion: 34 },
  'espinacas': { nombre: 'Espinacas', tipo: 'vegetal', porcionTipica: '100g', caloriasPorcion: 23 },
  'aguacate': { nombre: 'Aguacate', tipo: 'grasa', porcionTipica: '1/2 unidad', caloriasPorcion: 120 },
  'manzana': { nombre: 'Manzana', tipo: 'fruta', porcionTipica: '1 unidad', caloriasPorcion: 95 },
  'yogur_griego': { nombre: 'Yogur griego', tipo: 'lacteo', porcionTipica: '200g', caloriasPorcion: 150 }
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

    // Separar por tipo
    const proteinas = alimentosSeleccionados.filter((a: any) => a.tipo === 'proteina');
    const carbohidratos = alimentosSeleccionados.filter((a: any) => a.tipo === 'carbohidrato');
    const vegetales = alimentosSeleccionados.filter((a: any) => a.tipo === 'vegetal');
    const frutas = alimentosSeleccionados.filter((a: any) => a.tipo === 'fruta');
    const lacteos = alimentosSeleccionados.filter((a: any) => a.tipo === 'lacteo');

    // Si no hay suficientes alimentos, usar defaults solo para completar
    const proteinasUsar = proteinas.length > 0 ? proteinas : [{ nombre: 'Proteína de tu elección', porcionTipica: '150g' }];
    const carbohidratosUsar = carbohidratos.length > 0 ? carbohidratos : [{ nombre: 'Carbohidrato de tu elección', porcionTipica: '100g' }];
    const vegetalesUsar = vegetales.length > 0 ? vegetales : [{ nombre: 'Vegetales', porcionTipica: '100g' }];

    // Asignar alimentos para cada comida
    const proteinaDesayuno = proteinasUsar[0];
    const proteinaAlmuerzo = proteinasUsar.length > 1 ? proteinasUsar[1] : proteinasUsar[0];
    const proteinaCena = proteinasUsar.length > 2 ? proteinasUsar[2] : proteinasUsar[0];
    const carbAlmuerzo = carbohidratosUsar[0];
    const carbCena = carbohidratosUsar.length > 1 ? carbohidratosUsar[1] : carbohidratosUsar[0];
    const vegetalAlmuerzo = vegetalesUsar[0];
    const vegetalCena = vegetalesUsar.length > 1 ? vegetalesUsar[1] : vegetalesUsar[0];

    // Construir el plan usando SOLO los alimentos del usuario
    const desayuno = `${proteinaDesayuno.porcionTipica} de ${proteinaDesayuno.nombre}${frutas.length > 0 ? ` + 1 ${frutas[0].nombre}` : ''}${lacteos.length > 0 ? ` + ${lacteos[0].porcionTipica} de ${lacteos[0].nombre}` : ''}`;
    const almuerzo = `${proteinaAlmuerzo.porcionTipica} de ${proteinaAlmuerzo.nombre} + ${carbAlmuerzo.porcionTipica} de ${carbAlmuerzo.nombre} + ${vegetalAlmuerzo.porcionTipica} de ${vegetalAlmuerzo.nombre}`;
    const cena = `${proteinaCena.porcionTipica} de ${proteinaCena.nombre} + ${carbCena.porcionTipica} de ${carbCena.nombre} + ${vegetalCena.porcionTipica} de ${vegetalCena.nombre}`;
    const snacks = frutas.length > 0 ? `1 ${frutas[0].nombre} o ${lacteos.length > 0 ? lacteos[0].porcionTipica + ' de ' + lacteos[0].nombre : '10 almendras'}` : '1 fruta o yogur';

    const recomendaciones = `Este plan ha sido creado usando SOLO los alimentos que seleccionaste en tus preferencias.
• Distribuye tus comidas cada 3-4 horas
• Bebe 2-3 litros de agua al día
• Puedes intercambiar alimentos del mismo grupo
${proteinas.length === 0 ? '⚠️ Te sugerimos agregar proteínas (pollo, pescado, huevos) para un plan más balanceado' : ''}`;

    const plan = {
      id: Date.now(),
      userId: user.id,
      fechaCreacion: new Date().toISOString(),
      objetivo: objetivo,
      caloriasDiarias: caloriasBase,
      desayuno: `${desayuno} (${Math.round(caloriasBase * 0.25)} kcal)`,
      almuerzo: `${almuerzo} (${Math.round(caloriasBase * 0.35)} kcal)`,
      cena: `${cena} (${Math.round(caloriasBase * 0.3)} kcal)`,
      snacks: snacks,
      recomendaciones: recomendaciones,
      preferenciasUsadas: preferencias,
      activo: true
    };

    console.log('Plan generado exitosamente usando preferencias del usuario');

    return NextResponse.json({ success: true, plan });

  } catch (error) {
    console.error('Error generate-plan:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar el plan' },
      { status: 500 }
    );
  }
}