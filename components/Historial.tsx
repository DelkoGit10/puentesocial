"use client";

import { useMemo, useState } from "react";
import type { EntradaHistorial } from "@/lib/types";
import { ETIQUETA_CATEGORIA } from "@/lib/types";
import { calcularPatron, MIN_PARA_PATRON } from "@/lib/patron";
import { generarDatosEjemplo } from "@/lib/datosEjemplo";

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
  const datosEjemplo = useMemo(() => generarDatosEjemplo(), []);

  const mostrado = modoEjemplo ? datosEjemplo : historial;
  const patron = calcularPatron(mostrado);

  return (
    <section className="flex flex-col gap-4 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Tu historial</h2>
        {!modoEjemplo && historial.length > 0 && (
          <button
            type="button"
            onClick={onBorrar}
            className="text-xs text-red-600 underline hover:text-red-800"
          >
            Borrar historial
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Todo esto se guarda solo en tu navegador, no viaja a ningún servidor.
      </p>

      {modoEjemplo && (
        <div className="flex items-center justify-between rounded border border-blue-300 bg-blue-50 p-3 text-sm text-blue-900">
          <span>Estos son datos de ejemplo, no tu historial real.</span>
          <button
            type="button"
            onClick={() => setModoEjemplo(false)}
            className="shrink-0 rounded border border-blue-400 px-2 py-1 text-xs hover:bg-blue-100"
          >
            Salir del ejemplo
          </button>
        </div>
      )}

      {mostrado.length === 0 && (
        <div className="flex flex-col items-start gap-2 rounded border border-gray-200 p-4 text-sm text-gray-500">
          <p>Todavía no consultaste ningún mensaje.</p>
          <button
            type="button"
            onClick={() => setModoEjemplo(true)}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
          >
            Ver con datos de ejemplo
          </button>
        </div>
      )}

      {mostrado.length > 0 && !patron.listo && (
        <p className="rounded bg-gray-50 p-3 text-sm text-gray-600">
          Llevás {patron.elegibles} {patron.elegibles === 1 ? "mensaje" : "mensajes"}. A partir de{" "}
          {MIN_PARA_PATRON} empiezo a mostrarte tu patrón.
        </p>
      )}

      {mostrado.length > 0 && patron.listo && (
        <div className="rounded border border-gray-200 p-4">
          <p className="text-base font-semibold text-gray-900">{patron.titular}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {patron.desglose.map((d) => (
              <li
                key={d.categoria}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
              >
                {ETIQUETA_CATEGORIA[d.categoria]}: {d.cuenta}
              </li>
            ))}
          </ul>
          {patron.excluidosPorSeguridad > 0 && (
            <p className="mt-3 text-xs text-gray-400">
              No cuenta {patron.excluidosPorSeguridad === 1 ? "la consulta" : "las consultas"} con
              alerta de seguridad: esas no son una estadística de estilo de comunicación.
            </p>
          )}
        </div>
      )}

      {mostrado.length > 0 && (
        <ul className="flex flex-col gap-2">
          {mostrado.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between gap-3 rounded border border-gray-100 px-3 py-2 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                {h.tuvoBanderaSeguridad && (
                  <span className="shrink-0 text-red-500" title="Tuvo alerta de seguridad">
                    ●
                  </span>
                )}
                <span className="truncate text-gray-700">{h.mensaje}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs text-gray-400">
                <span>{ETIQUETA_CATEGORIA[h.categoria]}</span>
                <span>{formatearFecha(h.fecha)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
