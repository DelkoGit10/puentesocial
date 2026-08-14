"use client";

import { useEffect, useMemo, useState } from "react";
import type { Ambito, CasoPractica, ProgresoPractica } from "@/lib/types";
import { AMBITOS, ETIQUETA_AMBITO } from "@/lib/types";
import { leerProgresoPractica, guardarProgresoPractica } from "@/lib/practicaProgreso";
import ResultadoAnalisis from "@/components/ResultadoAnalisis";
import practicaData from "@/lib/practica.json";

const CASOS = practicaData.casos as unknown as CasoPractica[];

function mezclar<T>(arr: T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export default function Practicar() {
  const [ambito, setAmbito] = useState<Ambito>("escuela");
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [progreso, setProgreso] = useState<ProgresoPractica>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgreso(leerProgresoPractica());
  }, []);

  const casosAmbito = useMemo(() => CASOS.filter((c) => c.ambito === ambito), [ambito]);
  const caso = casosAmbito[indice % casosAmbito.length];

  const opcionesOrdenadas = useMemo(
    () => (caso ? mezclar(caso.opciones) : []),
    // Se reordena solo cuando cambia el caso, no en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [caso?.id]
  );

  function elegirAmbito(a: Ambito) {
    setAmbito(a);
    setIndice(0);
    setElegida(null);
  }

  function elegirOpcion(i: number) {
    if (elegida !== null || !caso) return;
    setElegida(i);
    const acerto = opcionesOrdenadas[i].correcta;
    // Date.now() corre en un manejador de eventos (onClick), no en el render.
    // eslint-disable-next-line react-hooks/purity
    const fecha = Date.now();
    const actualizado = { ...progreso, [caso.id]: { acerto, fecha } };
    setProgreso(actualizado);
    guardarProgresoPractica(actualizado);
  }

  function siguiente() {
    setIndice((i) => (i + 1) % casosAmbito.length);
    setElegida(null);
  }

  if (!caso) return null;

  const revelado = elegida !== null;
  const acerto = revelado && opcionesOrdenadas[elegida].correcta;
  const resueltosEnAmbito = casosAmbito.filter((c) => progreso[c.id]).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Elegir ámbito">
        {AMBITOS.map((a) => (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={ambito === a}
            onClick={() => elegirAmbito(a)}
            className={`min-h-[48px] rounded-full border px-4 py-2 text-secundario font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo ${
              ambito === a
                ? "border-negro bg-negro text-blanco"
                : "border-borde bg-blanco text-negro hover:bg-papel"
            }`}
          >
            {ETIQUETA_AMBITO[a]}
          </button>
        ))}
      </div>

      <p className="text-secundario text-negro-suave">
        {resueltosEnAmbito} de {casosAmbito.length} resueltos en {ETIQUETA_AMBITO[ambito].toLowerCase()}.
      </p>

      <div className="rounded-lg border border-borde bg-blanco p-4">
        <p className="text-pildora font-semibold tracking-wide text-negro-suave uppercase">
          {caso.relacion} · {caso.canal}
        </p>
        <p className="mt-2 font-mono text-cuerpo whitespace-pre-wrap text-negro">{caso.mensaje}</p>
        {caso.contexto && <p className="mt-2 text-secundario text-negro-suave italic">{caso.contexto}</p>}
      </div>

      {!revelado && (
        <div className="flex flex-col gap-3">
          <p className="text-cuerpo text-negro">¿Qué te parece que quiso decir?</p>
          {opcionesOrdenadas.map((op, i) => (
            <button
              key={i}
              type="button"
              onClick={() => elegirOpcion(i)}
              className="min-h-[48px] rounded border border-borde bg-blanco p-3 text-left text-cuerpo text-negro hover:border-celeste-hondo hover:bg-papel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo"
            >
              {op.texto}
            </button>
          ))}
        </div>
      )}

      {revelado && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            {opcionesOrdenadas.map((op, i) => {
              const esElegida = i === elegida;
              const clases = op.correcta
                ? "border-celeste-hondo bg-celeste-claro text-negro"
                : esElegida
                  ? "border-negro bg-blanco text-negro"
                  : "border-borde bg-blanco text-negro-suave";
              return (
                <div key={i} className={`rounded border p-3 text-cuerpo ${clases}`}>
                  {op.correcta && <span className="mr-2 font-semibold">✓</span>}
                  {op.texto}
                  {esElegida && !op.correcta && (
                    <span className="ml-2 text-secundario text-negro-suave">— elegiste esta</span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-cuerpo text-negro">
            {acerto
              ? "Elegiste la lectura más sostenida por el texto. Mirá qué señales la confirman:"
              : "Esta vez la lectura más sostenida por el texto era otra. Mirá qué señales lo indicaban:"}
          </p>

          <ResultadoAnalisis analisis={caso.analisis} mensaje={caso.mensaje} />

          <button
            type="button"
            onClick={siguiente}
            className="min-h-[48px] w-full rounded bg-negro px-4 py-3 text-base font-medium text-blanco"
          >
            Siguiente mensaje
          </button>
        </div>
      )}
    </div>
  );
}
