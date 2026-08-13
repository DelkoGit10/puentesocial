# Hoja de revisión manual — resultados-v3-post-bandera-temp0.json
Para cada caso: leé el mensaje, la intención esperada y lo que interpretó el modelo. Escribí el puntaje en la línea `Puntaje:` (1 = acertó, 0.5 = parcial, 0 = erró).

---

## Caso 1
**Mensaje:** Bárbaro, justo lo que necesitaba hoy.
**Categoría:** esperada=`ironia` obtenida=`ironia`

**Intención esperada:** Está frustrado, no agradecido. No espera respuesta, descarga.

**Interpretación(es) del modelo:**
1. (alta) Está expresando fastidio o frustración por la mala noticia, usando ironía. Básicamente dice: 'qué bajón, justo hoy'.

Puntaje: ___

---

## Caso 2
**Mensaje:** No, tranqui, total tengo todo el tiempo del mundo.
**Categoría:** esperada=`ironia` obtenida=`ironia`

**Intención esperada:** Sí le molesta la demora y sí hay urgencia real. 'Tranqui' significa lo contrario.

**Interpretación(es) del modelo:**
1. (alta) Está molesto o incómodo con la demora, y lo expresa al revés: fingiendo que no le importa cuando sí le importa.
2. (baja) Genuinamente no le afecta el cambio de fecha y lo dice sin ironía.

Puntaje: ___

---

## Caso 3
**Mensaje:** Qué grande, avisaste con muchísima anticipación.
**Categoría:** esperada=`ironia` obtenida=`ironia`

**Intención esperada:** Reproche irónico. Está molesto y corresponde disculparse, no agradecer.

**Interpretación(es) del modelo:**
1. (alta) Tu amigo está molesto porque cancelaste muy tarde. Lo dice al revés, con ironía, para marcar que 20 minutos no es anticipación.

Puntaje: ___

---

## Caso 4
**Mensaje:** Me encanta cuando pasa esto.
**Categoría:** esperada=`ironia` obtenida=`ironia`

**Intención esperada:** Fastidio compartido con el proceso, no con el usuario.

**Interpretación(es) del modelo:**
1. (alta) Está expresando fastidio o hartazgo por el tercer cambio de requisitos. El 'me encanta' es lo opuesto de lo que siente.

Puntaje: ___

---

## Caso 5
**Mensaje:** Sos un genio 🙄
**Categoría:** esperada=`ironia` obtenida=`ironia`

**Intención esperada:** Ironía afectuosa, no hostil. Es complicidad. No corresponde disculparse.

**Interpretación(es) del modelo:**
1. (alta) Tu chiste fue malo y él te lo está haciendo saber de forma burlona y afectuosa. 'Sos un genio' significa lo contrario: el chiste no tuvo gracia.

Puntaje: ___

---

## Caso 6
**Mensaje:** Espectacular la reunión de hoy, eh.
**Categoría:** esperada=`ironia` obtenida=`ironia`

**Intención esperada:** Busca complicidad y que le confirmes que también te pareció inútil.

**Interpretación(es) del modelo:**
1. (alta) La reunión fue una pérdida de tiempo y está quejándose de eso, con humor.

Puntaje: ___

---

## Caso 7
**Mensaje:** Uy, qué lío esto de la planilla...
**Categoría:** esperada=`pedido_indirecto` obtenida=`pedido_indirecto`

**Intención esperada:** Probablemente pide ayuda sin pedirla. Ofrecer ayuda es la lectura correcta.

**Interpretación(es) del modelo:**
1. (media) Está pidiendo indirectamente que la ayudes con la planilla, sabiendo que vos sabés usarla.
2. (baja) Solo está desahogándose en voz alta, sin esperar nada de tu parte.

Puntaje: ___

---

## Caso 8
**Mensaje:** ¿Vos por casualidad no vas para el centro mañana?
**Categoría:** esperada=`pedido_indirecto` obtenida=`pedido_indirecto`

**Intención esperada:** Está pidiendo que lo lleves. No es una pregunta informativa.

**Interpretación(es) del modelo:**
1. (alta) Quiere pedirte algo relacionado con su trámite en el centro: que lo lleves, que hagas algo por él, o que le confirmes si podés ayudarlo de alguna forma.

Puntaje: ___

---

## Caso 9
**Mensaje:** Che, ¿viste que el informe todavía no está subido?
**Categoría:** esperada=`pedido_indirecto` obtenida=`pedido_indirecto`

