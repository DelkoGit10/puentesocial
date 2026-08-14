#!/usr/bin/env python3
"""
Evaluación del motor de traducción social de PuenteSocial.

Uso:
    pip install anthropic
    export ANTHROPIC_API_KEY=...
    python 04-evaluar.py 03-set-evaluacion-40.json

Genera:
    resultados.json  -> la salida cruda del modelo para cada caso (para revisar a mano)
    Un resumen en pantalla con las métricas que vas a decir en el video.

IMPORTANTE: la métrica de "intención" NO se puede automatizar. El script deja los casos
listos para que los marques a mano con 1 (acertó), 0.5 (parcial) o 0 (erró). Ese número
revisado por vos es el que vale y el que da credibilidad.
"""

import json
import os
import sys
from collections import Counter
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent

from dotenv import load_dotenv
load_dotenv(SCRIPT_DIR / ".env")

SYSTEM_PROMPT = open(SCRIPT_DIR / "prompt_sistema.txt", encoding="utf-8").read()  # pegá acá el prompt del archivo 02

USER_TEMPLATE = """MENSAJE RECIBIDO:
\"\"\"
{mensaje}
\"\"\"

QUIÉN LO ESCRIBIÓ: {relacion}
CANAL: {canal}
QUÉ PASÓ ANTES: {contexto}"""


def analizar(client, caso):
    r = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        temperature=0,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": USER_TEMPLATE.format(**caso)}],
    )
    texto = "".join(b.text for b in r.content if b.type == "text")
    texto = texto.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(texto)


def main(path, out_name="resultados.json"):
    from anthropic import Anthropic

    client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    data = json.load(open(SCRIPT_DIR / path, encoding="utf-8"))
    resultados = []

    for caso in data["casos"]:
        try:
            salida = analizar(client, caso)
            error = None
        except Exception as e:
            salida, error = None, str(e)
        resultados.append({
            "id": caso["id"],
            "mensaje": caso["mensaje"],
            "categoria_esperada": caso["categoria_esperada"],
            "categoria_obtenida": (salida or {}).get("categoria"),
            "ambiguedad_esperada": caso["ambiguedad_esperada"],
            "ambiguedad_obtenida": (salida or {}).get("ambiguedad", {}).get("nivel"),
            "intencion_esperada": caso["intencion_esperada"],
            "salida": salida,
            "error": error,
            "acierto_intencion_manual": None,  # <-- completá a mano: 1 / 0.5 / 0
        })
        print(f"[{caso['id']:>2}] {caso['categoria_esperada']:<20} -> "
              f"{(salida or {}).get('categoria', 'ERROR')}")

    json.dump(resultados, open(SCRIPT_DIR / out_name, "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)

    # --- Métricas automáticas ---
    ok_cat = sum(1 for r in resultados if r["categoria_obtenida"] == r["categoria_esperada"])
    total = len(resultados)

    literales = [r for r in resultados if r["categoria_esperada"] == "literal"]
    sobreinterpreta = sum(1 for r in literales if r["categoria_obtenida"] != "literal")

    ambiguos = [r for r in resultados if r["ambiguedad_esperada"] == "alta"]
    honesto = sum(1 for r in ambiguos if r["ambiguedad_obtenida"] in ("alta", "media"))

    # Regla dura del contrato: si la ambigüedad es alta, nada puede tener confianza alta
    viola_calibracion = sum(
        1 for r in resultados
        if r["ambiguedad_obtenida"] == "alta" and r["salida"]
        and any(i.get("confianza") == "alta" for i in r["salida"].get("interpretaciones", []))
    )

    print("\n" + "=" * 52)
    print(f"Categoría correcta            {ok_cat}/{total}  ({ok_cat/total:.0%})")
    print(f"Sobreinterpretación           {sobreinterpreta}/{len(literales)} literales con subtexto inventado")
    print(f"Honestidad ante ambigüedad    {honesto}/{len(ambiguos)} casos ambiguos reconocidos")
    print(f"Violaciones de calibración    {viola_calibracion}")
    print(f"Errores de formato/parseo     {sum(1 for r in resultados if r['error'])}")
    print("=" * 52)
    print("\nFalta lo importante: abrí resultados.json y completá "
          "'acierto_intencion_manual' en cada caso.")
    print("Errores por categoría:",
          dict(Counter(r["categoria_esperada"] for r in resultados
                       if r["categoria_obtenida"] != r["categoria_esperada"])))


if __name__ == "__main__":
    main(
        sys.argv[1] if len(sys.argv) > 1 else "03-set-evaluacion-40.json",
        sys.argv[2] if len(sys.argv) > 2 else "resultados.json",
    )
