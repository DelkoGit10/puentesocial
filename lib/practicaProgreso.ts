import type { ProgresoPractica } from "@/lib/types";

// Clave separada de "socialbridge_historial" a propósito: el progreso de
// práctica no es historial real y no debe mezclarse con el patrón personal.
const CLAVE = "puentesocial_practica_progreso";

export function leerProgresoPractica(): ProgresoPractica {
  if (typeof window === "undefined") return {};
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return {};
    const datos = JSON.parse(crudo);
    return typeof datos === "object" && datos !== null ? datos : {};
  } catch {
    return {};
  }
}

export function guardarProgresoPractica(progreso: ProgresoPractica): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLAVE, JSON.stringify(progreso));
}
