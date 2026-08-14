"use client";

import { resaltarSenales } from "@/lib/resaltarSenales";
import type { Analisis } from "@/lib/types";

/**
 * El mensaje original, mostrado como evidencia (tipografía mono: es texto
 * ajeno citado, no interpretación nuestra), con los fragmentos que explican
 * cada lectura resaltados en su lugar exacto. Tocar un fragmento resaltado
 * lleva al bloque "Por qué" que lo explica — el momento pedagógico del
 * producto, hecho visible en el propio mensaje del usuario.
 */
export default function MensajeAnotado({
  mensaje,
  porQue,
}: {
  mensaje: string;
  porQue: Analisis["por_que"];
}) {
  const segmentos = resaltarSenales(mensaje, porQue);

  function irAPorQue(indice: number) {
    document.getElementById(`por-que-${indice}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <div className="rounded-lg border border-borde bg-blanco p-4">
      <p className="mb-2 text-pildora font-semibold tracking-wide text-negro-suave uppercase">
        Tu mensaje
      </p>
      <p className="font-mono text-cuerpo whitespace-pre-wrap text-negro">
        {segmentos.map((s, i) =>
          s.resaltado && s.indice !== null ? (
            <button
              key={i}
              type="button"
              onClick={() => irAPorQue(s.indice as number)}
              className="cursor-pointer rounded-sm border-b-[3px] border-rosa-hondo bg-transparent px-0 py-0 text-negro hover:bg-rosa-claro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo"
              title="Ver por qué"
            >
              {s.texto}
            </button>
          ) : (
            <span key={i}>{s.texto}</span>
          )
        )}
      </p>
    </div>
  );
}
