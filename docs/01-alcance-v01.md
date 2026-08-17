# PuenteSocial — Alcance v0.1 (CoderCup)

**Fecha de corte:** domingo 23/8
**Regla madre:** si algo no se puede mostrar funcionando en el video de 2 minutos, no se construye.

> **Nota post-v0.1:** este documento queda como registro de la decisión original de alcance
> para la entrega de CoderCup. Una decisión se revisó después: el "Simulador de conversaciones
> / roleplay" que se excluía más abajo se incorporó como "Diálogos guiados" dentro de
> Practicar, con memoria de conversación acotada a esa función (no afecta a Traducir, que
> sigue sin memoria). Se deja marcado en la lista original en vez de borrarlo, para que quede
> el rastro de qué se decidió y cuándo se revisó.

---

## Qué es la v0.1, en una frase

Una web app donde pegás un mensaje que recibiste y no sabés cómo interpretar, y te devuelve
qué dice literalmente, qué probablemente quiso decir la otra persona, qué señales del texto lo
indican, y tres formas de responder.

---

## DENTRO del alcance

| # | Funcionalidad | Por qué entra |
|---|---|---|
| 1 | Pegar mensaje + contexto mínimo (quién lo mandó, canal, qué pasó antes) | Es el input real. Sin contexto la interpretación es ruido. |
| 2 | Salida estructurada de 6 bloques fijos (ver `02-prompt-motor.md`) | El formato fijo es el producto. Enseña un patrón de lectura. |
| 3 | Nivel de ambigüedad explícito, incluida la opción "no se puede saber" | Es el diferencial ético y de calidad frente a un chatbot genérico. |
| 4 | Historial local de mensajes consultados | Base del patrón personal. |
| 5 | Patrón personal ("de 14 mensajes, 9 eran ironía laboral") | Lo único que un ChatGPT genérico no hace. Es la defensa contra "esto es un wrapper". |
| 6 | Bandera de seguridad ante manipulación, culpabilización o agresión | No traducir el abuso como si fuera un malentendido. |
| 7 | Mobile-first, URL pública, sin login (o login mínimo) | Se usa desde el celular, en el momento. Y el jurado tiene que poder entrar. |

## FUERA del alcance (decisión tomada, no se rediscute)

- Audio, voz, análisis de tono sonoro
- Video, expresiones faciales, señales no verbales
- Análisis en tiempo real de conversaciones en curso
- ~~Simulador de conversaciones / roleplay~~ — revisado, ver nota al inicio del documento
- Wearable, app móvil nativa, APIs públicas
- Panel institucional, licencias, pagos, planes
- Multiidioma (solo español rioplatense en v0.1)
- Cuentas de usuario complejas, recuperación de contraseña, perfiles
- Cualquier cosa que se parezca a un diagnóstico

> Estas van al final del video como "hacia dónde va", 5 segundos, sin promesas de fecha.

---

## Límites éticos (van en el producto y en el video)

1. **No diagnostica.** Ni al usuario ni a quien escribió el mensaje.
2. **No reemplaza terapia ni acompañamiento profesional.**
3. **Solo se analizan mensajes de los que el usuario es destinatario.** No se procesan
   conversaciones ajenas ni chats de terceros.
4. **No se guardan datos sensibles ni identificables.** El historial es local del navegador y
   se puede borrar de un click.
5. **Nunca sugiere manipular, presionar ni engañar a la otra persona.**
6. **Ante agresión, culpabilización o manipulación, el sistema la nombra en vez de suavizarla.**
7. **La incertidumbre se dice.** Si no se puede saber, la respuesta correcta es "no se puede
   saber, esto se pregunta".

---

## Definición de terminado (día 5)

La v0.1 está lista cuando un desconocido, desde el celular, sin instrucciones:

- [ ] Entra a la URL y entiende en 5 segundos para qué sirve
- [ ] Pega un mensaje y recibe la salida completa en menos de 15 segundos
- [ ] Ve los 6 bloques bien diferenciados y legibles en pantalla chica
- [ ] Puede consultar 3 mensajes seguidos y ver su historial
- [ ] Ve su patrón personal después del tercer mensaje
- [ ] Encuentra la nota de privacidad y límites sin buscarla
- [ ] Nada se rompe si el mensaje está vacío, es larguísimo o no tiene sentido

## Métricas que voy a poder decir el 23/8

- Precisión medida sobre el set de 40 mensajes (número real, no estimado)
- Tasa de sobreinterpretación en los mensajes literales de control
- Cantidad de usuarios reales, mensajes procesados y días de uso
- Al menos 2 frases textuales de usuarios reales
