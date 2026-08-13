"use client";

import { useEffect, useState } from "react";
import type { Analisis, EntradaAnalisis, EntradaHistorial } from "@/lib/types";
import { ETIQUETA_RELACION, RELACIONES } from "@/lib/types";
import ResultadoAnalisis from "@/components/ResultadoAnalisis";
import EsqueletoResultado from "@/components/EsqueletoResultado";
import Historial from "@/components/Historial";
import { borrarHistorial, crearEntrada, guardarHistorial, leerHistorial } from "@/lib/historial";

const VACIO: EntradaAnalisis = {
  mensaje: "",
  relacion: "",
  canal: "",
  contexto: "",
};

export default function Home() {
  const [form, setForm] = useState<EntradaAnalisis>(VACIO);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Analisis | null>(null);
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

    try {
      const res = await fetch("/api/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Algo salió mal.");
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
        });
        const actualizado = [nueva, ...historial];
        setHistorial(actualizado);
        guardarHistorial(actualizado);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  function onBorrarHistorial() {
    setHistorial([]);
    borrarHistorial();
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">SocialBridge AI</h1>
      <p className="text-sm text-gray-500">
        Pegá un mensaje que recibiste y no sabés cómo interpretar.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <textarea
          required
          minLength={2}
          maxLength={1200}
          placeholder="El mensaje que recibiste..."
          className="min-h-24 rounded border p-2"
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
        />
        <div className="flex gap-3">
          <select
            required
            className="flex-1 rounded border p-2 text-gray-900"
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
            placeholder="Canal (WhatsApp, mail, Slack...)"
            className="flex-1 rounded border p-2"
            value={form.canal}
            onChange={(e) => setForm({ ...form, canal: e.target.value })}
          />
        </div>
        <textarea
          maxLength={400}
          placeholder="¿Qué pasó antes? (opcional)"
          className="min-h-16 rounded border p-2"
          value={form.contexto}
          onChange={(e) => setForm({ ...form, contexto: e.target.value })}
        />
        <button
          type="submit"
          disabled={cargando}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {cargando ? "Analizando..." : "Traducir"}
        </button>
        {cargando && (
          <p className="text-center text-xs text-gray-500">
            Suele tardar entre 10 y 15 segundos.
          </p>
        )}
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {cargando && <EsqueletoResultado />}
      {!cargando && resultado && <ResultadoAnalisis analisis={resultado} />}

      <Historial historial={historial} onBorrar={onBorrarHistorial} />
    </main>
  );
}