**Intención esperada:** Es un pedido con presión, no una pregunta. Corresponde dar fecha concreta, no responder 'sí, vi'.

**Interpretación(es) del modelo:**
1. (alta) Tu jefe te está señalando que el informe está atrasado y espera que lo subas cuanto antes. La pregunta es la forma de decirte 'subilo' sin ordenártelo directamente.

Puntaje: ___

---

## Caso 10
**Mensaje:** Yo tengo el auto en el taller toda la semana.
**Categoría:** esperada=`pedido_indirecto` obtenida=`pedido_indirecto`

**Intención esperada:** Probablemente pide que lo pases a buscar, sin decirlo.

**Interpretación(es) del modelo:**
1. (media) Está avisando que no va a poder ir en su auto al cumpleaños, y probablemente espera que vos lo lleves o que coordinen otro transporte.
2. (baja) Solo está contando algo de su vida sin pedirte nada concreto, y el transporte lo va a resolver por su cuenta.

Puntaje: ___

---

## Caso 11
**Mensaje:** Está frío acá, ¿no?
**Categoría:** esperada=`pedido_indirecto` obtenida=`pedido_indirecto`

**Intención esperada:** Pide que cierres la ventana. La pregunta es una forma cortés de pedir.

**Interpretación(es) del modelo:**
1. (alta) Está pidiendo indirectamente que cierres la ventana, o que alguien lo haga.
2. (baja) Solo está comentando la temperatura, sin esperar ninguna acción.

Puntaje: ___

---

## Caso 12
**Mensaje:** ¿Cómo venís con eso que hablamos?
**Categoría:** esperada=`pedido_indirecto` obtenida=`pedido_indirecto`

**Intención esperada:** Recordatorio con presión suave. Espera una fecha, no un 'ahí voy'.

**Interpretación(es) del modelo:**
1. (alta) Está preguntando por la propuesta que te pidió hace diez días. Quiere saber si está lista o cuándo va a estarlo.
2. (media) Además de pedir información, está marcando indirectamente que pasó tiempo sin novedades.

Puntaje: ___

---

## Caso 13
**Mensaje:** Interesante el enfoque. Distinto.
**Categoría:** esperada=`critica_suave` obtenida=`ambiguedad_genuina`

**Intención esperada:** 'Distinto' sin elogio concreto sugiere desacuerdo educado. Conviene pedir feedback específico.

**Interpretación(es) del modelo:**
1. (media) Le gustó la propuesta. 'Interesante' y 'distinto' son elogios genuinos: valora que hayas traído algo fuera de lo convencional.
2. (media) No le convenció del todo. 'Distinto' puede ser una forma suave de decir que se alejó de lo que esperaba, y 'interesante' una fórmula para no decir 'no me gusta'.

Puntaje: ___

---

## Caso 14
**Mensaje:** Está bien, igual yo lo hubiera hecho de otra forma, pero está bien.
**Categoría:** esperada=`critica_suave` obtenida=`critica_suave`

**Intención esperada:** No está conforme. El 'está bien' repetido señala reserva, no aprobación.

**Interpretación(es) del modelo:**
1. (alta) No está del todo conforme con cómo hiciste la tarea. Lo dice de forma suavizada para no generar conflicto, pero la crítica está ahí.

Puntaje: ___

---

## Caso 15
**Mensaje:** Nadie te está criticando, eh.
**Categoría:** esperada=`critica_suave` obtenida=`critica_suave`

**Intención esperada:** La negación innecesaria señala que sí hay tensión. Nombrar algo que nadie mencionó lo confirma.

**Interpretación(es) del modelo:**
1. (alta) Hay una crítica implícita al usuario por el atraso, pero se la envuelve en una negación para que suene más suave o para que el usuario no se ponga a la defensiva.

Puntaje: ___

---

## Caso 16
**Mensaje:** Me sorprendió que lo mandaras sin avisarme.
**Categoría:** esperada=`critica_suave` obtenida=`critica_suave`

**Intención esperada:** Es un reproche por saltear un paso acordado. 'Me sorprendió' reemplaza a 'me molestó'.

**Interpretación(es) del modelo:**
1. (alta) Le molestó que no lo consultaras o informaras antes de mandar el presupuesto. Lo está marcando como un error de procedimiento o de coordinación.

Puntaje: ___

---

## Caso 17
**Mensaje:** Se entiende, pero hay que leerlo dos veces.
**Categoría:** esperada=`critica_suave` obtenida=`critica_suave`

