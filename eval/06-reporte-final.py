#!/usr/bin/env python3
"""
Reporte final: combina las métricas automáticas con 'acierto_intencion_manual'
ya completado a mano. Solo lee resultados.json, no llama a la API ni lo pisa.

Uso:
    python 06-reporte-final.py [archivo_resultados.json]
"""

import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

SCRIPT_DIR = Path(__file__).resolve().parent


def main(nombre_archivo="resultados.json"):
    resultados = json.load(open(SCRIPT_DIR / nombre_archivo, encoding="utf-8"))
    total = len(resultados)

    faltantes = [r["id"] for r in resultados if r["acierto_intencion_manual"] is None]
    if faltantes:
        print(f"AVISO: todavía faltan {len(faltantes)} casos sin puntaje manual: {faltantes}")
        print("Completalos antes de sacar conclusiones finales.\n")

    # --- Métricas automáticas (mismas que 04-evaluar.py) ---
    ok_cat = sum(1 for r in resultados if r["categoria_obtenida"] == r["categoria_esperada"])

    literales = [r for r in resultados if r["categoria_esperada"] == "literal"]
    sobreinterpreta = sum(1 for r in literales if r["categoria_obtenida"] != "literal")

    ambiguos = [r for r in resultados if r["ambiguedad_esperada"] == "alta"]
    honesto = sum(1 for r in ambiguos if r["ambiguedad_obtenida"] in ("alta", "media"))

    viola_calibracion = sum(
        1 for r in resultados
        if r["ambiguedad_obtenida"] == "alta" and r["salida"]
        and any(i.get("confianza") == "alta" for i in r["salida"].get("interpretaciones", []))
    )

    errores_formato = sum(1 for r in resultados if r["error"])

    # --- Métrica manual: intención ---
    puntajes = [r["acierto_intencion_manual"] for r in resultados if r["acierto_intencion_manual"] is not None]
    intencion_promedio = sum(puntajes) / len(puntajes) if puntajes else 0
    distribucion = Counter(puntajes)

    por_categoria = defaultdict(list)
    for r in resultados:
        if r["acierto_intencion_manual"] is not None:
            por_categoria[r["categoria_esperada"]].append(r["acierto_intencion_manual"])

    print("=" * 56)
    print("MÉTRICAS AUTOMÁTICAS")
    print("=" * 56)
    print(f"Categoría correcta            {ok_cat}/{total}  ({ok_cat/total:.0%})")
    print(f"Sobreinterpretación           {sobreinterpreta}/{len(literales)} literales con subtexto inventado")
    print(f"Honestidad ante ambigüedad    {honesto}/{len(ambiguos)} casos ambiguos reconocidos")
    print(f"Violaciones de calibración    {viola_calibracion}")
    print(f"Errores de formato/parseo     {errores_formato}")

    print("\n" + "=" * 56)
    print("MÉTRICA MANUAL: INTENCIÓN (revisada por vos)")
    print("=" * 56)
    print(f"Casos puntuados                {len(puntajes)}/{total}")
    print(f"Promedio de acierto            {intencion_promedio:.2f}  ({intencion_promedio:.0%})")
    print(f"Distribución                   1={distribucion.get(1, 0)}  "
          f"0.5={distribucion.get(0.5, 0)}  0={distribucion.get(0, 0)}")

    print("\nPromedio de intención por categoría esperada:")
    for cat, vals in sorted(por_categoria.items(), key=lambda kv: sum(kv[1]) / len(kv[1])):
        print(f"  {cat:<20} {sum(vals)/len(vals):.2f}  (n={len(vals)})")

    peores = sorted(
        (r for r in resultados if r["acierto_intencion_manual"] is not None and r["acierto_intencion_manual"] < 1),
        key=lambda r: r["acierto_intencion_manual"],
    )
    if peores:
        print(f"\nCasos con intención parcial o errada ({len(peores)}):")
        for r in peores:
            print(f"  [{r['id']:>2}] puntaje={r['acierto_intencion_manual']}  "
                  f"categoria={r['categoria_esperada']}  \"{r['mensaje'][:60]}\"")

    print("=" * 56)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "resultados.json")
