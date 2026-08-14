# PuenteSocial

> Traducí lo que te quisieron decir.

Pegás un mensaje que recibiste y no sabés cómo interpretar, y devuelve qué dice literalmente,
qué probablemente quiso decir la otra persona, qué señales del texto lo indican, y tres formas
de responder. Pensado para personas que leen el lenguaje de forma literal y para quienes la
ansiedad social hace difícil descifrar el subtexto.

## Cómo correr esto en local

```bash
npm install
npm run dev
```

Necesitás un `.env.local` con `ANTHROPIC_API_KEY` (ver `app/api/analizar/route.ts`).

## Estructura

- `app/` — la app Next.js (formulario, resultado, historial, práctica)
- `components/` — UI compartida
- `lib/` — tipos, el prompt del sistema, historial, patrón, práctica
- `eval/` — el set de evaluación (40 casos + 10 de holdout) y los scripts que lo corren
- `docs/` — alcance del producto y el diseño del prompt

## El prompt es un contrato, no un detalle de implementación

`lib/prompt.ts` (espejo exacto de `eval/prompt_sistema.txt`) está validado sobre 50 casos:
85% de acierto de categoría, 92% de acierto de intención revisado a mano. Si necesitás tocar el
prompt, hacelo en `eval/prompt_sistema.txt`, corré `eval/04-evaluar.py` sobre los 40 + 10 de
holdout, re-puntuá la intención a mano, y recién después actualizá `lib/prompt.ts` con el
resultado ya validado. Los archivos `eval/resultados-*.json` son la evidencia de esa validación.

## Deploy

Desplegado en Vercel. La API key vive únicamente en las variables de entorno del proyecto en
Vercel — nunca en el repo.
