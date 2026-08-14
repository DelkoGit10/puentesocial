"use client";

import { useState } from "react";
import type { Analisis, Confianza, NivelAmbiguedad, Urgencia } from "@/lib/types";
import { ETIQUETA_CATEGORIA } from "@/lib/types";
import MensajeAnotado from "@/components/MensajeAnotado";

// Celeste = grado de certeza, una sola familia en tres pasos. Nada de
// semáforo: "esto es ambiguo" no es ni bueno ni malo.
const ESCALA_CERTEZA = {
  baja: "border border-borde bg-blanco text-negro",
  media: "border border-celeste-medio bg-celeste-claro text-negro",
  alta: "border border-celeste-hondo bg-celeste-medio text-negro",
} as const;

const COLOR_AMBIGUEDAD: Record<NivelAmbiguedad, string> = ESCALA_CERTEZA;
const COLOR_CONFIANZA: Record<Confianza, string> = ESCALA_CERTEZA;

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

function parseBandera(bandera: string): { titulo: string; texto: string; clases: string; cuadrada: boolean } {
  if (bandera.startsWith("RIESGO_RELACIONAL:")) {
    return {
      titulo: "Esto excede un malentendido de comunicación",
      texto: bandera.slice("RIESGO_RELACIONAL:".length).trim(),
      // Lo único negro sólido de toda la pantalla, sin bordes redondeados:
      // se resuelve por contraste, no por color.
      clases: "bg-negro text-blanco",
      cuadrada: true,
    };
  }
  if (bandera.startsWith("ANGUSTIA_GENUINA:")) {
    return {
      titulo: "Acá no hay nada que interpretar",
      texto: bandera.slice("ANGUSTIA_GENUINA:".length).trim(),
      clases: "border border-celeste-medio bg-celeste-claro text-negro",
      cuadrada: false,
    };
  }
  // Fallback defensivo por si el modelo no antepone el tipo: tratarlo como
  // el caso más serio antes que subestimarlo.
  return {
    titulo: "Esto excede un malentendido de comunicación",
    texto: bandera,
    clases: "bg-negro text-blanco",
    cuadrada: true,
  };
}

function Bloque({
  titulo,
  retraso,
  children,
}: {
  titulo: string;
  retraso: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="animar-entrada flex flex-col gap-2 border-t border-borde pt-4 first:border-t-0 first:pt-0"
      style={{ animationDelay: `${retraso * 60}ms` }}
    >
      <h2 className="text-pildora font-semibold tracking-wide text-negro-suave uppercase">{titulo}</h2>
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
      className="min-h-[48px] shrink-0 self-start rounded border border-borde px-3 py-2 text-secundario text-negro-suave hover:bg-papel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo"
    >
      {copiado ? "Copiado" : "Copiar"}
    </button>
  );
}

export default function ResultadoAnalisis({
  analisis,
  mensaje,
}: {
  analisis: Analisis;
  mensaje?: string;
}) {
  const { ambiguedad, lectura_literal, interpretaciones, pedido, respuestas, por_que, categoria, bandera_seguridad } =
    analisis;

  let i = 0;
  const sig = () => i++;

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-borde bg-blanco p-4 sm:p-5">
      {bandera_seguridad &&
        (() => {
          const { titulo, texto, clases, cuadrada } = parseBandera(bandera_seguridad);
          return (
            <div className={`p-4 text-cuerpo ${clases} ${cuadrada ? "rounded-none" : "rounded-lg"}`}>
              <p className="font-semibold">{titulo}</p>
              <p className="mt-1">{texto}</p>
            </div>
          );
        })()}

      {mensaje && (
        <div className="animar-entrada" style={{ animationDelay: `${sig() * 60}ms` }}>
          <MensajeAnotado mensaje={mensaje} porQue={por_que} />
        </div>
      )}

      <div className="animar-entrada flex flex-wrap items-center gap-2" style={{ animationDelay: `${sig() * 60}ms` }}>
        <span className="rounded-full border border-borde bg-papel px-3 py-1 text-pildora font-medium text-negro">
          {ETIQUETA_CATEGORIA[categoria]}
        </span>
        <span className={`rounded-full px-3 py-1 text-pildora font-medium ${COLOR_AMBIGUEDAD[ambiguedad.nivel]}`}>
          Ambigüedad {ambiguedad.nivel}
        </span>
      </div>
      <p className="-mt-4 text-secundario text-negro-suave">{ambiguedad.explicacion}</p>

      <Bloque titulo="Lectura literal" retraso={sig()}>
        <p className="text-cuerpo text-negro">{lectura_literal}</p>
      </Bloque>

      <Bloque titulo={interpretaciones.length > 1 ? "Interpretaciones posibles" : "Interpretación"} retraso={sig()}>
        <div className="flex flex-col gap-3">
          {interpretaciones.map((it, idx) => (
            <div key={idx} className="rounded border border-borde p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className={`rounded px-2 py-0.5 text-pildora font-medium ${COLOR_CONFIANZA[it.confianza]}`}>
                  Confianza {it.confianza}
                </span>
              </div>
              <p className="text-cuerpo text-negro">{it.significado}</p>
              {it.senales.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-secundario text-negro-suave">
                  {it.senales.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        {ambiguedad.nivel === "alta" && (
          <p className="text-secundario text-negro-suave italic">
            No se puede saber con certeza desde el texto. Preguntar es una respuesta válida, no un fracaso.
          </p>
        )}
      </Bloque>

      {pedido.hay_pedido && (
        <Bloque titulo="¿Te están pidiendo algo?" retraso={sig()}>
          <div className="flex items-center gap-2">
            <span className="rounded bg-papel px-2 py-0.5 text-pildora font-medium text-negro">
              {ETIQUETA_URGENCIA[pedido.urgencia]}
            </span>
            {pedido.requiere_respuesta && (
              <span className="text-secundario text-negro-suave">Conviene responder</span>
            )}
          </div>
          {pedido.que_pide && <p className="text-cuerpo text-negro">{pedido.que_pide}</p>}
        </Bloque>
      )}

      <Bloque titulo="Por qué" retraso={sig()}>
        <ul className="flex flex-col gap-2">
          {por_que.map((p, idx) => (
            <li key={idx} id={`por-que-${idx}`} className="scroll-mt-6 text-cuerpo text-negro">
              <span className="font-medium">{p.senal}</span>
              <span className="text-negro-suave"> — {p.significado}</span>
            </li>
          ))}
        </ul>
      </Bloque>

      <Bloque titulo="Formas de responder" retraso={sig()}>
        <div className="flex flex-col gap-3">
          {respuestas.map((r, idx) => (
            <div key={idx} className="rounded border border-borde p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-secundario font-semibold text-negro-suave">
                  {ETIQUETA_REGISTRO[r.registro] ?? r.registro}
                </span>
                <BotonCopiar texto={r.texto} />
              </div>
              <p className="text-cuerpo text-negro">{r.texto}</p>
              <p className="mt-1 text-secundario text-negro-suave">{r.cuando_usarla}</p>
            </div>
          ))}
        </div>
      </Bloque>
    </div>
  );
}
