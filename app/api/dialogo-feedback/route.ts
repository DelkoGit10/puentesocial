// app/api/dialogo-feedback/route.ts
//
// Devolución sobre cómo respondió el usuario en una escena de Diálogos
// guiados ya terminada. Ruta separada de /api/dialogo (que sostiene el
// personaje) y de /api/analizar (prompt validado, no se toca): esto analiza
// un texto ya cerrado, no continúa una conversación.

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { PROMPT_DEVOLUCION, formatearTranscripcion } from "@/lib/promptDialogoFeedback";
import { ESCENARIOS } from "@/lib/dialogoEscenarios";
import { ESCENARIOS_DIALOGO, LIMITES_DIALOGO, esDevolucionValida } from "@/lib/types";
import type { EscenarioDialogo, TurnoDialogo } from "@/lib/types";

const MODELO = "claude-sonnet-4-6";

const anthropic = new Anthropic();

// --- Rate limit propio ---
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

function esEscenarioValido(x: unknown): x is EscenarioDialogo {
  return typeof x === "string" && (ESCENARIOS_DIALOGO as readonly string[]).includes(x);
}

function esHistorialValido(x: unknown): x is TurnoDialogo[] {
  return (
    Array.isArray(x) &&
    x.length > 0 &&
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
      { error: "Llegaste al límite de devoluciones por hora. Probá más tarde." },
      { status: 429 }
    );
  }

  let body: { escenario?: string; historial?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  if (!esEscenarioValido(body.escenario)) {
    return NextResponse.json({ error: "Escenario inválido." }, { status: 400 });
  }
  if (!esHistorialValido(body.historial)) {
    return NextResponse.json({ error: "No hay conversación para revisar." }, { status: 400 });
  }
  if (!body.historial.some((t) => t.rol === "usuario")) {
    return NextResponse.json(
      { error: "Todavía no escribiste nada en esta escena." },
      { status: 400 }
    );
  }

  const transcripcion = formatearTranscripcion(ESCENARIOS[body.escenario].titulo, body.historial);

  try {
    const r = await anthropic.messages.create({
      model: MODELO,
      max_tokens: 800,
      temperature: 0.4,
      system: PROMPT_DEVOLUCION,
      messages: [{ role: "user", content: transcripcion }],
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

    const devolucion = JSON.parse(texto);

    if (!esDevolucionValida(devolucion)) {
      console.error("Forma inválida en devolución:", texto.slice(0, 400));
      return NextResponse.json(
        { error: "No pude armar la devolución. Probá de nuevo." },
        { status: 502 }
      );
    }

    return NextResponse.json(devolucion);
  } catch (e) {
    console.error("Error en devolución de diálogo:", e);
    return NextResponse.json(
      { error: "Hubo un problema al procesar la devolución. Probá de nuevo en un momento." },
      { status: 500 }
    );
  }
}