**Intención esperada:** Está diciendo que está confuso y conviene reescribirlo.

**Interpretación(es) del modelo:**
1. (alta) El texto tiene un problema de claridad. Se entiende, pero cuesta más de lo que debería. El 'pero' anula parcialmente el 'se entiende': lo que importa es la segunda parte.
2. (baja) Es una observación neutral: el texto es denso por su tema, no por un error de escritura. No hay intención crítica, solo descripción.

Puntaje: ___

---

## Caso 18
**Mensaje:** Dale, cualquier cosa te aviso.
**Categoría:** esperada=`desinteres` obtenida=`cortesia_formula`

**Intención esperada:** Cierre cortés. Probablemente no va a avisar. No corresponde insistir.

**Interpretación(es) del modelo:**
1. (alta) Está cerrando la conversación de forma amable sin comprometerse a nada. No rechaza la ayuda explícitamente, pero tampoco la acepta. Es una salida cortés que deja todo en suspenso indefinido.

Puntaje: ___

---

## Caso 19
**Mensaje:** Uh, se me complica esa semana, después vemos.
**Categoría:** esperada=`desinteres` obtenida=`desinteres`

**Intención esperada:** Es un no sin fecha alternativa. Si le interesara, propondría otro día.

**Interpretación(es) del modelo:**
1. (media) No tiene ganas de juntarse, o al menos no es una prioridad, y usa la semana ocupada como salida sin comprometerse a nada.
2. (media) Genuinamente esa semana no puede, y 'después vemos' es su forma de no cerrar la puerta.

Puntaje: ___

---

## Caso 20
**Mensaje:** jajaja
**Categoría:** esperada=`desinteres` obtenida=`ambiguedad_genuina`

**Intención esperada:** Cierre de conversación por asimetría de energía. No es hostilidad ni rechazo personal.

**Interpretación(es) del modelo:**
1. (media) No supo qué responder a algo tan personal y usó 'jajaja' para salir del paso sin comprometerse.
2. (media) Encontró algo gracioso o liviano en lo que contaste y respondió con risa genuina.
3. (baja) Está incómodo con el nivel de intimidad del mensaje y se distancia con una respuesta mínima.

Puntaje: ___

---

## Caso 21
**Mensaje:** Sí, totalmente.
**Categoría:** esperada=`desinteres` obtenida=`ambiguedad_genuina`

**Intención esperada:** Puede ser desconexión, distracción o mal momento suyo. No se puede saber si es sobre vos.

**Interpretación(es) del modelo:**
1. (media) Te está dando la razón o validando lo que contaste, de forma genuina pero breve.
2. (media) Respondió algo para no dejar el mensaje en visto, pero no sabe bien qué decir o no está muy presente en la conversación.

Puntaje: ___

---

## Caso 22
**Mensaje:** Tenemos que juntarnos un día de estos.
**Categoría:** esperada=`cortesia_formula` obtenida=`cortesia_formula`

**Intención esperada:** Fórmula social de cierre amable. No es un plan. Si querés que lo sea, hay que proponer fecha.

**Interpretación(es) del modelo:**
1. (alta) Es una fórmula de cierre social. Fue agradable cruzarse, pero no hay una intención real de coordinar un encuentro. 'Un día de estos' sin fecha ni propuesta concreta es la forma estándar de terminar un reencuentro casual de forma amigable.
2. (baja) Tiene genuina intención de verse, pero no sabe cómo concretarlo o le da vergüenza proponer algo más específico.

Puntaje: ___

---

## Caso 23
**Mensaje:** Cualquier cosa contá conmigo.
**Categoría:** esperada=`cortesia_formula` obtenida=`cortesia_formula`

**Intención esperada:** Cortesía sin compromiso concreto. Se convierte en real solo si pedís algo puntual.

**Interpretación(es) del modelo:**
1. (alta) Es una expresión de solidaridad convencional. Muestra buena voluntad, pero no es una oferta concreta de ayuda. No implica que vaya a hacer algo específico por vos.

Puntaje: ___

---

## Caso 24
**Mensaje:** Lo vemos la semana que viene.
**Categoría:** esperada=`cortesia_formula` obtenida=`desinteres`

**Intención esperada:** Postergación educada sin compromiso. Conviene dejar fecha agendada por escrito.

**Interpretación(es) del modelo:**
1. (media) El jefe no quiere dar una respuesta ahora y posterga la conversación. Puede ser porque necesita tiempo real para pensarlo, o porque espera que el tema se enfríe y no haya que retomarlo.
2. (baja) El jefe genuinamente quiere hablar del tema pero ahora no puede o no es el momento adecuado, y propone retomarlo pronto.

