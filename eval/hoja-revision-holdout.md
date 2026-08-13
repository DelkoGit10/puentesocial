# Hoja de revisión manual — holdout-resultados-v2-post-bandera-temp0.json
Para cada caso: leé el mensaje, la intención esperada y lo que interpretó el modelo. Escribí el puntaje en la línea `Puntaje:` (1 = acertó, 0.5 = parcial, 0 = erró).

---

## Caso 1
**Mensaje:** Ando muy cansado esta semana, mejor lo dejamos para la próxima.
**Categoría:** esperada=`limite` obtenida=`limite`

**Intención esperada:** Marca su propia capacidad, no te está pidiendo nada. No es rechazo personal ni hay que insistir.

**Interpretación(es) del modelo:**
1. (media) Está genuinamente agotado y quiere postergar la mudanza una semana. No hay rechazo a tu ayuda, solo un cambio de fecha.
2. (baja) No quiere que lo ayudes a mudarse, o la mudanza no va a pasar pronto, y usa el cansancio como excusa suave para no decirlo directamente.

Puntaje: ___

---

## Caso 2
**Mensaje:** Necesito que hoy no me pidan nada más, ya no doy más.
**Categoría:** esperada=`limite` obtenida=`limite`

**Intención esperada:** Comunica su propio límite de capacidad. No es un pedido hacia vos. Mejor esperar a mañana.

**Interpretación(es) del modelo:**
1. (alta) Está agotado y necesita que no le sumen más trabajo por hoy. No es un rechazo personal ni una crítica a vos: es una declaración de su propio estado.

Puntaje: ___

---

## Caso 3
**Mensaje:** Uy, no sé cómo se hace la configuración esa del servidor.
**Categoría:** esperada=`pedido_indirecto` obtenida=`pedido_indirecto`

**Intención esperada:** Probablemente pide ayuda sin pedirla directamente. Ofrecer ayuda es la lectura correcta.

**Interpretación(es) del modelo:**
1. (alta) Está pidiendo que le expliques o le ayudes con la configuración, sin pedirlo directamente.

Puntaje: ___

---

## Caso 4
**Mensaje:** Genial, ya te cuento.
**Categoría:** esperada=`desinteres` obtenida=`desinteres`

**Intención esperada:** Cierre educado sin compromiso. Probablemente no va a avisar. No corresponde insistir.

**Interpretación(es) del modelo:**
1. (media) Le interesa el café pero no puede o no quiere confirmar ahora. Va a volver con una fecha.
2. (media) No quiere ir pero tampoco quiere decir que no. Usa 'ya te cuento' para postergar sin comprometerse.

Puntaje: ___

---

## Caso 5
**Mensaje:** Un gusto conocerte, nos vemos.
**Categoría:** esperada=`cortesia_formula` obtenida=`cortesia_formula`

**Intención esperada:** Fórmula social de cierre. No hay propuesta pendiente que se esté esquivando.

**Interpretación(es) del modelo:**
1. (alta) Cierre cortés de la conversación. No implica ningún compromiso de volver a verse ni ninguna propuesta concreta.

Puntaje: ___

---

## Caso 6
**Mensaje:** Como digas vos, que total siempre tenés razón.
**Categoría:** esperada=`conflicto` obtenida=`ironia`

**Intención esperada:** Sarcasmo con reproche acumulado ('siempre'). No es aprobación real, es enojo.

**Interpretación(es) del modelo:**
1. (alta) No está aceptando nada. Está expresando enojo o frustración por sentir que no fue escuchado/a en la discusión. 'Siempre tenés razón' es lo contrario de lo que cree: lo dice para marcar que se siente ignorado/a o que la conversación fue injusta.

Puntaje: ___

---

## Caso 7
**Mensaje:** Qué puntual como siempre.
**Categoría:** esperada=`ironia` obtenida=`ironia`

**Intención esperada:** Reproche irónico por impuntualidad reiterada, no un elogio.

**Interpretación(es) del modelo:**
1. (alta) Está marcando que llegaste tarde, otra vez. El elogio es falso y lo sabe. Es un reproche dicho con ironía, probablemente frente a otros.

Puntaje: ___

---

## Caso 8
**Mensaje:** Funciona, sí. Un poco raro el flujo pero funciona.
**Categoría:** esperada=`critica_suave` obtenida=`critica_suave`

**Intención esperada:** Hay una objeción real de usabilidad, suavizada. Conviene preguntar qué parte le resultó rara.

**Interpretación(es) del modelo:**
1. (alta) Confirma que funciona pero tiene una objeción sobre el flujo. No la está descartando, pero tampoco la está aprobando sin reservas.
2. (media) Está insinuando que el flujo debería cambiarse, sin pedirlo directamente.

Puntaje: ___

---

## Caso 9
**Mensaje:** Te mando el arreglo del auto por Mercado Pago mañana.
**Categoría:** esperada=`literal` obtenida=`literal`

**Intención esperada:** Es exactamente lo que dice, sin subtexto ni carga emocional.

**Interpretación(es) del modelo:**
1. (alta) Está confirmando que va a devolver el dinero mañana por Mercado Pago. Es un compromiso concreto con fecha y medio de pago.

Puntaje: ___

---

## Caso 10
**Mensaje:** Ya fue.
**Categoría:** esperada=`ambiguedad_genuina` obtenida=`ambiguedad_genuina`

**Intención esperada:** Puede ser aceptación genuina o resignación fastidiada. No se puede saber desde el texto; preguntar es la salida.

**Interpretación(es) del modelo:**
1. (media) Acepta las disculpas y quiere pasar la página. 'Ya fue' como 'no importa, está bien'.
2. (media) Cierra el tema pero todavía está molesto. No rechaza las disculpas explícitamente, pero tampoco las acepta con calidez. El silencio sobre cómo se siente es llamativo.

Puntaje: ___
