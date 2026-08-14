"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Analisis, EntradaAnalisis, EntradaHistorial } from "@/lib/types";
import { ETIQUETA_RELACION, RELACIONES } from "@/lib/types";
import ResultadoAnalisis from "@/components/ResultadoAnalisis";
import EsqueletoResultado from "@/components/EsqueletoResultado";
import Historial from "@/components/Historial";
import Practicar from "@/components/Practicar";
import { borrarHistorial, crearEntrada, guardarHistorial, leerHistorial } from "@/lib/historial";

type Vista = "traducir" | "practicar";

const VACIO: EntradaAnalisis = {
  mensaje: "",
  relacion: "",
  canal: "",
  contexto: "",
};

const INPUT = "min-h-[48px] w-full rounded border border-borde bg-blanco p-3 text-base text-negro placeholder:text-negro-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo";

export default function Home() {
  const [vista, setVista] = useState<Vista>("traducir");
  const [form, setForm] = useState<EntradaAnalisis>(VACIO);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Analisis | null>(null);
  const [mensajeConsultado, setMensajeConsultado] = useState<string | null>(null);
  const [historial, setHistorial] = useState<EntradaHistorial[]>([]);

  useEffect(() => {
    // localStorage no existe en el server: arrancamos en [] para que el HTML
    // del SSR coincida con el primer render del cliente, y lo llenamos acá.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistorial(leerHistorial());
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setResultado(null);
    setMensajeConsultado(form.mensaje);

    try {
      const res = await fetch("/api/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Algo salió mal. Probá de nuevo en un momento.");
        return;
      }
      const analisis = data as Analisis;
      setResultado(analisis);

      if (form.relacion) {
        const nueva = crearEntrada({
          mensaje: form.mensaje,
          relacion: form.relacion,
          categoria: analisis.categoria,
          ambiguedad: analisis.ambiguedad.nivel,
          tuvoBanderaSeguridad: !!analisis.bandera_seguridad,
          analisis,
        });
        const actualizado = [nueva, ...historial];
        setHistorial(actualizado);
        guardarHistorial(actualizado);
      }
    } catch {
      setError("No se pudo conectar con el servidor. Revisá tu conexión y probá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function onBorrarHistorial() {
    setHistorial([]);
    borrarHistorial();
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-2xl flex-1 flex-col gap-6 p-4">
      <div>
        {/* El logo ya trae el nombre escrito con sus propios colores de marca.
            El h1 real queda oculto para accesibilidad/SEO, sin duplicar el
            texto en pantalla. */}
        <h1 className="sr-only">PuenteSocial</h1>
        <Image src="/logo.png" alt="" width={256} height={141} priority className="h-auto w-56" />
        <p className="-mt-2 text-cuerpo text-negro-suave">Traducí lo que te quisieron decir.</p>
      </div>

      <div className="flex gap-2" role="tablist" aria-label="Sección">
        {(
          [
            ["traducir", "Traducir"],
            ["practicar", "Practicar"],
          ] as const
        ).map(([v, etiqueta]) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={vista === v}
            onClick={() => setVista(v)}
            className={`min-h-[48px] rounded-full border px-4 py-2 text-secundario font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo ${
              vista !== v
                ? "border-borde bg-blanco text-negro hover:bg-papel"
                : v === "practicar"
                  ? "border-rosa-hondo bg-rosa-claro text-negro"
                  : "border-celeste-marca bg-celeste-marca text-negro"
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {vista === "practicar" && <Practicar />}

      {vista === "traducir" && (
        <>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <textarea
          required
          minLength={2}
          maxLength={1200}
          placeholder="El mensaje que recibiste..."
          className={`min-h-24 font-mono ${INPUT}`}
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
        />
        <div className="flex gap-3">
          <select
            required
            className={`min-w-0 flex-1 ${INPUT}`}
            value={form.relacion}
            onChange={(e) => setForm({ ...form, relacion: e.target.value as EntradaAnalisis["relacion"] })}
          >
            <option value="" disabled>
              ¿Quién lo escribió?
            </option>
            {RELACIONES.map((r) => (
              <option key={r} value={r}>
                {ETIQUETA_RELACION[r]}
              </option>
            ))}
          </select>
          <input
            placeholder="Canal (WhatsApp...)"
            className={`min-w-0 flex-1 ${INPUT}`}
            value={form.canal}
            onChange={(e) => setForm({ ...form, canal: e.target.value })}
          />
        </div>
        <textarea
          maxLength={400}
          placeholder="¿Qué pasó antes? (opcional)"
          className={`min-h-16 ${INPUT}`}
          value={form.contexto}
          onChange={(e) => setForm({ ...form, contexto: e.target.value })}
        />
        <div className="sticky bottom-0">
          <div className="pointer-events-none -mt-6 h-6 bg-gradient-to-t from-papel to-transparent" />
          <div className="bg-papel pt-2 pb-3">
            <button
              type="submit"
              disabled={cargando}
              className="min-h-[48px] w-full rounded bg-celeste-marca px-4 py-3 text-base font-medium text-negro hover:opacity-90 disabled:opacity-50"
            >
              {cargando ? "Analizando..." : "Traducir"}
            </button>
            {cargando && (
              <p className="mt-2 text-center text-secundario text-negro-suave">
                Suele tardar entre 10 y 15 segundos.
              </p>
            )}
          </div>
        </div>
      </form>

      {error && (
        <p className="rounded border border-negro p-3 text-cuerpo text-negro">{error}</p>
      )}

      {cargando && mensajeConsultado && (
        <div className="rounded-lg border border-borde bg-blanco p-4">
          <p className="mb-2 text-pildora font-semibold tracking-wide text-negro-suave uppercase">Tu mensaje</p>
          <p className="font-mono text-cuerpo whitespace-pre-wrap text-negro">{mensajeConsultado}</p>
        </div>
      )}

      {cargando && <EsqueletoResultado />}
      {!cargando && resultado && (
        <ResultadoAnalisis analisis={resultado} mensaje={mensajeConsultado ?? undefined} />
      )}

      <Historial historial={historial} onBorrar={onBorrarHistorial} />
        </>
      )}
    </main>
  );
}
