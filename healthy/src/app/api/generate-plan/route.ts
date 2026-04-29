import { NextRequest, NextResponse } from 'next/server';
import type { PlanContenido } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { objetivo, preferencias, user } = body;

    console.log('Recibida solicitud para generar plan:', { objetivo, preferencias, user });

    // Validar que tenemos los datos necesarios
    if (!objetivo || !user) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calcular calorías base según objetivo
    let caloriasBase = 2000;
    let planContenido: PlanContenido = {
      desayuno: '',
      almuerzo: '',
      cena: '',
      snacks: ''
    };

    if (objetivo === 'perder_peso') {
      caloriasBase = 1800;
      planContenido = {
        desayuno: "3 claras de huevo revueltas + 1 rebanada de pan integral + 1/2 aguacate",
        almuerzo: "150g pechuga de pollo a la plancha + 100g quinoa + ensalada verde",
        cena: "200g pescado blanco + verduras al vapor + 1 cucharada de aceite de oliva",
        snacks: "1 manzana o 10 almendras"
      };
    } else if (objetivo === 'masa_muscular') {
      caloriasBase = 2500;
      planContenido = {
        desayuno: "4 claras + 2 huevos enteros + 50g avena + 1 banana",
        almuerzo: "200g carne magra + 200g arroz integral + 100g brocoli",
        cena: "150g salmon + 300g batata + espinacas",
        snacks: "1 batido de proteina + 1 puñado de nueces"
      };
    } else {
      caloriasBase = 2200;
      planContenido = {
        desayuno: "Yogur griego + 40g granola + frutos rojos",
        almuerzo: "150g pavo + quinoa + vegetales mixtos",
        cena: "Tofu salteado con vegetales + 100g arroz integral",
        snacks: "1 pera + 1 cucharada de mantequilla de mani"
      };
    }

    // Obtener nombres de alimentos preferidos
    const alimentosData = await getAlimentosNombres(preferencias || []);

    // Generar recomendaciones personalizadas
    const recomendaciones = `
      Basado en tu objetivo de ${objetivo === 'perder_peso' ? 'perder peso' : objetivo === 'masa_muscular' ? 'ganar masa muscular' : 'recomposicion corporal'}:
      • Distribuye tus comidas cada 3-4 horas
      • Bebe 2-3 litros de agua al dia
      • Prioriza alimentos enteros y minimamente procesados
      • Ajusta las porciones segun tu nivel de actividad fisica
      ${alimentosData.length > 0 ? `• Aprovecha los alimentos que ya tienes: ${alimentosData.join(', ')}` : ''}
    `;

    const plan = {
      id: Date.now(),
      userId: user.id,
      fechaCreacion: new Date().toISOString(),
      objetivo: objetivo,
      caloriasDiarias: caloriasBase,
      desayuno: `${planContenido.desayuno} (${Math.round(caloriasBase * 0.25)} kcal)`,
      almuerzo: `${planContenido.almuerzo} (${Math.round(caloriasBase * 0.35)} kcal)`,
      cena: `${planContenido.cena} (${Math.round(caloriasBase * 0.3)} kcal)`,
      snacks: `${planContenido.snacks} (${Math.round(caloriasBase * 0.1)} kcal)`,
      recomendaciones: recomendaciones,
      preferenciasUsadas: preferencias || [],
      activo: true
    };

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

// Función auxiliar para obtener nombres de alimentos
async function getAlimentosNombres(preferenciasIds: string[]) {
  if (!preferenciasIds.length) return [];
  
  // Mapeo básico de IDs a nombres
  const nombresMap: Record<string, string> = {
    'pollo': 'Pollo',
    'pescado': 'Pescado',
    'huevos': 'Huevos',
    'carne_magra': 'Carne magra',
    'tofu': 'Tofu',
    'lentejas': 'Lentejas',
    'arroz_integral': 'Arroz integral',
    'quinoa': 'Quinoa',
    'avena': 'Avena',
    'papa': 'Papa o batata',
    'pan_integral': 'Pan integral',
    'brocoli': 'Brocoli',
    'espinacas': 'Espinacas',
    'zanahoria': 'Zanahoria',
    'tomate': 'Tomate',
    'pepino': 'Pepino',
    'pimiento': 'Pimiento',
    'manzana': 'Manzana',
    'platano': 'Platano',
    'naranja': 'Naranja',
    'fresas': 'Fresas',
    'kiwi': 'Kiwi',
    'arandanos': 'Arandanos',
    'aguacate': 'Aguacate',
    'aceite_oliva': 'Aceite de oliva',
    'nueces': 'Nueces',
    'almendras': 'Almendras',
    'semillas_chia': 'Semillas de chia',
    'yogur_griego': 'Yogur griego',
    'leche': 'Leche desnatada',
    'queso': 'Queso fresco',
    'requeson': 'Requeson'
  };
  
  return preferenciasIds.map(id => nombresMap[id] || id).filter(Boolean);
}