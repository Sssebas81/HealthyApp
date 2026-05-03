import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mensaje, contexto } = body;

    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          respuesta: "Error: No se ha configurado la API Key de Gemini.",
        },
        { status: 500 },
      );
    }

    const systemInstruction = `Eres "HealthyIA", un experto asistente nutricional. 
TU ÚNICO PROPÓSITO ES RESPONDER PREGUNTAS Y DAR CONSULTORÍA SOBRE ALIMENTACIÓN, NUTRICIÓN Y DIETAS. 
Si el usuario te pregunta sobre cualquier otro tema que no sea alimentación o salud nutricional, debes rechazar educadamente la pregunta indicando que eres un asistente especializado en nutrición.
Provee información precisa, útil y en un tono motivador.`;

    const contextContext = contexto
      ? `\n\nContexto del usuario:\nObjetivo: ${contexto.objetivo}\nCalorías: ${contexto.calorias || "N/A"}\nPreferencias: ${contexto.preferencias ? contexto.preferencias.join(", ") : "N/A"}`
      : "";

    const userPrompt = `Pregunta/Mensaje del usuario: ${mensaje}${contextContext}\n\nResponde ofreciendo consultoría nutricional basada en este mensaje.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              parts: [
                {
                  text: userPrompt,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API REST error:", errorText);
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // Extract the text response from the Gemini API format
    const respuesta =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Lo siento, no pude generar una respuesta.";

    return NextResponse.json({ success: true, respuesta });
  } catch (error) {
    console.error("Error with Gemini AI:", error);
    return NextResponse.json(
      {
        success: false,
        respuesta:
          "Lo siento, hubo un error comunicándose con la IA. Por favor, intenta de nuevo.",
      },
      { status: 500 },
    );
  }
}
