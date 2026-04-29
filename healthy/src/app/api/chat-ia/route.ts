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

    await new Promise(resolve => setTimeout(resolve, 500));

    const mensajeLower = mensaje.toLowerCase();
    let respuesta = "";

    // Sistema de respuestas mejorado y más amplio
    
    // 1. Preguntas sobre reemplazos de alimentos
    if (mensajeLower.includes("reemplazar") || mensajeLower.includes("sustituir") || mensajeLower.includes("cambiar")) {
      if (mensajeLower.includes("pollo") || mensajeLower.includes("carne")) {
        respuesta = `🔄 **Reemplazos para carnes y proteinas:**

🐔 **Pollo** → Puedes cambiarlo por:
• Pavo (similar textura y proteina)
• Tofu o tempeh (opcion vegetariana)
• Pescado blanco (merluza, lenguado)
• Setas o portobellos (textura similar)
• Seitan (alto en proteina)

🥩 **Carne roja** → Alternativas:
• Carne magra de cerdo
• Tofu marinado
• Lentejas o garbanzos (para guisos)
• Quinoa (proteina completa)

💡 **Consejo:** Ajusta las porciones para mantener las calorias. Generalmente 150g de proteina es una buena porcion.

¿Te gustaria saber sobre otro alimento especifico?`;
      } 
      else if (mensajeLower.includes("arroz")) {
        respuesta = `🍚 **Alternativas al arroz:**

• Quinoa (mas proteina, similar textura)
• Coliflor picada (bajas calorias)
• Cuscus integral
• Trigo burgol
• Mijo
• Amaranto

📊 **Comparativa nutricional (por 100g cocido):**
• Arroz integral: 111 kcal | 2.6g proteina
• Quinoa: 120 kcal | 4.1g proteina  
• Coliflor: 25 kcal | 2g proteina

¿Quieres sugerencias para otros carbohidratos?`;
      }
      else if (mensajeLower.includes("huevo") || mensajeLower.includes("huevos")) {
        respuesta = `🥚 **Reemplazos para huevos:**

En preparaciones:
• 1 cucharada de semillas de chia + 3 cucharadas de agua
• 1/4 taza de puré de manzana
• 1/4 taza de puré de platano
• Tofu revuelto (para huevos revueltos)
• Aquafaba (agua de garbanzos)

En desayunos:
• Tofu revuelto con cúrcuma
• Yogur griego con semillas
• Batido de proteina vegetal

¿Te interesa alguna opcion en particular?`;
      }
      else if (mensajeLower.includes("leche") || mensajeLower.includes("lacteo")) {
        respuesta = `🥛 **Alternativas a los lacteos:**

Leches vegetales:
• Leche de almendras (25-30 kcal/100ml)
• Leche de soya (40-50 kcal/100ml) - mas proteina
• Leche de avena (45-55 kcal/100ml)
• Leche de coco (20-30 kcal/100ml) - mas ligera

Yogures:
• Yogur de coco
• Yogur de soya
• Yogur de almendras

Quesos:
• Queso vegano de anacardos
• Levadura nutricional (sabor a queso)
• Tofu firme desmenuzado

¿Cual te gustaria probar?`;
      }
      else {
        respuesta = `🔄 **Guia general de reemplazos:**

🍗 **Proteinas** ↔️ Otra proteina (pollo ↔️ pescado ↔️ tofu)
🍚 **Carbohidratos** ↔️ Otro carbohidrato (arroz ↔️ quinoa ↔️ papa)
🥬 **Vegetales** ↔️ Cualquier vegetal verde
🥑 **Grasas saludables** ↔️ Otra grasa (aguacate ↔️ aceite de oliva ↔️ frutos secos)

✨ **Tips:**
• Manten el mismo grupo de alimento
• Ajusta la cantidad para igualar calorias
• Si eliminas un grupo, compensa con otro

¿Que alimento especifico quieres reemplazar?`;
      }
    }
    
    // 2. Preguntas sobre porciones
    else if (mensajeLower.includes("porcion") || mensajeLower.includes("cuanto") || mensajeLower.includes("cantidad")) {
      respuesta = `📏 **Guia de porciones visual:**

Usa tu mano como guia:

✋ **Proteinas** (pollo, pescado, carne):
• Tamaño de tu palma = ~150g
• Grosor del dedo meñique

👊 **Carbohidratos** (arroz, pasta, papa):
• Tamaño de tu puño cerrado = ~150g cocidos

👍 **Grasas** (aguacate, frutos secos):
• Tamaño de tu pulgar = ~30g o 1 cucharada

🥬 **Vegetales**:
• Todo lo que quieras! (bajas calorias)

🍎 **Frutas**:
• Tamaño de tu puño = 1 porcion

📊 **Para tu objetivo de ${contexto.objetivo === 'perder_peso' ? 'perder peso' : contexto.objetivo === 'masa_muscular' ? 'ganar masa muscular' : 'recomposicion'}:**
• Proteina: 1-2 palmas por comida
• Carbohidratos: ${contexto.objetivo === 'perder_peso' ? '1/2 a 1 puño' : '1-2 puños'}
• Grasas: 1-2 pulgares

¿Quieres ejemplos mas especificos?`;
    }
    
    // 3. Preguntas sobre snacks
    else if (mensajeLower.includes("snack") || mensajeLower.includes("entre comidas") || mensajeLower.includes("merienda")) {
      respuesta = `🍎 **Snacks saludables (100-200 kcal):**

⚡ **Pre-entreno:**
• 1 platano + 1 cucharada mantequilla de mani (180 kcal)
• 2 higos + 10 almendras (150 kcal)
• Tostada integral + aguacate (160 kcal)

🌙 **Post-entreno / Noche:**
• Yogur griego + frutos rojos (150 kcal)
• 2 huevos duros + zanahoria (140 kcal)
• Batido de proteina con agua (120 kcal)

💼 **Para la oficina/estudio:**
• 1 manzana + 1 cucharada crema de mani (150 kcal)
• Palitos de apio + hummus (100 kcal)
• 30g frutos secos + 1 fruta deshidratada (180 kcal)

🕒 **Horarios ideales:**
• Media mañana (10-11 am)
• Media tarde (4-5 pm)

¿Te gustaria mas opciones para alguna ocasion especifica?`;
    }
    
    // 4. Comidas fuera de casa
    else if (mensajeLower.includes("fuera de casa") || mensajeLower.includes("restaurante") || mensajeLower.includes("comer fuera")) {
      respuesta = `🍽️ **Guia para comer fuera de casa:**

🏪 **Comida rapida:**
• Elige opciones a la plancha o parrilla
• Evita fritos, empanizados y salsas cremosas
• Cambia las papas por ensalada
• Compartir las porciones grandes

🍜 **Restaurante casual:**
• Pide aderezos y salsas aparte
• Prefiere platos al horno, vapor o plancha
• Si hay pan, limita a 1-2 piezas
• Agua o infusion en lugar de refrescos

🍕 **Pizza / Hamburguesas:**
• Elige masa integral o delgada
• Doble proteina en lugar de queso extra
• Acompaña con ensalada
• Controla las porciones (come la mitad)

✨ **Tips generales:**
• No llegues con mucha hambre
• Toma agua antes y durante la comida
• Mastica despacio y disfruta
• No te sientas culpable - un desliz no arruina tu progreso!

¿Tienes un tipo de restaurante en mente?`;
    }
    
    // 5. Motivación y dudas comunes
    else if (mensajeLower.includes("motiv") || mensajeLower.includes("animo") || mensajeLower.includes("trampa")) {
      respuesta = `💪 **Manteniendo la motivacion:**

🎯 **Es normal tener altibajos!**

✅ **Recordatorios positivos:**
• Un dia no define tu progreso
• Cada comida es una nueva oportunidad
• Pequeños cambios = grandes resultados

📝 **Estrategias practicas:**
• Planifica tus comidas con anticipacion
• Prepara snacks saludables disponibles
• Registra tus logros (no solo el peso)
• Busca un compañero de viaje

🚀 **Si tuviste un exceso:**
• No te castigues ni "compenses" saltando comidas
• Vuelve a tu plan en la siguiente comida
• Bebe mas agua
• Retoma tu actividad fisica

💬 **Recuerda:** La consistencia es mas importante que la perfeccion. ¿Que te preocupa en particular?`;
    }
    
    // 6. Hidratación
    else if (mensajeLower.includes("agua") || mensajeLower.includes("hidrat") || mensajeLower.includes("beber")) {
      respuesta = `💧 **Hidratacion optima:**

📊 **Cantidad recomendada:**
• 2-3 litros al dia (8-12 vasos)
• +500ml por hora de ejercicio

⏰ **Mejores momentos:**
• 1 vaso al despertar
• 30 min antes de cada comida
• Antes, durante y despues del ejercicio
• Antes de dormir (1 vaso)

🥤 **Otras fuentes de hidratacion:**
• Infusiones y tés sin azucar
• Agua con limon, pepino o menta
• Caldos vegetales
• Frutas con alto contenido de agua (sandia, melon)

⚠️ **Señales de deshidratacion:**
• Sed intensa
• Orina oscura
• Dolor de cabeza
• Fatiga

💡 **Tips:** Lleva siempre una botella reusable. ¿Necesitas ayuda para crear un plan de hidratacion?`;
    }
    
    // 7. Pregunta por defecto (respuesta general)
    else {
      respuesta = `🌟 **¡Excelente pregunta!** 🌟

Basado en tu plan de ${contexto.calorias} kcal/dia para ${contexto.objetivo === 'perder_peso' ? 'perder peso' : contexto.objetivo === 'masa_muscular' ? 'ganar masa muscular' : 'recomposicion corporal'}:

📌 **Lo mas importante:**
• Consistencia > Perfeccion
• Escucha a tu cuerpo
• Ajusta segun tu energia y actividad

💡 **¿Sabias que?**
• Comer proteina en cada comida ayuda a mantener musculo
• Los vegetales de hoja verde son tus aliados (bajas calorias, altos nutrientes)
• Dormir bien es clave para la recuperacion y control de peso

🎯 **Puedo ayudarte con:**
• Modificaciones a tu plan actual
• Ideas de comidas rapidas
• Como manejar antojos
• Estrategias para comer fuera
• Calculo de macronutrientes

¿Sobre que tema te gustaria profundizar?`;
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