Puntaje: ___

---

## Caso 25
**Mensaje:** Prefiero no meterme en eso.
**Categoría:** esperada=`limite` obtenida=`limite`

**Intención esperada:** Es un límite claro aunque suave. No insistir es la respuesta correcta.

**Interpretación(es) del modelo:**
1. (alta) No quiere opinar sobre el conflicto. Puede ser porque no quiere quedar en el medio, porque le incomoda el tema, o porque prefiere no tomar partido. No es un rechazo hacia vos.

Puntaje: ___

---

## Caso 26
**Mensaje:** Estoy con mil cosas ahora, después te escribo.
**Categoría:** esperada=`limite` obtenida=`limite`

**Intención esperada:** Puede ser literal o un cierre. Sin más señales no se puede distinguir; esperar es lo razonable.

**Interpretación(es) del modelo:**
1. (media) Está genuinamente ocupado y va a retomar la conversación cuando pueda.
2. (media) No tiene ganas o energía de entrar en una conversación personal en este momento, y posterga sin saber si va a retomar.

Puntaje: ___

---

## Caso 27
**Mensaje:** No sé si es el mejor momento para hablar de esto.
**Categoría:** esperada=`limite` obtenida=`limite`

**Intención esperada:** Pide postergar, no cancelar. Corresponde acordar cuándo sí.

**Interpretación(es) del modelo:**
1. (media) Ahora no está en condiciones de tener esa conversación, ya sea por el estado emocional, el contexto o el cansancio. No es un rechazo al tema, sino al momento.
2. (media) Quiere seguir postergando el tema sin decirlo directamente. El 'no sé si' funciona como amortiguador para no cerrar la puerta, pero tampoco abrirla.

Puntaje: ___

---

## Caso 28
**Mensaje:** Me gustaría, pero no puedo comprometerme.
**Categoría:** esperada=`limite` obtenida=`limite`

**Intención esperada:** Es un no a comprometerse, sin cerrar la puerta del todo. No es un 'quizás'.

**Interpretación(es) del modelo:**
1. (alta) Le interesa el proyecto genuinamente, pero no puede garantizar su participación. Es un 'no' a la colaboración formal, aunque sin cerrar la puerta del todo.

Puntaje: ___

---

## Caso 29
**Mensaje:** ok
**Categoría:** esperada=`ambiguedad_genuina` obtenida=`ambiguedad_genuina`

**Intención esperada:** No se puede saber si es neutro, molesto o apurado. Un 'ok' corto no prueba enojo. Preguntar es la salida.

**Interpretación(es) del modelo:**
1. (media) Acusó recibo de tu explicación sin opinar. No aprueba ni desaprueba, solo cierra el intercambio.
2. (media) Recibió la explicación pero no está conforme. El 'ok' es seco a propósito: no valida lo que dijiste, solo lo registra.

Puntaje: ___

---

## Caso 30
**Mensaje:** Bueno.
**Categoría:** esperada=`ambiguedad_genuina` obtenida=`ambiguedad_genuina`

**Intención esperada:** Puede ser cierre conciliador o resignación molesta. No se determina desde el texto.

**Interpretación(es) del modelo:**
1. (media) Está cerrando la conversación sin querer seguir discutiendo. No es acuerdo real, es un 'ya está, no hablo más'.
2. (media) Está aceptando lo que se dijo o acordó, y para ella/él el tema está cerrado de forma genuina.
3. (media) Está molesta/o todavía y responde lo mínimo para no ignorar el mensaje, pero sin ganas de hablar.

Puntaje: ___

---

## Caso 31
**Mensaje:** Como quieras.
**Categoría:** esperada=`ambiguedad_genuina` obtenida=`ambiguedad_genuina`

**Intención esperada:** Flexibilidad genuina o fastidio contenido: ambas son igual de posibles.

**Interpretación(es) del modelo:**
1. (media) Le da igual el lugar y te deja decidir sin problema. Aceptación real.
2. (media) No le gustó el cambio pero no quiere discutirlo. Lo acepta con cierto fastidio o resignación.

Puntaje: ___

---

## Caso 32
**Mensaje:** Está todo bien.
**Categoría:** esperada=`ambiguedad_genuina` obtenida=`ambiguedad_genuina`

**Intención esperada:** Puede ser literal o exactamente lo contrario. La forma de resolverlo es una pregunta abierta, no interpretar.

