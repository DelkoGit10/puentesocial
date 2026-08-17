// app/api/dialogo-consulta/route.ts
//
// Preguntas o comentarios sobre una devolución ya recibida en Diálogos
// guiados. Ruta propia, separada de /api/dialogo (el personaje) y de
// /api/dialogo-feedback (arma la devolución inicial) y de /api/analizar
// (prompt validado, no se toca).

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { construirPromptConsulta } from "@/lib/promptDialogoConsulta";
import { ESCENARIOS } from "@/lib/dialogoEscenarios";
import {
  ESCENARIOS_DIALOGO,
  LIMITES_DIALOGO,
  LIMITES_CONSULTA,
  esDevolucionValida,
  esRespuestaConsultaValida,
} from "@/lib/types";
import type { DevolucionDialogo, EscenarioDialogo, TurnoConsulta, TurnoDialogo } from "@/lib/types";

const MODELO = "claude-sonnet-4-6";

const anthropic = new Anthropic();

// --- Rate limit propio ---
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

function esHistorialEscenaValido(x: unknown): x is TurnoDialogo[] {
  return (
    Array.isArray(x) &&
    x.length > 0 &&
    x.length <= LIMITES_DIALOGO.TURNOS_MAX &&
    x.every((t) => t && (t.rol === "usuario" || t.rol === "personaje") && typeof t.texto === "string")
  );
}

function esHistorialConsultaValido(x: unknown): x is TurnoConsulta[] {
  return (
    Array.isArray(x) &&
    x.length <= LIMITES_CONSULTA.TURNOS_MAX &&
    x.every(
      (t) =>
        t &&
        (t.rol === "usuario" || t.rol === "coach") &&
        typeof t.texto === "string" &&
        t.texto.length <= LIMITES_CONSULTA.MENSAJE_MAX
    )
  );
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";

  if (!permitido(ip)) {
    return NextResponse.json(
      { error: "Llegaste al límite de consultas por hora. Probá más tarde." },
      { status: 429 }
    );
  }

  let body: {
    escenario?: string;
    historialEscena?: unknown;
    devolucion?: unknown;
    historialConsulta?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  if (!esEscenarioValido(body.escenario)) {
    return NextResponse.json({ error: "Escenario inválido." }, { status: 400 });
  }
  if (!esHistorialEscenaValido(body.historialEscena)) {
    return NextResponse.json({ error: "Falta la conversación original." }, { status: 400 });
  }
  if (!esDevolucionValida(body.devolucion)) {
    return NextResponse.json({ error: "Falta la devolución original." }, { status: 400 });
  }
  if (!esHistorialConsultaValido(body.historialConsulta)) {
    return NextResponse.json(
      { error: "Esta consulta llegó a su límite. Empezá una escena nueva para seguir practicando." },
      { status: 400 }
    );
  }
  if (body.historialConsulta.length === 0) {
    return NextResponse.json({ error: "Falta la pregunta." }, { status: 400 });
  }

  const systemPrompt = construirPromptConsulta(
    ESCENARIOS[body.escenario].titulo,
    body.historialEscena,
    body.devolucion as DevolucionDialogo
  );

  try {
    const r = await anthropic.messages.create({
      model: MODELO,
      max_tokens: 400,
      temperature: 0.6,
      system: systemPrompt,
      messages: body.historialConsulta.map((t) => ({
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

    if (!esRespuestaConsultaValida(respuesta)) {
      console.error("Forma inválida en consulta:", texto.slice(0, 400));
      return NextResponse.json({ error: "No pude responder eso. Probá de nuevo." }, { status: 502 });
    }

    return NextResponse.json(respuesta);
  } catch (e) {
    console.error("Error en consulta de diálogo:", e);
    return NextResponse.json(
      { error: "Hubo un problema al procesar la respuesta. Probá de nuevo en un momento." },
      { status: 500 }
    );
  }
}
