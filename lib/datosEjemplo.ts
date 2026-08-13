import type { EntradaHistorial } from "@/lib/types";

const DIA_MS = 24 * 60 * 60 * 1000;
const ahora = () => Date.now();

/**
 * Datos ficticios para mostrar el patrón funcionando a alguien que entra por
 * primera vez con el historial vacío (el jurado incluido). Nunca se guardan
 * en localStorage: viven solo en memoria mientras dura el modo ejemplo.
 */
export function generarDatosEjemplo(): EntradaHistorial[] {
  const base: Omit<EntradaHistorial, "id" | "fecha">[] = [
    { mensaje: "Bárbaro, justo lo que necesitaba hoy.", relacion: "compañero de trabajo", categoria: "ironia", ambiguedad: "baja", tuvoBanderaSeguridad: false },
    { mensaje: "Qué puntual como siempre.", relacion: "jefe", categoria: "ironia", ambiguedad: "baja", tuvoBanderaSeguridad: false },
    { mensaje: "Espectacular la reunión de hoy, eh.", relacion: "compañero de trabajo", categoria: "ironia", ambiguedad: "baja", tuvoBanderaSeguridad: false },
    { mensaje: "Che, ¿viste que el informe todavía no está subido?", relacion: "jefe", categoria: "pedido_indirecto", ambiguedad: "baja", tuvoBanderaSeguridad: false },
    { mensaje: "No, tranqui, total tengo todo el tiempo del mundo.", relacion: "compañero de trabajo", categoria: "ironia", ambiguedad: "baja", tuvoBanderaSeguridad: false },
    { mensaje: "Interesante el enfoque. Distinto.", relacion: "jefe", categoria: "critica_suave", ambiguedad: "media", tuvoBanderaSeguridad: false },
    { mensaje: "Uy, qué lío esto de la planilla...", relacion: "compañero de trabajo", categoria: "pedido_indirecto", ambiguedad: "media", tuvoBanderaSeguridad: false },
    { mensaje: "Dale, cualquier cosa te aviso.", relacion: "amigo", categoria: "desinteres", ambiguedad: "media", tuvoBanderaSeguridad: false },
    { mensaje: "Como quieras.", relacion: "pareja", categoria: "ambiguedad_genuina", ambiguedad: "alta", tuvoBanderaSeguridad: false },
    { mensaje: "Tenemos que juntarnos un día de estos.", relacion: "amigo", categoria: "cortesia_formula", ambiguedad: "baja", tuvoBanderaSeguridad: false },
  ];

  return base.map((entrada, i) => ({
    ...entrada,
    id: `ejemplo-${i}`,
    // Más reciente primero, espaciado en las últimas dos semanas.
    fecha: ahora() - i * 1.4 * DIA_MS,
  }));
}
