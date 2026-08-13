import type { Categoria, EntradaHistorial, Relacion } from "@/lib/types";
import { ETIQUETA_CATEGORIA } from "@/lib/types";

export const MIN_PARA_PATRON = 5;

const RELACION_EN_FRASE: Record<Relacion, string> = {
  jefe: "tu jefe",
  "compañero de trabajo": "compañeros de trabajo",
  amigo: "amigos",
  pareja: "tu pareja",
  familiar: "familiares",
  conocido: "conocidos",
  desconocido: "desconocidos",
};

function masFrecuente<T extends string>(items: T[]): { valor: T; cuenta: number } | null {
  if (items.length === 0) return null;
  const conteo = new Map<T, number>();
  for (const item of items) conteo.set(item, (conteo.get(item) ?? 0) + 1);
  let mejor: { valor: T; cuenta: number } | null = null;
  for (const [valor, cuenta] of conteo) {
    if (!mejor || cuenta > mejor.cuenta) mejor = { valor, cuenta };
  }
  return mejor;
}

function descriptorProporcion(p: number): string {
  if (p >= 0.8) return "casi todas";
  if (p >= 0.5) return "la mayoría";
  if (p >= 0.3) return "varias";
  return "algunas";
}

export type Patron =
  | { listo: false; elegibles: number; faltan: number }
  | {
      listo: true;
      total: number;
      titular: string;
      desglose: { categoria: Categoria; cuenta: number }[];
      excluidosPorSeguridad: number;
    };

/**
 * El patrón describe los MENSAJES que trajo el usuario, nunca a la persona:
 * "9 de 14 eran ironía", jamás "te cuesta detectar la ironía". Los casos con
 * bandera de seguridad quedan afuera del agregado: no son un ítem de
 * estadística de estilo de comunicación.
 */
export function calcularPatron(historial: EntradaHistorial[]): Patron {
  const elegibles = historial.filter((h) => !h.tuvoBanderaSeguridad);
  const excluidosPorSeguridad = historial.length - elegibles.length;

  if (elegibles.length < MIN_PARA_PATRON) {
    return { listo: false, elegibles: elegibles.length, faltan: MIN_PARA_PATRON - elegibles.length };
  }

  const relacionDominante = masFrecuente(elegibles.map((e) => e.relacion))!;
  const delGrupo = elegibles.filter((e) => e.relacion === relacionDominante.valor);
  const categoriaDominante = masFrecuente(delGrupo.map((e) => e.categoria))!;
  const proporcion = categoriaDominante.cuenta / delGrupo.length;

  const titular =
    `${relacionDominante.cuenta} de tus ${elegibles.length} consultas fueron mensajes de ` +
    `${RELACION_EN_FRASE[relacionDominante.valor]}, y ${descriptorProporcion(proporcion)} eran ` +
    `${ETIQUETA_CATEGORIA[categoriaDominante.valor].toLowerCase()}.`;

  const conteoCategorias = new Map<Categoria, number>();
  for (const e of elegibles) conteoCategorias.set(e.categoria, (conteoCategorias.get(e.categoria) ?? 0) + 1);
  const desglose = [...conteoCategorias.entries()]
    .map(([categoria, cuenta]) => ({ categoria, cuenta }))
    .sort((a, b) => b.cuenta - a.cuenta);

  return { listo: true, total: elegibles.length, titular, desglose, excluidosPorSeguridad };
}
