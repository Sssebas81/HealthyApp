import { NextRequest, NextResponse } from 'next/server';

// Base de datos de alimentos
const alimentosInfo: Record<string, any> = {
  'pollo': { nombre: 'Pollo', porcion: '150g (tamaño de tu palma)', calorias: 248, proteina: '31g', reemplazo: 'Pescado (150g), Huevos (4 unidades), Tofu (150g), Lentejas (1.5 tazas)' },
  'pescado': { nombre: 'Pescado blanco', porcion: '150g (tamaño de tu palma)', calorias: 180, proteina: '25g', reemplazo: 'Pollo (150g), Huevos (4 unidades), Tofu (150g)' },
  'huevos': { nombre: 'Huevos', porcion: '3-4 unidades', calorias: 240, proteina: '18g', reemplazo: 'Tofu revuelto (150g), Claras líquidas (200ml), Lentejas (1.5 tazas)' },
  'arroz_integral': { nombre: 'Arroz integral', porcion: '1 puño (100g cocido)', calorias: 111, reemplazo: 'Quinoa (100g), Papa (1 unidad), Coliflor picada (100g)' },
  'quinoa': { nombre: 'Quinoa', porcion: '1 puño (100g cocida)', calorias: 120, reemplazo: 'Arroz integral (100g), Papa (1 unidad)' },
  'papa': { nombre: 'Papa o batata', porcion: '1 unidad mediana', calorias: 160, reemplazo: 'Arroz integral (100g), Quinoa (100g)' },
  'manzana': { nombre: 'Manzana', porcion: '1 unidad', calorias: 95, fibra: '4.4g', reemplazo: 'Plátano, Pera, Naranja (1 unidad cada una)' },
  'platano': { nombre: 'Plátano', porcion: '1 unidad', calorias: 105, reemplazo: 'Manzana, Pera, Naranja (1 unidad cada una)' },
  'yogur_griego': { nombre: 'Yogur griego', porcion: '200g', calorias: 150, proteina: '20g', reemplazo: 'Yogur natural, Queso fresco (100g), Leche (200ml)' },
  'aguacate': { nombre: 'Aguacate', porcion: '1/2 unidad', calorias: 120, grasas: '11g', reemplazo: 'Aceite de oliva (1 cda), Nueces (30g), Almendras (30g)' },
  'nueces': { nombre: 'Nueces', porcion: '30g (10-12 nueces)', calorias: 196, grasas: '19g', reemplazo: 'Almendras (30g), Avellanas (30g)' },
  'almendras': { nombre: 'Almendras', porcion: '30g (20-22 almendras)', calorias: 173, reemplazo: 'Nueces (30g), Avellanas (30g)' }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mensaje, contexto } = body;
    const mensajeLower = mensaje.toLowerCase().trim();

    let respuesta = "";

    // ============ REEMPLAZOS ============
    if (mensajeLower.includes("reemplazar")) {
      let alimentoId = mensajeLower.replace("reemplazar", "").trim();
      
      // Buscar el alimento en la base de datos
      let alimento = null;
      for (const [key, value] of Object.entries(alimentosInfo)) {
        if (alimentoId.includes(key) || key.includes(alimentoId)) {
          alimento = { id: key, ...value };
          break;
        }
      }
      
      if (alimento) {
        respuesta = `🔄 **Cómo reemplazar ${alimento.nombre}:**\n\nPuedes cambiarlo por:\n• ${alimento.reemplazo}\n\n💡 Mantén la misma cantidad para igualar calorías.`;
      } else {
        respuesta = `🔄 **Reemplazos generales:**\n\n• Proteínas → intercambia entre pollo, pescado, huevos, tofu\n• Carbohidratos → intercambia entre arroz, quinoa, papa\n• Frutas → todas son intercambiables (1 pieza = 1 pieza)\n• Grasas → intercambia entre aguacate, aceite, frutos secos`;
      }
    }

    // ============ PORCIONES ============
    else if (mensajeLower.includes("porción") || mensajeLower.includes("porcion")) {
      let alimentoId = mensajeLower.replace("porción de", "").replace("porcion de", "").trim();
      
      let alimento = null;
      for (const [key, value] of Object.entries(alimentosInfo)) {
        if (alimentoId.includes(key) || key.includes(alimentoId)) {
          alimento = { id: key, ...value };
          break;
        }
      }
      
      if (alimento) {
        respuesta = `📏 **Porción de ${alimento.nombre}:**\n\n• Cantidad: ${alimento.porcion}\n• Calorías: ${alimento.calorias} kcal\n${alimento.proteina ? `• Proteína: ${alimento.proteina}\n` : ''}${alimento.fibra ? `• Fibra: ${alimento.fibra}\n` : ''}${alimento.grasas ? `• Grasas: ${alimento.grasas}\n` : ''}`;
      } else {
        respuesta = `📏 **Guía general de porciones:**\n\n• Proteína: 1-2 palmas (150-200g)\n• Carbohidratos: 1 puño (100-150g)\n• Vegetales: todo lo que quieras\n• Grasas: 1 pulgar (10-15g)\n• Frutas: 1 puño (1 unidad)`;
      }
    }

    // ============ SNACKS ============
    else if (mensajeLower.includes("snack")) {
      if (mensajeLower.includes("noche")) {
        respuesta = `🌙 **Snacks para la NOCHE (<150 kcal):**\n\n• 1 yogur griego (150 kcal)\n• 1 manzana + canela (95 kcal)\n• 2 claras de huevo (70 kcal)\n• 1 puñado de frutos rojos (50 kcal)`;
      }
      else if (mensajeLower.includes("pre-entreno") || mensajeLower.includes("preentreno")) {
        respuesta = `⚡ **Snacks PRE-ENTRENO (30-60 min antes):**\n\n• 1 plátano + 1 cda mantequilla de maní (220 kcal)\n• 1 tostada integral + mermelada (150 kcal)\n• 1 yogur + granola (200 kcal)`;
      }
      else if (mensajeLower.includes("proteico")) {
        respuesta = `💪 **Snacks PROTEICOS:**\n\n• Batido de proteína (120 kcal)\n• 2 huevos duros (140 kcal)\n• Yogur griego (150 kcal)\n• Queso fresco (100 kcal)`;
      }
      else {
        respuesta = `🍎 **Tipos de snacks:**\n\n• 🌙 Noche → Yogur, manzana, claras de huevo\n• ⚡ Pre-entreno → Plátano, tostada, dátiles\n• 💪 Proteicos → Batido, huevos duros, queso\n\n¿Para qué momento necesitas el snack?`;
      }
    }

    // ============ TIPS ============
    else if (mensajeLower.includes("fuera de casa") || mensajeLower.includes("restaurante")) {
      respuesta = `🍽️ **Tips para comer FUERA DE CASA:**\n\n✅ Pide a la plancha, horno o vapor\n✅ Salsas y aderezos APARTE\n✅ Verduras como guarnición\n✅ Agua o infusiones\n✅ Pide la mitad para llevar\n\n❌ Evita fritos, rebozados y salsas cremosas`;
    }
    else if (mensajeLower.includes("antojos")) {
      respuesta = `🍬 **Cómo controlar los ANTOJOS:**\n\n1️⃣ Bebe 1 vaso de agua y espera 10 min\n2️⃣ Come algo saludable (fruta, yogur)\n3️⃣ Distráete (camina, llama a alguien)\n4️⃣ Si te das el gusto, controla la porción`;
    }
    else if (mensajeLower.includes("hidratar") || mensajeLower.includes("agua")) {
      respuesta = `💧 **Hidratación recomendada:**\n\n• 2-3 litros al día (8-12 vasos)\n• 2 vasos al despertar\n• 1 vaso antes de cada comida\n• Durante ejercicio: +500ml por hora`;
    }
    else if (mensajeLower.includes("comer de más")) {
      respuesta = `💪 **Si comiste de más:**\n\n• No te castigues ni te saltes comidas\n• Bebe más agua\n• Vuelve a tu plan en la siguiente comida\n• Un día no define tu progreso`;
    }
    else {
      respuesta = `🌟 **HealthyIA - Tu asistente nutricional** 🌟\n\nElige una opción:\n\n🔄 **Reemplazos** → ¿Qué alimento quieres cambiar?\n📏 **Porciones** → ¿De qué alimento quieres la medida?\n🍎 **Snacks** → ¿Para qué momento?\n💡 **Tips** → ¿Qué consejo necesitas?`;
    }

    return NextResponse.json({ success: true, respuesta });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: true, 
      respuesta: "Lo siento, hubo un error. Por favor, intenta de nuevo. 🙏" 
    });
  }
}