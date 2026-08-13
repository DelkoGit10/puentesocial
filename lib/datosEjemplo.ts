import type { Analisis, EntradaHistorial } from "@/lib/types";

const DIA_MS = 24 * 60 * 60 * 1000;
const ahora = () => Date.now();

const RESPUESTA_GENERICA = (
  directa: string,
  cauta: string,
  aclaratoria: string
): Analisis["respuestas"] => [
  { registro: "directa", texto: directa, cuando_usarla: "Si querés ir al grano." },
  { registro: "cauta", texto: cauta, cuando_usarla: "Si preferís no forzar el tono." },
  { registro: "aclaratoria", texto: aclaratoria, cuando_usarla: "Si querés confirmar antes de responder." },
];

const base: (Omit<EntradaHistorial, "id" | "fecha" | "analisis"> & { analisis: Analisis })[] = [
  {
    mensaje: "Bárbaro, justo lo que necesitaba hoy.",
    relacion: "compañero de trabajo",
    categoria: "ironia",
    ambiguedad: "baja",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: {
        nivel: "baja",
        explicacion: "El contexto de una mala noticia laboral hace que la ironía sea la lectura casi segura.",
      },
      lectura_literal: "La persona dice que la noticia fue excelente y llegó en el momento perfecto.",
      interpretaciones: [
        {
          significado: "Está expresando fastidio por la mala noticia, no agradecimiento. No está enojado con vos.",
          confianza: "alta",
          senales: ["'Bárbaro' aplicado a una mala noticia es una exageración imposible: nadie lo dice en serio."],
        },
      ],
      pedido: { hay_pedido: false, que_pide: null, requiere_respuesta: true, urgencia: "baja" },
      respuestas: RESPUESTA_GENERICA(
        "Sí, pésimo momento. Ya estoy viendo cómo resolverlo.",
        "Lo sé, lo lamento. Te aviso en cuanto lo tenga.",
        "Entiendo que viene mal. ¿Hay algo puntual que necesites priorizar?"
      ),
      por_que: [
        { senal: "'Bárbaro, justo lo que necesitaba'", significado: "Elogio exagerado aplicado a una mala noticia: fórmula irónica clásica." },
      ],
      categoria: "ironia",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "Qué puntual como siempre.",
    relacion: "jefe",
    categoria: "ironia",
    ambiguedad: "baja",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: {
        nivel: "baja",
        explicacion: "Sin contexto de puntualidad real, el tono irónico es la lectura más sostenible.",
      },
      lectura_literal: "El jefe dice que siempre sos puntual.",
      interpretaciones: [
        {
          significado: "Es un reproche irónico por llegar tarde, no un elogio real.",
          confianza: "alta",
          senales: ["'Como siempre' funciona como acumulación: marca que no es la primera vez."],
        },
      ],
      pedido: { hay_pedido: true, que_pide: "Que llegues a horario de ahora en más.", requiere_respuesta: true, urgencia: "media" },
      respuestas: RESPUESTA_GENERICA(
        "Tenés razón, me atrasé. No va a volver a pasar.",
        "Perdón por la tardanza, ya estoy acá.",
        "¿Te sirve si arrancamos ahora o preferís que reagendemos unos minutos?"
      ),
      por_que: [
        { senal: "'Como siempre'", significado: "Marca un patrón repetido, no un hecho aislado: intensifica el reproche." },
      ],
      categoria: "ironia",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "Espectacular la reunión de hoy, eh.",
    relacion: "compañero de trabajo",
    categoria: "ironia",
    ambiguedad: "baja",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: {
        nivel: "baja",
        explicacion: "El 'eh' final busca complicidad, típico de la queja compartida.",
      },
      lectura_literal: "La persona dice que la reunión de hoy fue espectacular.",
      interpretaciones: [
        {
          significado: "Le pareció una pérdida de tiempo y busca que se lo confirmes.",
          confianza: "alta",
          senales: ["'Espectacular' sin ningún detalle concreto que lo sostenga.", "El 'eh' al final invita a coincidir con la queja."],
        },
      ],
      pedido: { hay_pedido: true, que_pide: "Que compartas su opinión sobre la reunión.", requiere_respuesta: false, urgencia: "ninguna" },
      respuestas: RESPUESTA_GENERICA(
        "Ni me hables, dos horas para nada.",
        "Sí, se estiró bastante eh.",
        "¿Te quedó alguna duda de lo que se definió o tampoco quedó claro?"
      ),
      por_que: [
        { senal: "'eh' al final", significado: "Muletilla que busca acuerdo compartido, típica del sarcasmo entre compañeros." },
      ],
      categoria: "ironia",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "Che, ¿viste que el informe todavía no está subido?",
    relacion: "jefe",
    categoria: "pedido_indirecto",
    ambiguedad: "baja",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: {
        nivel: "baja",
        explicacion: "Tiene forma de pregunta, pero el jefe ya sabe la respuesta: es un reclamo, no una consulta.",
      },
      lectura_literal: "El jefe pregunta si el usuario notó que el informe no está subido.",
      interpretaciones: [
        {
          significado: "Está marcando que el informe se atrasó y espera que lo subas o expliques por qué no está.",
          confianza: "alta",
          senales: ["Pregunta que no busca información real: el jefe ya lo sabe.", "'Todavía' marca que había un plazo que ya pasó."],
        },
      ],
      pedido: { hay_pedido: true, que_pide: "Que subas el informe o expliques cuándo lo vas a subir.", requiere_respuesta: true, urgencia: "alta" },
      respuestas: RESPUESTA_GENERICA(
        "Sí, me demoré. Lo subo en los próximos minutos.",
        "Estoy terminándolo, lo tenés antes de las [hora].",
        "¿Hay algo puntual que necesites de ahí para priorizarlo?"
      ),
      por_que: [
        { senal: "'¿viste que...no está subido?'", significado: "Pregunta retórica: no pide información, marca el incumplimiento." },
      ],
      categoria: "pedido_indirecto",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "No, tranqui, total tengo todo el tiempo del mundo.",
    relacion: "compañero de trabajo",
    categoria: "ironia",
    ambiguedad: "baja",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: { nivel: "baja", explicacion: "La exageración imposible deja poco margen para la lectura literal." },
      lectura_literal: "Dice que no tiene apuro y que dispone de todo el tiempo que haga falta.",
      interpretaciones: [
        {
          significado: "Sí le molesta la demora y hay urgencia real. 'Tranqui' funciona al revés de lo que dice.",
          confianza: "alta",
          senales: ["'Todo el tiempo del mundo' es una exageración imposible: nadie lo tiene."],
        },
      ],
      pedido: { hay_pedido: true, que_pide: "Que le mandes tu parte cuanto antes.", requiere_respuesta: true, urgencia: "alta" },
      respuestas: RESPUESTA_GENERICA(
        "Perdón, sé que te corre. Te lo mando hoy sin falta.",
        "Entiendo, lo tenés en un rato.",
        "¿Para cuándo lo necesitás en concreto, así no te dejo esperando?"
      ),
      por_que: [
        { senal: "'todo el tiempo del mundo'", significado: "Exageración imposible: marca ironía, no disponibilidad real." },
      ],
      categoria: "ironia",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "Interesante el enfoque. Distinto.",
    relacion: "jefe",
    categoria: "critica_suave",
    ambiguedad: "media",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: {
        nivel: "media",
        explicacion: "'Distinto' sin elogio concreto puede ser aprobación contenida o desacuerdo educado.",
      },
      lectura_literal: "Dice que el enfoque le pareció interesante y diferente a lo esperado.",
      interpretaciones: [
        {
          significado: "No está del todo conforme y lo dice con cautela, sin rechazar la propuesta de frente.",
          confianza: "media",
          senales: ["Sin ningún elogio concreto ni próximos pasos.", "'Distinto' puede leerse como que se alejó de lo esperado."],
        },
        {
          significado: "Le gustó genuinamente, pero no tiene el hábito de elogiar con detalle.",
          confianza: "media",
          senales: ["'Interesante' en un contexto formal puede ser aprobación real, aunque contenida."],
        },
      ],
      pedido: { hay_pedido: false, que_pide: null, requiere_respuesta: true, urgencia: "baja" },
      respuestas: RESPUESTA_GENERICA(
        "Gracias. ¿Querés que ajuste algo puntual del enfoque?",
        "Genial, cualquier feedback más específico me sirve.",
        "¿Qué es lo que te resultó distinto — para bien o hay algo que cambiarías?"
      ),
      por_que: [
        { senal: "'Distinto' sin más detalle", significado: "Palabra neutra que no confirma aprobación ni rechazo por sí sola." },
      ],
      categoria: "critica_suave",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "Uy, qué lío esto de la planilla...",
    relacion: "compañero de trabajo",
    categoria: "pedido_indirecto",
    ambiguedad: "media",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: {
        nivel: "media",
        explicacion: "Sin pedir ayuda de forma explícita, pero el comentario espontáneo suele funcionar como una.",
      },
      lectura_literal: "Dice que la planilla le está resultando complicada.",
      interpretaciones: [
        {
          significado: "Probablemente busca que le ofrezcas ayuda, sin pedirla directamente.",
          confianza: "media",
          senales: ["Comentario espontáneo sobre una dificultad, dicho en voz alta cerca de alguien que sabe del tema."],
        },
      ],
      pedido: { hay_pedido: true, que_pide: "Ayuda con la planilla, aunque no lo pida explícitamente.", requiere_respuesta: false, urgencia: "baja" },
      respuestas: RESPUESTA_GENERICA(
        "Pasame que le doy una mirada.",
        "¿Necesitás una mano con eso?",
        "¿Es algo puntual o te trabaste en general? Así veo cómo ayudo mejor."
      ),
      por_que: [
        { senal: "'Uy, qué lío...'", significado: "Queja en voz alta sin pedido explícito: función típica de pedido indirecto." },
      ],
      categoria: "pedido_indirecto",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "Dale, cualquier cosa te aviso.",
    relacion: "amigo",
    categoria: "desinteres",
    ambiguedad: "media",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: {
        nivel: "media",
        explicacion: "Es una fórmula de cierre muy reconocible, aunque no se puede descartar del todo que avise.",
      },
      lectura_literal: "Dice que si necesita algo, va a avisar.",
      interpretaciones: [
        {
          significado: "Cierre cortés que probablemente no se traduce en un aviso real. No es un rechazo personal.",
          confianza: "alta",
          senales: ["'Cualquier cosa te aviso' es una fórmula de cierre que rara vez se sigue de un aviso concreto."],
        },
      ],
      pedido: { hay_pedido: false, que_pide: null, requiere_respuesta: false, urgencia: "ninguna" },
      respuestas: RESPUESTA_GENERICA(
        "Buenísimo, cuando quieras.",
        "Perfecto, acá ando si surge algo.",
        "Che, en serio, si en algún momento te sirve una mano avisame."
      ),
      por_que: [
        { senal: "'Dale, cualquier cosa te aviso'", significado: "Fórmula de cierre social: en la práctica funciona como 'gracias, pero no hace falta'." },
      ],
      categoria: "desinteres",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "Como quieras.",
    relacion: "pareja",
    categoria: "ambiguedad_genuina",
    ambiguedad: "alta",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: {
        nivel: "alta",
        explicacion: "Puede ser flexibilidad genuina o fastidio contenido, y ninguna señal del texto inclina la balanza.",
      },
      lectura_literal: "Dice que está de acuerdo con lo que decidas vos.",
      interpretaciones: [
        {
          significado: "Le da lo mismo de verdad y no tiene preferencia sobre este tema puntual.",
          confianza: "media",
          senales: ["Frase corta pero sin ningún otro indicio de tensión previa."],
        },
        {
          significado: "Está fastidiada y prefiere no discutir, cediendo en vez de decir lo que realmente quiere.",
          confianza: "media",
          senales: ["'Como quieras' sin ninguna alternativa propia puede indicar resignación."],
        },
      ],
      pedido: { hay_pedido: false, que_pide: null, requiere_respuesta: false, urgencia: "ninguna" },
      respuestas: RESPUESTA_GENERICA(
        "Dale, entonces vamos con esa opción.",
        "¿Va en serio o preferís que decidamos juntos?",
        "En serio, decime si tenés alguna preferencia — prefiero saberlo antes de elegir."
      ),
      por_que: [
        { senal: "'Como quieras' sin alternativa propia", significado: "No hay forma de distinguir desde el texto entre acuerdo genuino y resignación." },
      ],
      categoria: "ambiguedad_genuina",
      bandera_seguridad: null,
    },
  },
  {
    mensaje: "Tenemos que juntarnos un día de estos.",
    relacion: "amigo",
    categoria: "cortesia_formula",
    ambiguedad: "baja",
    tuvoBanderaSeguridad: false,
    analisis: {
      ambiguedad: { nivel: "baja", explicacion: "Es una fórmula social muy reconocible de cierre, sin propuesta concreta." },
      lectura_literal: "Dice que deberían juntarse en algún momento.",
      interpretaciones: [
        {
          significado: "Es un gesto de cariño al cerrar el intercambio, no un plan real todavía.",
          confianza: "alta",
          senales: ["Sin fecha, hora ni lugar propuesto: fórmula social de cierre amable."],
        },
      ],
      pedido: { hay_pedido: false, que_pide: null, requiere_respuesta: false, urgencia: "ninguna" },
      respuestas: RESPUESTA_GENERICA(
        "Sí, dale. ¿Qué tal el finde que viene?",
        "Totalmente, en cuanto tenga un hueco te aviso.",
        "Me encantaría, ¿tenés algún día en mente o coordinamos?"
      ),
      por_que: [
        { senal: "Sin fecha ni propuesta concreta", significado: "Ausencia de detalle es la señal típica de que es cortesía, no un plan en marcha." },
      ],
      categoria: "cortesia_formula",
      bandera_seguridad: null,
    },
  },
];

/**
 * Datos ficticios para mostrar el patrón (y el detalle de cada consulta)
 * funcionando a alguien que entra por primera vez con el historial vacío
 * (el jurado incluido). Nunca se guardan en localStorage: viven solo en
 * memoria mientras dura el modo ejemplo.
 */
export function generarDatosEjemplo(): EntradaHistorial[] {
  return base.map((entrada, i) => ({
    ...entrada,
    id: `ejemplo-${i}`,
    // Más reciente primero, espaciado en las últimas dos semanas.
    fecha: ahora() - i * 1.4 * DIA_MS,
  }));
}
