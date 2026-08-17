// Contrato de datos de PuenteSocial.
// Derivado del esquema validado sobre 50 casos (40 + 10 holdout).
// Si cambia el prompt, cambia esto primero.

export type NivelAmbiguedad = "baja" | "media" | "alta";
export type Confianza = "alta" | "media" | "baja";
export type Urgencia = "ninguna" | "baja" | "media" | "alta";
export type Registro = "directa" | "cauta" | "aclaratoria";

// Vocabulario cerrado, no texto libre: el cruce categoría × relación del
// patrón personal solo es confiable si "relación" siempre significa lo mismo.
export const RELACIONES = [
  "jefe",
  "compañero de trabajo",
  "amigo",
  "pareja",
  "familiar",
  "conocido",
  "desconocido",
] as const;

export type Relacion = (typeof RELACIONES)[number];

export const ETIQUETA_RELACION: Record<Relacion, string> = {
  jefe: "Jefe/a",
  "compañero de trabajo": "Compañero/a de trabajo",
  amigo: "Amigo/a",
  pareja: "Pareja",
  familiar: "Familiar",
  conocido: "Conocido/a",
  desconocido: "Desconocido/a",
};

export const CATEGORIAS = [
  "ironia",
  "pedido_indirecto",
  "critica_suave",
  "desinteres",
  "cortesia_formula",
  "limite",
  "ambiguedad_genuina",
  "literal",
  "conflicto",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/** Etiquetas para mostrar en pantalla. El usuario nunca ve el snake_case. */
export const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  ironia: "Ironía",
  pedido_indirecto: "Pedido indirecto",
  critica_suave: "Crítica suave",
  desinteres: "Desinterés",
  cortesia_formula: "Fórmula de cortesía",
  limite: "Límite del otro",
  ambiguedad_genuina: "Ambiguo de verdad",
  literal: "Literal",
  conflicto: "Conflicto",
};

export interface Interpretacion {
  significado: string;
  confianza: Confianza;
  senales: string[];
}

export interface Analisis {
  ambiguedad: { nivel: NivelAmbiguedad; explicacion: string };
  lectura_literal: string;
  interpretaciones: Interpretacion[];
  pedido: {
    hay_pedido: boolean;
    que_pide: string | null;
    requiere_respuesta: boolean;
    urgencia: Urgencia;
  };
  respuestas: { registro: Registro; texto: string; cuando_usarla: string }[];
  por_que: { senal: string; significado: string }[];
  categoria: Categoria;
  bandera_seguridad: string | null;
}

export interface EntradaAnalisis {
  mensaje: string;
  relacion: Relacion | "";
  canal: string;
  contexto: string;
}

/**
 * Lo que se guarda en localStorage. Nunca sale del dispositivo.
 * "tuvoBanderaSeguridad" existe para poder excluir estos casos del patrón:
 * una situación de riesgo relacional o angustia genuina no es un ítem de
 * estadística de "cómo interpreto mensajes".
 */
export interface EntradaHistorial {
  id: string;
  fecha: number;
  mensaje: string;
  relacion: Relacion;
  categoria: Categoria;
  ambiguedad: NivelAmbiguedad;
  tuvoBanderaSeguridad: boolean;
  /**
   * Análisis completo, para poder ver el detalle de vuelta al hacer click.
   * Opcional porque las entradas guardadas antes de agregar este campo no
   * lo tienen — hay que seguir mostrándolas sin romper.
   */
  analisis?: Analisis;
}

// Práctica: contenido precalculado (nunca llama a /api/analizar en vivo).
export const AMBITOS = ["escuela", "trabajo", "familia", "relaciones"] as const;
export type Ambito = (typeof AMBITOS)[number];

export const ETIQUETA_AMBITO: Record<Ambito, string> = {
  escuela: "Escuela",
  trabajo: "Trabajo",
  familia: "Familia",
  relaciones: "Relaciones",
};

export interface OpcionInterpretacion {
  texto: string;
  correcta: boolean;
}

export interface CasoPractica {
  id: string;
  ambito: Ambito;
  mensaje: string;
  relacion: string;
  canal: string;
  contexto: string;
  opciones: OpcionInterpretacion[];
  analisis: Analisis;
}

/** Progreso de práctica en localStorage. Separado del historial real: no
 * cuenta para el patrón personal, que describe lo que el usuario trajo de
 * su vida, no ejercicios. */
export interface ProgresoPractica {
  [casoId: string]: { acerto: boolean; fecha: number };
}

// Diálogos guiados: la única parte de la app con memoria de conversación y
// llamadas en vivo. Separado a propósito del resto (que no tiene memoria).
export const ESCENARIOS_DIALOGO = [
  "cumpleanos",
  "aeropuerto",
  "banco",
  "calle",
  "alguien_te_habla",
] as const;
export type EscenarioDialogo = (typeof ESCENARIOS_DIALOGO)[number];

export interface TurnoDialogo {
  rol: "usuario" | "personaje";
  texto: string;
}

export interface RespuestaDialogo {
  mensaje: string;
  fin: boolean;
  /** true solo cuando el cierre fue por el resguardo de riesgo real, no un
   * cierre natural de escena. La UI usa esto para no ofrecer una devolución
   * de estilo de comunicación justo después de un momento así. */
  riesgo?: boolean;
}

export function esRespuestaDialogoValida(x: unknown): x is RespuestaDialogo {
  const r = x as RespuestaDialogo;
  return !!r && typeof r.mensaje === "string" && typeof r.fin === "boolean";
}

/** Devolución sobre cómo respondió el usuario en una escena de diálogo.
 * Nunca diagnostica ni puntúa — describe patrones del texto y ofrece
 * alternativas, con el mismo criterio de "ni cortante ni verborrágico". */
export interface ObservacionDevolucion {
  dijiste: string;
  efecto: string;
  alternativa: string;
}

export interface DevolucionDialogo {
  resumen: string;
  observaciones: ObservacionDevolucion[];
  cierre: string;
}

export function esDevolucionValida(x: unknown): x is DevolucionDialogo {
  const d = x as DevolucionDialogo;
  return (
    !!d &&
    typeof d.resumen === "string" &&
    Array.isArray(d.observaciones) &&
    d.observaciones.every(
      (o) => typeof o.dijiste === "string" && typeof o.efecto === "string" && typeof o.alternativa === "string"
    ) &&
    typeof d.cierre === "string"
  );
}

export const LIMITES_DIALOGO = {
  MENSAJE_MAX: 500,
  TURNOS_MAX: 30, // 15 idas y vueltas; corta antes de que se vuelva una charla sin fin
} as const;

export const LIMITES = {
  MENSAJE_MAX: 1200,
  MENSAJE_MIN: 2,
  CONTEXTO_MAX: 400,
  HISTORIAL_MAX: 100,
} as const;

/**
 * Valida la forma del JSON que devuelve el modelo antes de renderizarlo.
 * Si el modelo alucina el formato, preferimos un error claro a una pantalla rota.
 */
export function esAnalisisValido(x: unknown): x is Analisis {
  const a = x as Analisis;
  return !!(
    a &&
    a.ambiguedad?.nivel &&
    typeof a.lectura_literal === "string" &&
    Array.isArray(a.interpretaciones) &&
    a.interpretaciones.length > 0 &&
    Array.isArray(a.respuestas) &&
    a.respuestas.length === 3 &&
    Array.isArray(a.por_que) &&
    CATEGORIAS.includes(a.categoria)
  );
}
