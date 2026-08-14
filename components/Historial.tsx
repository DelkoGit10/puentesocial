"use client";

import { useMemo, useState } from "react";
import type { EntradaHistorial } from "@/lib/types";
import { ETIQUETA_CATEGORIA } from "@/lib/types";
import { calcularPatron, MIN_PARA_PATRON } from "@/lib/patron";
import { generarDatosEjemplo } from "@/lib/datosEjemplo";
import ResultadoAnalisis from "@/components/ResultadoAnalisis";

function formatearFecha(ts: number): string {
  return new Date(ts).toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

export default function Historial({
  historial,
  onBorrar,
}: {
  historial: EntradaHistorial[];
  onBorrar: () => void;
}) {
  const [modoEjemplo, setModoEjemplo] = useState(false);
  const [expandidoId, setExpandidoId] = useState<string | null>(null);
  const datosEjemplo = useMemo(() => generarDatosEjemplo(), []);

  const mostrado = modoEjemplo ? datosEjemplo : historial;
  const patron = calcularPatron(mostrado);

  return (
    <section className="flex flex-col gap-4 border-t border-borde pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-cuerpo font-bold text-negro">Tu historial</h2>
        {!modoEjemplo && historial.length > 0 && (
          <button
            type="button"
            onClick={onBorrar}
            className="min-h-[48px] px-2 text-secundario text-negro underline hover:text-negro-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo"
          >
            Borrar historial
          </button>
        )}
      </div>

      <p className="text-secundario text-negro-suave">
        Todo esto se guarda solo en tu navegador, no viaja a ningún servidor.
      </p>

      {modoEjemplo && (
        <div className="flex items-center justify-between gap-2 rounded border border-celeste-medio bg-celeste-claro p-3 text-secundario text-negro">
          <span>Estos son datos de ejemplo, no tu historial real.</span>
          <button
            type="button"
            onClick={() => setModoEjemplo(false)}
            className="min-h-[48px] shrink-0 rounded border border-celeste-hondo px-3 py-2 text-secundario text-negro hover:bg-blanco focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo"
          >
            Salir del ejemplo
          </button>
        </div>
      )}

      {mostrado.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded border border-borde bg-blanco p-4 text-cuerpo text-negro-suave">
          <p>Todavía no consultaste ningún mensaje. Pegá el primero arriba, o mirá cómo se ve con ejemplos.</p>
          <button
            type="button"
            onClick={() => setModoEjemplo(true)}
            className="min-h-[48px] rounded border border-borde px-3 py-2 text-secundario text-negro hover:bg-papel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo"
          >
            Ver con datos de ejemplo
          </button>
        </div>
      )}

      {mostrado.length > 0 && !patron.listo && (
        <p className="rounded bg-papel p-3 text-cuerpo text-negro-suave">
          Llevás {patron.elegibles} {patron.elegibles === 1 ? "mensaje" : "mensajes"}. A partir de{" "}
          {MIN_PARA_PATRON} empiezo a mostrarte tu patrón.
        </p>
      )}

      {mostrado.length > 0 && patron.listo && (
        <div className="rounded border border-borde bg-blanco p-4">
          <p className="font-display text-cuerpo font-semibold text-negro">{patron.titular}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {patron.desglose.map((d) => (
              <li
                key={d.categoria}
                className="rounded-full bg-papel px-3 py-1 text-pildora text-negro-suave"
              >
                {ETIQUETA_CATEGORIA[d.categoria]}: {d.cuenta}
              </li>
            ))}
          </ul>
          {patron.excluidosPorSeguridad > 0 && (
            <p className="mt-3 text-secundario text-negro-suave">
              No cuenta {patron.excluidosPorSeguridad === 1 ? "la consulta" : "las consultas"} con
              alerta de seguridad: esas no son una estadística de estilo de comunicación.
            </p>
          )}
        </div>
      )}

      {mostrado.length > 0 && (
        <ul className="flex flex-col gap-2">
          {mostrado.map((h) => {
            const abierto = expandidoId === h.id;
            return (
              <li key={h.id} className="rounded border border-borde bg-blanco">
                <button
                  type="button"
                  onClick={() => setExpandidoId(abierto ? null : h.id)}
                  aria-expanded={abierto}
                  className="flex min-h-[52px] w-full items-center justify-between gap-3 px-3 py-3 text-left text-secundario hover:bg-papel focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-celeste-hondo"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {h.tuvoBanderaSeguridad && (
                      <span className="shrink-0 text-negro" title="Tuvo alerta de seguridad">
                        ●
                      </span>
                    )}
                    <span className="truncate font-mono text-cuerpo text-negro">{h.mensaje}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-pildora text-negro-suave">
                    <span>{ETIQUETA_CATEGORIA[h.categoria]}</span>
                    <span>{formatearFecha(h.fecha)}</span>
                    <span className={`transition-transform ${abierto ? "rotate-180" : ""}`}>▾</span>
                  </div>
                </button>
                {abierto && (
                  <div className="border-t border-borde p-3">
                    {h.analisis ? (
                      <ResultadoAnalisis analisis={h.analisis} mensaje={h.mensaje} />
                    ) : (
                      <p className="text-secundario text-negro-suave">
                        Esta consulta se guardó antes de que existiera el detalle completo, así que
                        no quedó registrado. Las que hagas de ahora en más sí van a quedar.
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
