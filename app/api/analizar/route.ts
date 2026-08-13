// app/api/analizar/route.ts
//
// Acá vive la API key. Nunca en el cliente.
// En Vercel se configura en Settings > Environment Variables como ANTHROPIC_API_KEY.
// En local, en un .env.local que esté en el .gitignore.

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { esAnalisisValido, LIMITES } from "@/lib/types";

// Mismo modelo con el que se corrió eval/04-evaluar.py (85% categoría, 92%/90%
// intención sobre 40 + 10 holdout). Si esto cambia, hay que volver a evaluar
// antes de confiar en esos números.
const MODELO = "claude-sonnet-4-6";

const anthropic = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno

// --- Rate limit ---
// En memoria: alcanza para el concurso y para decenas de usuarios.
// Ojo: en serverless cada instancia tiene su propio Map, así que el límite real
// es más laxo de lo que dice el número. Suficiente como freno de emergencia,
// no como seguridad. Si esto crece, va a Upstash/Redis.
const VENTANA_MS = 60 * 60 * 1000;
const MAX_POR_HORA = 20;
const usos = new Map<string, number[]>();

function permitido(ip: string): boolean {
  const ahora = Date.now();
  const previos = (usos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (previos.length >= MAX_POR_HORA) {
    usos.set(ip, previos);
    return false;
  }
  previos.push(ahora);
  usos.set(ip, previos);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";

  if (!permitido(ip)) {
    return NextResponse.json(
      { error: "Llegaste al límite de consultas por hora. Probá más tarde." },
      { status: 429 }
    );
  }

  let body: { mensaje?: string; relacion?: string; canal?: string; contexto?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  const mensaje = (body.mensaje ?? "").trim();
  const relacion = (body.relacion ?? "no especificado").slice(0, 60);
  const canal = (body.canal ?? "no especificado").slice(0, 60);
  const contexto = (body.contexto ?? "").trim().slice(0, LIMITES.CONTEXTO_MAX);

  if (mensaje.length < LIMITES.MENSAJE_MIN) {
    return NextResponse.json({ error: "Pegá el mensaje que querés entender." }, { status: 400 });
  }
  if (mensaje.length > LIMITES.MENSAJE_MAX) {
    return NextResponse.json(
      { error: `El mensaje es muy largo (máximo ${LIMITES.MENSAJE_MAX} caracteres).` },
      { status: 400 }
    );
  }

  const userPrompt = `MENSAJE RECIBIDO:
"""
${mensaje}
"""

QUIÉN LO ESCRIBIÓ: ${relacion}
CANAL: ${canal}
QUÉ PASÓ ANTES: ${contexto || "(no especificado)"}`;

  try {
    const r = await anthropic.messages.create({
      model: MODELO,
      max_tokens: 1500,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const texto = r.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .trim();

    const analisis = JSON.parse(texto);

    if (!esAnalisisValido(analisis)) {
      // El modelo respondió pero con una forma que la interfaz no sabe dibujar.
      console.error("Forma inválida:", texto.slice(0, 400));
      return NextResponse.json(
        { error: "No pude analizar este mensaje. Probá de nuevo." },
        { status: 502 }
      );
    }

    return NextResponse.json(analisis);
  } catch (e) {
    // Nunca devolver el error crudo al cliente: puede filtrar detalles de la cuenta.
    console.error("Error al analizar:", e);
    return NextResponse.json(
      { error: "Hubo un problema al procesar el mensaje. Probá de nuevo en un momento." },
      { status: 500 }
    );
  }
}
