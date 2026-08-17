"use client";

import { useState } from "react";
import type { DevolucionDialogo, EscenarioDialogo, TurnoConsulta, TurnoDialogo } from "@/lib/types";
import { LIMITES_CONSULTA, LIMITES_DIALOGO } from "@/lib/types";
import { ESCENARIOS } from "@/lib/dialogoEscenarios";

type Paso = "elegir" | "edad" | "chat";

export default function Dialogo() {
  const [paso, setPaso] = useState<Paso>("elegir");
  const [escenarioId, setEscenarioId] = useState<EscenarioDialogo | null>(null);
  const [edad, setEdad] = useState("");
  const [historial, setHistorial] = useState<TurnoDialogo[]>([]);
  const [entrada, setEntrada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fin, setFin] = useState(false);
  const [riesgo, setRiesgo] = useState(false);
  const [devolucion, setDevolucion] = useState<DevolucionDialogo | null>(null);
  const [cargandoDevolucion, setCargandoDevolucion] = useState(false);
  const [errorDevolucion, setErrorDevolucion] = useState<string | null>(null);
  const [historialConsulta, setHistorialConsulta] = useState<TurnoConsulta[]>([]);
  const [entradaConsulta, setEntradaConsulta] = useState("");
  const [cargandoConsulta, setCargandoConsulta] = useState(false);
  const [errorConsulta, setErrorConsulta] = useState<string | null>(null);
  const [riesgoConsulta, setRiesgoConsulta] = useState(false);

  const escenario = escenarioId ? ESCENARIOS[escenarioId] : null;
  const limiteAlcanzado = historial.length >= LIMITES_DIALOGO.TURNOS_MAX;
  const limiteConsultaAlcanzado = historialConsulta.length >= LIMITES_CONSULTA.TURNOS_MAX;

  function iniciarEscena(def: (typeof ESCENARIOS)[EscenarioDialogo], edadElegida?: string) {
    setEscenarioId(def.id);
    setError(null);
    setFin(false);
    setRiesgo(false);
    setDevolucion(null);
    setErrorDevolucion(null);
    setHistorialConsulta([]);
    setEntradaConsulta("");
    setErrorConsulta(null);
    setRiesgoConsulta(false);
    if (def.personajeInicia && def.apertura) {
      setHistorial([{ rol: "personaje", texto: def.apertura(edadElegida) }]);
    } else {
      setHistorial([]);
    }
    setPaso("chat");
  }

  function elegir(id: EscenarioDialogo) {
    const def = ESCENARIOS[id];
    setEscenarioId(id);
    if (def.necesitaEdad) {
      setPaso("edad");
      return;
    }
    iniciarEscena(def);
  }

  function confirmarEdad(e: React.FormEvent) {
    e.preventDefault();
    if (!escenario) return;
    iniciarEscena(escenario, edad.trim() || undefined);
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!escenario || !entrada.trim() || cargando || limiteAlcanzado) return;

    const nuevoHistorial: TurnoDialogo[] = [...historial, { rol: "usuario", texto: entrada.trim() }];
    setHistorial(nuevoHistorial);
    setEntrada("");
    setCargando(true);
    setError(null);

    try {
      const res = await fetch("/api/dialogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escenario: escenario.id, edad: edad || undefined, historial: nuevoHistorial }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Algo salió mal. Probá de nuevo.");
        return;
      }
      setHistorial([...nuevoHistorial, { rol: "personaje", texto: data.mensaje }]);
      setFin(!!data.fin);
      setRiesgo(!!data.riesgo);
    } catch {
      setError("No se pudo conectar con el servidor. Revisá tu conexión.");
    } finally {
      setCargando(false);
    }
  }

  async function pedirDevolucion() {
    if (!escenario || cargandoDevolucion || devolucion) return;
    setCargandoDevolucion(true);
    setErrorDevolucion(null);
    try {
      const res = await fetch("/api/dialogo-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escenario: escenario.id, historial }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorDevolucion(data.error ?? "No se pudo armar la devolución.");
        return;
      }
      setDevolucion(data);
    } catch {
      setErrorDevolucion("No se pudo conectar con el servidor.");
    } finally {
      setCargandoDevolucion(false);
    }
  }

  async function enviarConsulta(e: React.FormEvent) {
    e.preventDefault();
    if (!escenario || !devolucion || !entradaConsulta.trim() || cargandoConsulta || limiteConsultaAlcanzado) return;

    const nuevoHistorialConsulta: TurnoConsulta[] = [
      ...historialConsulta,
      { rol: "usuario", texto: entradaConsulta.trim() },
    ];
    setHistorialConsulta(nuevoHistorialConsulta);
    setEntradaConsulta("");
    setCargandoConsulta(true);
    setErrorConsulta(null);

    try {
      const res = await fetch("/api/dialogo-consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          escenario: escenario.id,
          historialEscena: historial,
          devolucion,
          historialConsulta: nuevoHistorialConsulta,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorConsulta(data.error ?? "Algo salió mal. Probá de nuevo.");
        return;
      }
      setHistorialConsulta([...nuevoHistorialConsulta, { rol: "coach", texto: data.respuesta }]);
      setRiesgoConsulta(!!data.riesgo);
    } catch {
      setErrorConsulta("No se pudo conectar con el servidor.");
    } finally {
      setCargandoConsulta(false);
    }
  }

  function volver() {
    setPaso("elegir");
    setEscenarioId(null);
    setHistorial([]);
    setEntrada("");
    setError(null);
    setFin(false);
    setRiesgo(false);
    setDevolucion(null);
    setErrorDevolucion(null);
    setHistorialConsulta([]);
    setEntradaConsulta("");
    setErrorConsulta(null);
    setRiesgoConsulta(false);
  }

  function repetirEscena() {
    if (escenario) iniciarEscena(escenario, edad.trim() || undefined);
  }

  if (paso === "elegir") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-cuerpo text-negro">
          Elegí una situación para practicar. Vos escribís lo que dirías, y el personaje responde
          de verdad — así podés practicar cómo seguir la charla.
        </p>
        <div className="flex flex-col gap-3">
          {Object.values(ESCENARIOS).map((def) => (
            <button
              key={def.id}
              type="button"
              onClick={() => elegir(def.id)}
              className="min-h-[48px] rounded border border-borde bg-blanco p-3 text-left hover:border-rosa-hondo hover:bg-papel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo"
            >
              <p className="text-cuerpo font-medium text-negro">{def.titulo}</p>
              <p className="text-secundario text-negro-suave">{def.descripcion}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (paso === "edad" && escenario) {
    return (
      <form onSubmit={confirmarEdad} className="flex flex-col gap-4">
        <button
          type="button"
          onClick={volver}
          className="self-start text-secundario text-negro-suave underline"
        >
          ← Elegir otra situación
        </button>
        <p className="text-cuerpo text-negro">
          Para que el personaje hable como alguien de tu edad, ¿cuántos años tenés? (opcional)
        </p>
        <input
          type="number"
          min={1}
          max={120}
          inputMode="numeric"
          placeholder="Tu edad (opcional)"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          className="min-h-[48px] w-32 rounded border border-borde bg-blanco p-3 text-base text-negro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo"
        />
        <button
          type="submit"
          className="min-h-[48px] w-full rounded border border-rosa-hondo bg-rosa-claro px-4 py-3 text-base font-medium text-negro hover:opacity-90"
        >
          Empezar
        </button>
      </form>
    );
  }

  if (paso === "chat" && escenario) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={volver} className="text-secundario text-negro-suave underline">
            ← Elegir otra situación
          </button>
          <span className="rounded-full border border-rosa-hondo bg-rosa-claro px-3 py-1 text-pildora font-medium text-negro">
            {escenario.titulo}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {historial.map((t, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg p-3 ${
                t.rol === "personaje"
                  ? "self-start border border-borde bg-blanco"
                  : "self-end border border-celeste-medio bg-celeste-claro"
              }`}
            >
              <p className={`text-cuerpo text-negro ${t.rol === "personaje" ? "font-mono" : ""}`}>
                {t.texto}
              </p>
            </div>
          ))}
          {cargando && (
            <div className="max-w-[85%] self-start rounded-lg border border-borde bg-blanco p-3">
              <p className="text-cuerpo text-negro-suave italic">Escribiendo...</p>
            </div>
          )}
        </div>

        {error && <p className="rounded border border-negro p-3 text-cuerpo text-negro">{error}</p>}

        {fin && (
          <div className="rounded border border-rosa-hondo bg-rosa-claro p-3">
            <p className="text-cuerpo text-negro">
              {riesgo ? "La escena se cortó acá." : "La escena llegó a un cierre natural."}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {!riesgo && !devolucion && (
                <button
                  type="button"
                  onClick={pedirDevolucion}
                  disabled={cargandoDevolucion}
                  className="min-h-[44px] rounded border border-rosa-hondo bg-blanco px-3 py-2 text-secundario font-medium text-negro hover:bg-papel disabled:opacity-50"
                >
                  {cargandoDevolucion ? "Armando la devolución..." : "Ver devolución"}
                </button>
              )}
              <button
                type="button"
                onClick={repetirEscena}
                className="min-h-[44px] rounded border border-borde bg-blanco px-3 py-2 text-secundario text-negro hover:bg-papel"
              >
                Repetir esta escena
              </button>
              <button
                type="button"
                onClick={volver}
                className="min-h-[44px] rounded border border-borde bg-blanco px-3 py-2 text-secundario text-negro hover:bg-papel"
              >
                Elegir otra
              </button>
            </div>
          </div>
        )}

        {errorDevolucion && (
          <p className="rounded border border-negro p-3 text-cuerpo text-negro">{errorDevolucion}</p>
        )}

        {devolucion && (
          <div className="animar-entrada flex flex-col gap-4 rounded-lg border border-borde bg-blanco p-4">
            <p className="text-pildora font-semibold tracking-wide text-negro-suave uppercase">
              Devolución
            </p>
            <p className="text-cuerpo text-negro">{devolucion.resumen}</p>

            {devolucion.observaciones.length > 0 && (
              <div className="flex flex-col gap-3">
                {devolucion.observaciones.map((o, i) => (
                  <div key={i} className="rounded border border-borde p-3">
                    <p className="font-mono text-secundario text-negro-suave">“{o.dijiste}”</p>
                    <p className="mt-2 text-cuerpo text-negro">{o.efecto}</p>
                    <p className="mt-2 text-secundario text-negro-suave">
                      <span className="font-medium text-negro">Alternativa: </span>
                      {o.alternativa}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-cuerpo text-negro">{devolucion.cierre}</p>
          </div>
        )}

        {devolucion && historialConsulta.length > 0 && (
          <div className="flex flex-col gap-3">
            {historialConsulta.map((t, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg p-3 ${
                  t.rol === "coach"
                    ? "self-start border border-borde bg-blanco"
                    : "self-end border border-celeste-medio bg-celeste-claro"
                }`}
              >
                <p className="text-cuerpo text-negro">{t.texto}</p>
              </div>
            ))}
            {cargandoConsulta && (
              <div className="max-w-[85%] self-start rounded-lg border border-borde bg-blanco p-3">
                <p className="text-cuerpo text-negro-suave italic">Escribiendo...</p>
              </div>
            )}
          </div>
        )}

        {errorConsulta && (
          <p className="rounded border border-negro p-3 text-cuerpo text-negro">{errorConsulta}</p>
        )}

        {devolucion && !riesgoConsulta && (
          <form onSubmit={enviarConsulta} className="flex flex-col gap-2">
            {limiteConsultaAlcanzado && (
              <p className="text-secundario text-negro-suave">
                Esta consulta ya fue larga. Si querés seguir, probá una escena nueva.
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={LIMITES_CONSULTA.MENSAJE_MAX}
                placeholder="¿Alguna duda o comentario sobre esto?"
                value={entradaConsulta}
                onChange={(e) => setEntradaConsulta(e.target.value)}
                disabled={cargandoConsulta || limiteConsultaAlcanzado}
                className="min-h-[48px] min-w-0 flex-1 rounded border border-borde bg-blanco p-3 text-base text-negro placeholder:text-negro-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={cargandoConsulta || !entradaConsulta.trim() || limiteConsultaAlcanzado}
                className="min-h-[48px] shrink-0 rounded border border-rosa-hondo bg-rosa-claro px-4 text-base font-medium text-negro hover:opacity-90 disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </form>
        )}

        {!fin && (
          <form onSubmit={enviar} className="sticky bottom-0 flex flex-col gap-2 bg-papel pt-2 pb-3">
            {limiteAlcanzado && (
              <p className="text-secundario text-negro-suave">
                Esta escena ya fue larga. Empezá una nueva para seguir practicando.
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={LIMITES_DIALOGO.MENSAJE_MAX}
                placeholder={escenario.placeholderInicial}
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                disabled={cargando || limiteAlcanzado}
                className="min-h-[48px] min-w-0 flex-1 rounded border border-borde bg-blanco p-3 text-base text-negro placeholder:text-negro-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celeste-hondo disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={cargando || !entrada.trim() || limiteAlcanzado}
                className="min-h-[48px] shrink-0 rounded border border-rosa-hondo bg-rosa-claro px-4 text-base font-medium text-negro hover:opacity-90 disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return null;
}
