import type { EscenarioDialogo } from "@/lib/types";

export interface DefinicionEscenario {
  id: EscenarioDialogo;
  titulo: string;
  descripcion: string;
  necesitaEdad: boolean;
  /** Si el personaje habla primero, o si el usuario tiene que arrancar. */
  personajeInicia: boolean;
  /** Línea de apertura, cuando personajeInicia es true. Fija: no hace falta
   * una llamada a la API solo para arrancar la escena. */
  apertura?: (edad?: string) => string;
  /** Se inserta en el prompt del sistema para armar el personaje y la escena. */
  contexto: (edad?: string) => string;
  placeholderInicial: string;
}

export const ESCENARIOS: Record<EscenarioDialogo, DefinicionEscenario> = {
  cumpleanos: {
    id: "cumpleanos",
    titulo: "Cumpleaños",
    descripcion: "Alguien de tu edad, en una fiesta donde no conocés a casi nadie.",
    necesitaEdad: true,
    personajeInicia: true,
    apertura: () => "¿Vos también sos amigo del cumpleañero? No conozco a nadie acá tampoco jaja",
    contexto: (edad) =>
      `Sos alguien de más o menos ${edad ?? "la misma"} años, en el cumpleaños de un conocido en común con el usuario. No se conocen todavía. Estás cerca de la mesa con algo para tomar, sin mucho para hacer. El usuario te contestó porque le hablaste primero. Sé natural: temas genéricos de esa edad (música, series, el lugar, cómo conocés al cumpleañero), sin exagerar el entusiasmo.`,
    placeholderInicial: "Escribí tu respuesta...",
  },
  aeropuerto: {
    id: "aeropuerto",
    titulo: "Aeropuerto",
    descripcion: "Hacer el check-in de un vuelo, mostrador de la aerolínea.",
    necesitaEdad: false,
    personajeInicia: false,
    contexto: () =>
      `Sos un/a empleado/a de check-in de una aerolínea, en tu mostrador. El usuario se te acerca para hacer el check-in de su vuelo. Pedile lo que necesitás en el orden real (documento, si despacha valijas, preferencia de asiento) y respondé a lo que te diga. Profesional pero cordial, con el apuro normal de alguien atendiendo una fila. Si el usuario no te da un dato que pediste, volvé a pedirlo con naturalidad.`,
    placeholderInicial: "Escribí cómo te acercás al mostrador...",
  },
  banco: {
    id: "banco",
    titulo: "Banco",
    descripcion: "Un trámite en la ventanilla de atención al cliente.",
    necesitaEdad: false,
    personajeInicia: false,
    contexto: () =>
      `Sos un/a empleado/a de atención al cliente en un banco, en tu ventanilla. El usuario se acerca con una consulta o trámite que todavía no sabés cuál es — preguntale primero en qué lo podés ayudar. Sé profesional y claro, pedile los datos que hagan falta a medida que la charla avanza (DNI, número de cuenta, lo que corresponda).`,
    placeholderInicial: "Escribí cómo te acercás a la ventanilla...",
  },
  calle: {
    id: "calle",
    titulo: "Pedir una dirección",
    descripcion: "Parar a un desconocido en la calle para preguntar cómo llegar a algún lado.",
    necesitaEdad: false,
    personajeInicia: false,
    contexto: () =>
      `Sos un desconocido caminando por la calle. El usuario te para para pedirte una dirección. No conocés perfectamente la zona: ayudá como ayudaría cualquier persona común, con alguna duda normal, tal vez una indicación un poco imprecisa, como en la vida real. No sos un mapa perfecto.`,
    placeholderInicial: "Escribí cómo lo/la parás para preguntar...",
  },
  alguien_te_habla: {
    id: "alguien_te_habla",
    titulo: "Alguien te habla",
    descripcion: "Un conocido lejano te aborda con charla trivial en un momento cotidiano.",
    necesitaEdad: false,
    personajeInicia: true,
    apertura: () => "Uy, qué cola interminable esta, ¿no? Parece que hoy están todos comprando.",
    contexto: () =>
      `Sos un conocido lejano del usuario (un vecino, alguien de otro piso del trabajo, la persona que siempre está en el gimnasio a la misma hora) que se lo cruza en un momento cotidiano (una fila, el ascensor, la parada del colectivo) y arranca una charla trivial y espontánea. Mantené el tono liviano de smalltalk: clima, la espera, alguna anécdota corta. No profundices en temas personales a menos que el usuario los traiga primero.`,
    placeholderInicial: "Escribí tu respuesta...",
  },
};
