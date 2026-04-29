import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mensaje, contexto } = body;

    console.log('Mensaje recibido:', mensaje);

    if (!mensaje) {
      return NextResponse.json(
        { success: false, error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mensajeLower = mensaje.toLowerCase();
    let respuesta = "";

    // Respuestas inteligentes basadas en el contexto
    if (mensajeLower.includes("cambiar") || mensajeLower.includes("reemplazar") || mensajeLower.includes("sustituir")) {
      respuesta = "Claro! Puedes hacer estos reemplazos saludables:\n\n• Pollo → Tofu, tempeh o seitán\n• Pescado → Lentejas o garbanzos\n• Huevos → Tofu revuelto o quinoa\n• Arroz → Coliflor picada o quinoa\n• Pan integral → Tortitas de arroz o lechuga\n• Leche de vaca → Leche de almendras, avena o soya\n\nQue alimento especifico te gustaria reemplazar?";
    } 
    else if (mensajeLower.includes("snack") || mensajeLower.includes("entre comidas")) {
      respuesta = "Snacks saludables (100-200 kcal):\n\n• 1 manzana con 10 almendras\n• 1 yogurt griego (200g)\n• 2 huevos duros\n• 1 platano con 1 cucharada de mantequilla de mani\n• Palitos de zanahoria y pepino con hummus\n• 1 puñado de nueces (30g)\n• 1 batido de proteina con agua\n\nElige opciones ricas en proteina para mejor saciedad.";
    }
    else if (mensajeLower.includes("prote") || mensajeLower.includes("proteina")) {
      respuesta = "Fuentes de proteina para tu plan:\n\nAnimal:\n• Pollo/pavo: 25-30g/100g\n• Pescado blanco: 20g/150g\n• Huevos: 6g/unidad\n• Yogur griego: 10g/100g\n\nVegetal:\n• Tofu: 8g/100g\n• Lentejas: 9g/100g\n• Quinoa: 4g/100g\n• Seitan: 25g/100g\n\nIntenta incluir proteina en todas las comidas!";
    }
    else if (mensajeLower.includes("fuera de casa") || mensajeLower.includes("restaurante")) {
      respuesta = "Tips para comer fuera:\n\n• Pide a la plancha, horno o vapor\n• Evita fritos, rebozados y salsas cremosas\n• Sustituye papas por ensalada o vegetales\n• Controla porciones (divide el plato)\n• Agua o té en lugar de refrescos\n• Si hay pan, limita a 1-2 piezas\n• Puedes pedir la mitad para llevar!";
    }
    else if (mensajeLower.includes("agua") || mensajeLower.includes("hidrat")) {
      respuesta = "Hidratacion optima:\n\n• Bebe 2-3 litros de agua al dia\n• Lleva botella reusable siempre\n• Un vaso de agua antes de cada comida\n• Infusiones y tisanas tambien cuentan\n• Agua con limon, pepino o menta\n• Evita jugos comerciales y gaseosas\n\nBuena hidratacion = mejor metabolismo!";
    }
    else if (mensajeLower.includes("porcion") || mensajeLower.includes("cantidad")) {
      respuesta = "Porciones recomendadas:\n\n• Proteinas: tamaño de tu palma\n• Carbohidratos: tamaño de tu puño\n• Vegetales: todo lo que quieras\n• Grasas: tamaño de tu pulgar\n• Frutas: 2-3 porciones al dia\n\nUsa tu mano como guia de porciones!";
    }
    else {
      respuesta = `Hola! Soy HealthyIA. Basado en tu objetivo, puedo ayudarte con:

• Modificaciones a tu plan alimenticio
• Reemplazos de alimentos
• Consejos para comer fuera de casa
• Porciones y cantidades
• Snacks saludables
• Hidratacion y habitos

¿En que tema especifico te gustaria que te ayude?`;
    }

    return NextResponse.json({ success: true, respuesta });

  } catch (error) {
    console.error('Error en chat-ia:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}