**Interpretación(es) del modelo:**
1. (media) Sí le molestó algo, pero no quiere decirlo directamente. 'Está todo bien' es una forma de cerrar la conversación sin resolver el conflicto.
2. (media) Realmente está todo bien y no le molestó nada. La brevedad es su estilo o simplemente no le dio más importancia al tema.

Puntaje: ___

---

## Caso 33
**Mensaje:** Nada, dejá.
**Categoría:** esperada=`ambiguedad_genuina` obtenida=`ambiguedad_genuina`

**Intención esperada:** Puede ser desistir sin drama o molestia acumulada. No se puede saber; preguntar sin presionar.

**Interpretación(es) del modelo:**
1. (media) Se sintió incómoda o vulnerable con lo que iba a decir y prefirió no seguir. No necesariamente hay enojo hacia vos.
2. (media) Está enojada o frustrada con algo y el 'dejá' es una forma de cerrarse, posiblemente esperando que insistas o que notes que algo está mal.

Puntaje: ___

---

## Caso 34
**Mensaje:** Llego 10 minutos tarde, hay un corte en Corrientes.
**Categoría:** esperada=`literal` obtenida=`literal`

**Intención esperada:** Es exactamente lo que dice. No hay subtexto. Buscar capas acá es el error a evitar.

**Interpretación(es) del modelo:**
1. (alta) Está avisando con anticipación para que no te preocupes ni lo esperes sin saber qué pasa.

Puntaje: ___

---

## Caso 35
**Mensaje:** ¿Te lo mando en PDF o en Word?
**Categoría:** esperada=`literal` obtenida=`literal`

**Intención esperada:** Pregunta operativa. No hay carga emocional.

**Interpretación(es) del modelo:**
1. (alta) Está listo para mandarte el documento y necesita saber el formato antes de hacerlo.

Puntaje: ___

---

## Caso 36
**Mensaje:** La reunión se pasó a las 15.
**Categoría:** esperada=`literal` obtenida=`literal`

**Intención esperada:** Información pura. No indica molestia ni reproche.

**Interpretación(es) del modelo:**
1. (alta) La reunión se reprogramó: ya no es a las 11, ahora es a las 15.
2. (baja) La reunión ya ocurrió y terminó pasadas las 15 (es decir, se extendió o demoró hasta después de esa hora).

Puntaje: ___

---

## Caso 37
**Mensaje:** Gracias por mandarlo, lo reviso mañana y te digo.
**Categoría:** esperada=`literal` obtenida=`literal`

**Intención esperada:** Acuse de recibo normal y positivo. La brevedad no indica desaprobación.

**Interpretación(es) del modelo:**
1. (alta) Acuse de recibo sin más. No hay evaluación todavía, solo confirmación de que llegó y un plazo concreto para el feedback.

Puntaje: ___

---

## Caso 38
**Mensaje:** Siempre pasa lo mismo con vos.
**Categoría:** esperada=`conflicto` obtenida=`conflicto`

**Intención esperada:** El 'siempre' señala acumulación previa: el reclamo no es solo por hoy. Responder al hecho puntual no alcanza.

**Interpretación(es) del modelo:**
1. (alta) Tu pareja está expresando frustración acumulada. No habla solo de hoy: habla de un patrón que siente que se repite. El 'siempre' es una señal de que esto viene de antes y que esta vez fue la gota que rebalsó.

Puntaje: ___

---

## Caso 39
**Mensaje:** No hace falta que me contestes así.
**Categoría:** esperada=`conflicto` obtenida=`critica_suave`

**Intención esperada:** Percibió un tono que quizá no quisiste transmitir. Pide reparación, no discusión sobre si fue así.

**Interpretación(es) del modelo:**
1. (alta) Le molestó cómo le respondiste. Probablemente sintió que fue seco, cortante o descortés, y te lo está diciendo.

Puntaje: ___

---

## Caso 40
**Mensaje:** Hacé lo que quieras.
**Categoría:** esperada=`conflicto` obtenida=`conflicto`

**Intención esperada:** No es permiso literal: es enojo y retiro de la conversación. Tomarlo literalmente escala el conflicto.

**Interpretación(es) del modelo:**
1. (alta) Está enojada o herida, y se está retirando de la discusión. No te está dando permiso genuino: te está diciendo que no va a seguir peleando, pero que no está de acuerdo.
2. (baja) Aceptó la situación y realmente te está dejando decidir sin resentimiento.

Puntaje: ___
