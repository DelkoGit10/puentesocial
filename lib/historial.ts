import { LIMITES, type EntradaHistorial } from "@/lib/types";

const CLAVE = "socialbridge_historial";

/** Nunca llamar durante SSR: localStorage no existe en el servidor. */
export function leerHistorial(): EntradaHistorial[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return [];
    const datos = JSON.parse(crudo);
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export function guardarHistorial(historial: EntradaHistorial[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLAVE, JSON.stringify(historial.slice(0, LIMITES.HISTORIAL_MAX)));
}

export function borrarHistorial(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLAVE);
}

export function crearEntrada(
  datos: Omit<EntradaHistorial, "id" | "fecha">
): EntradaHistorial {
  return {
    id: crypto.randomUUID(),
    fecha: Date.now(),
    ...datos,
  };
}
