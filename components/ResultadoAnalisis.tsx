"use client";

import { useState } from "react";
import type { Analisis, Confianza, NivelAmbiguedad, Urgencia } from "@/lib/types";
import { ETIQUETA_CATEGORIA } from "@/lib/types";

const COLOR_AMBIGUEDAD: Record<NivelAmbiguedad, string> = {
  baja: "bg-green-100 text-green-800 border-green-300",
  media: "bg-amber-100 text-amber-800 border-amber-300",
  alta: "bg-red-100 text-red-800 border-red-300",
};

const COLOR_CONFIANZA: Record<Confianza, string> = {
  alta: "bg-gray-800 text-white",
  media: "bg-gray-300 text-gray-800",
  baja: "bg-gray-100 text-gray-500 border border-gray-300",
};

const ETIQUETA_URGENCIA: Record<Urgencia, string> = {
  ninguna: "Sin urgencia",
  baja: "Urgencia baja",
  media: "Urgencia media",
  alta: "Urgencia alta",
};

const ETIQUETA_REGISTRO: Record<string, string> = {
  directa: "Directa",
  cauta: "Cauta",
  aclaratoria: "Aclaratoria",
};

function parseBandera(bandera: string): { titulo: string; texto: string; clases: string } {
  if (bandera.startsWith("RIESGO_RELACIONAL:")) {
    return {
      titulo: "Esto excede un malentendido de comunicación",
      texto: bandera.slice("RIESGO_RELACIONAL:".length).trim(),
      clases: "border-red-400 bg-red-50 text-red-900",
    };
  }
  if (bandera.startsWith("ANGUSTIA_GENUINA:")) {
    return {
      titulo: "Acá no hay nada que interpretar",
      texto: bandera.slice("ANGUSTIA_GENUINA:".length).trim(),
      clases: "border-amber-400 bg-amber-50 text-amber-900",
    };
  }
  // Fallback defensivo por si el modelo no antepone el tipo: tratarlo como
  // el caso más serio antes que subestimarlo.
  return {
    titulo: "Esto excede un malentendido de comunicación",
    texto: bandera,
    clases: "border-red-400 bg-red-50 text-red-900",
  };
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
      <h2 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{titulo}</h2>
      {children}
    </section>
  );
}

function BotonCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(texto);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 1500);
      }}
      className="shrink-0 self-start rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
    >
      {copiado ? "Copiado" : "Copiar"}
    </button>
  );
}

export default function ResultadoAnalisis({ analisis }: { analisis: Analisis }) {
  const { ambiguedad, lectura_literal, interpretaciones, pedido, respuestas, por_que, categoria, bandera_seguridad } =
    analisis;

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-gray-200 p-4 sm:p-5">
      {bandera_seguridad &&
        (() => {
          const { titulo, texto, clases } = parseBandera(bandera_seguridad);
          return (
            <div className={`rounded border-2 p-3 text-sm ${clases}`}>
              <p className="font-semibold">{titulo}</p>
              <p className="mt-1">{texto}</p>
            </div>
          );
        })()}

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
          {ETIQUETA_CATEGORIA[categoria]}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${COLOR_AMBIGUEDAD[ambiguedad.nivel]}`}
        >
          Ambigüedad {ambiguedad.nivel}
        </span>
      </div>
      <p className="-mt-3 text-sm text-gray-500">{ambiguedad.explicacion}</p>

      <Bloque titulo="Lectura literal">
        <p className="text-sm text-gray-800">{lectura_literal}</p>
      </Bloque>

      <Bloque titulo={interpretaciones.length > 1 ? "Interpretaciones posibles" : "Interpretación"}>
        <div className="flex flex-col gap-3">
          {interpretaciones.map((it, i) => (
            <div key={i} className="rounded border border-gray-200 p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${COLOR_CONFIANZA[it.confianza]}`}>
                  Confianza {it.confianza}
                </span>
              </div>
              <p className="text-sm text-gray-800">{it.significado}</p>
              {it.senales.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-xs text-gray-500">
                  {it.senales.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        {ambiguedad.nivel === "alta" && (
          <p className="text-xs text-gray-500 italic">
            No se puede saber con certeza desde el texto. Preguntar es una respuesta válida, no un fracaso.
          </p>
        )}
      </Bloque>

      {pedido.hay_pedido && (
        <Bloque titulo="¿Te están pidiendo algo?">
          <div className="flex items-center gap-2">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {ETIQUETA_URGENCIA[pedido.urgencia]}
            </span>
            {pedido.requiere_respuesta && (
              <span className="text-xs text-gray-500">Conviene responder</span>
            )}
          </div>
          {pedido.que_pide && <p className="text-sm text-gray-800">{pedido.que_pide}</p>}
        </Bloque>
      )}

      <Bloque titulo="Por qué">
        <ul className="flex flex-col gap-2">
          {por_que.map((p, i) => (
            <li key={i} className="text-sm text-gray-800">
              <span className="font-medium">{p.senal}</span>
              <span className="text-gray-500"> — {p.significado}</span>
            </li>
          ))}
        </ul>
      </Bloque>

      <Bloque titulo="Formas de responder">
        <div className="flex flex-col gap-3">
          {respuestas.map((r, i) => (
            <div key={i} className="rounded border border-gray-200 p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-500">
                  {ETIQUETA_REGISTRO[r.registro] ?? r.registro}
                </span>
                <BotonCopiar texto={r.texto} />
              </div>
              <p className="text-sm text-gray-900">{r.texto}</p>
              <p className="mt-1 text-xs text-gray-500">{r.cuando_usarla}</p>
            </div>
          ))}
        </div>
      </Bloque>
    </div>
  );
}
