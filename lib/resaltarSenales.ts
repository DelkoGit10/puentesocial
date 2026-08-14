export interface Segmento {
  texto: string;
  resaltado: boolean;
  /** Índice del ítem en "por_que" al que hay que saltar al tocar este segmento. */
  indice: number | null;
}

function normalizar(s: string): string {
  return s
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extrae fragmentos entre comillas de un texto de señal. Si no hay comillas, no hay nada citable. */
function extraerCitas(senal: string): string[] {
  const citas: string[] = [];
  const re = /['"]([^'"]{3,})['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(senal))) {
    citas.push(m[1]);
  }
  return citas;
}

/**
 * Encuentra dónde, dentro del mensaje original, aparece cada señal citada en
 * "por_que", para poder resaltarla en su lugar exacto. Si una señal no
 * coincide con el texto (porque el modelo la parafraseó), se descarta en
 * silencio: nunca rompe la pantalla, simplemente no se resalta.
 */
export function resaltarSenales(
  mensaje: string,
  porQue: { senal: string; significado: string }[]
): Segmento[] {
  const mensajeNorm = normalizar(mensaje).toLowerCase();

  type Rango = { inicio: number; fin: number; indice: number };
  const rangos: Rango[] = [];

  porQue.forEach((p, indice) => {
    const citas = extraerCitas(p.senal);
    for (const cita of citas) {
      const citaNorm = normalizar(cita).toLowerCase();
      if (citaNorm.length < 3) continue;
      const pos = mensajeNorm.indexOf(citaNorm);
      if (pos === -1) continue;
      rangos.push({ inicio: pos, fin: pos + citaNorm.length, indice });
    }
  });

  if (rangos.length === 0) {
    return [{ texto: mensaje, resaltado: false, indice: null }];
  }

  // Ordenar y descartar solapamientos (nos quedamos con el primero que aparece).
  rangos.sort((a, b) => a.inicio - b.inicio);
  const sinSolape: Rango[] = [];
  let limite = -1;
  for (const r of rangos) {
    if (r.inicio >= limite) {
      sinSolape.push(r);
      limite = r.fin;
    }
  }

  // mensajeNorm y mensaje pueden diferir en longitud si normalizar() colapsó
  // espacios; mapeamos posiciones buscando cada tramo directamente en el
  // mensaje original para preservar mayúsculas y espaciado reales.
  const segmentos: Segmento[] = [];
  let cursor = 0;
  const mensajeLower = mensaje.toLowerCase();

  for (const r of sinSolape) {
    const fragNorm = mensajeNorm.slice(r.inicio, r.fin);
    // Mismo texto, buscado directamente en el original (no normalizado) para
    // preservar mayúsculas y espaciado reales al mostrarlo.
    const inicioReal = mensajeLower.indexOf(fragNorm, cursor);
    if (inicioReal === -1) continue;

    if (inicioReal > cursor) {
      segmentos.push({ texto: mensaje.slice(cursor, inicioReal), resaltado: false, indice: null });
    }
    const finReal = inicioReal + fragNorm.length;
    segmentos.push({ texto: mensaje.slice(inicioReal, finReal), resaltado: true, indice: r.indice });
    cursor = finReal;
  }

  if (cursor < mensaje.length) {
    segmentos.push({ texto: mensaje.slice(cursor), resaltado: false, indice: null });
  }

  return segmentos.length > 0 ? segmentos : [{ texto: mensaje, resaltado: false, indice: null }];
}
