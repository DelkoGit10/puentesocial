// app/api/dialogo/route.ts
//
// Diálogos guiados: la única ruta con memoria de conversación y llamadas en
// vivo. Independiente de /api/analizar a propósito — prompt propio, límite
// propio, sin tocar la ruta ni el prompt ya validados.

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { construirPromptDialogo } from "@/lib/promptDialogo";
import { ESCENARIOS } from "@/lib/dialogoEscenarios";
import { ESCENARIOS_DIALOGO, LIMITES_DIALOGO, esRespuestaDialogoValida } from "@/lib/types";
import type { EscenarioDialogo, TurnoDialogo } from "@/lib/types";

const MODELO = "claude-sonnet-4-6";

const anthropic = new Anthropic();

// --- Rate limit propio ---
// Más estricto que el de /api/analizar: cada turno de diálogo es una
// llamada, y una conversación tiene varios turnos.
const VENTANA_MS = 60 * 60 * 1000;
const MAX_POR_HORA = 40;
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

function esEscenarioValido(x: unknown): x is EscenarioDialogo {
  return typeof x === "string" && (ESCENARIOS_DIALOGO as readonly string[]).includes(x);
}

function esHistorialValido(x: unknown): x is TurnoDialogo[] {
  return (
    Array.isArray(x) &&
    x.length <= LIMITES_DIALOGO.TURNOS_MAX &&
    x.every(
      (t) =>
        t &&
        (t.rol === "usuario" || t.rol === "personaje") &&
        typeof t.texto === "string" &&
        t.texto.length <= LIMITES_DIALOGO.MENSAJE_MAX
    )
  );
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";

  if (!permitido(ip)) {
    return NextResponse.json(
      { error: "Llegaste al límite de mensajes por hora. Probá más tarde." },
      { status: 429 }
    );
  }

  let body: { escenario?: string; edad?: string; historial?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  if (!esEscenarioValido(body.escenario)) {
    return NextResponse.json({ error: "Escenario inválido." }, { status: 400 });
  }
  if (!esHistorialValido(body.historial)) {
    return NextResponse.json(
      { error: "La conversación llegó a su límite. Empezá una escena nueva." },
      { status: 400 }
    );
  }

  const edad = typeof body.edad === "string" ? body.edad.trim().slice(0, 3) : undefined;
  const escenario = ESCENARIOS[body.escenario];
  const systemPrompt = construirPromptDialogo(escenario, edad);
  const historial = body.historial;

  if (historial.length === 0) {
    return NextResponse.json({ error: "Falta el primer mensaje." }, { status: 400 });
  }

  try {
    const r = await anthropic.messages.create({
      model: MODELO,
      max_tokens: 300,
      temperature: 1,
      system: systemPrompt,
      messages: historial.map((t) => ({
        role: t.rol === "usuario" ? ("user" as const) : ("assistant" as const),
        content: t.texto,
      })),
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

    const respuesta = JSON.parse(texto);

    if (!esRespuestaDialogoValida(respuesta)) {
      console.error("Forma inválida en diálogo:", texto.slice(0, 400));
      return NextResponse.json(
        { error: "No pude seguir la escena. Probá de nuevo." },
        { status: 502 }
      );
    }

    return NextResponse.json(respuesta);
  } catch (e) {
    console.error("Error en diálogo:", e);
    return NextResponse.json(
      { error: "Hubo un problema al procesar la respuesta. Probá de nuevo en un momento." },
      { status: 500 }
    );
  }
}
