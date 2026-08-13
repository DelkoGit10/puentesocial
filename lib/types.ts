// Contrato de datos de SocialBridge AI.
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
