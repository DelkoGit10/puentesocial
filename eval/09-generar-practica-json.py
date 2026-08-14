#!/usr/bin/env python3
"""
Combina eval/08-set-practica-24.json (mensaje, opciones, ámbito) con
eval/practica-resultados.json (el análisis real, ya corrido con
04-evaluar.py) para armar lib/practica.json — el archivo que consume la
sección Practicar. Nunca llama a la API: solo reordena datos ya generados.

Uso:
    python 09-generar-practica-json.py
"""

import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

SCRIPT_DIR = Path(__file__).resolve().parent
LIB_DIR = SCRIPT_DIR.parent / "lib"


def main():
    entrada = json.load(open(SCRIPT_DIR / "08-set-practica-24.json", encoding="utf-8"))
    resultados = json.load(open(SCRIPT_DIR / "practica-resultados.json", encoding="utf-8"))
    resultados_por_id = {r["id"]: r for r in resultados}

    con_bandera = []
    con_error = []
    casos_final = []

    for caso in entrada["casos"]:
        r = resultados_por_id.get(caso["id"])
        if r is None:
            raise SystemExit(f"Falta el resultado de {caso['id']} en practica-resultados.json")
        if r["error"]:
            con_error.append((caso["id"], r["error"]))
            continue
        salida = r["salida"]
        if salida.get("bandera_seguridad"):
            con_bandera.append(caso["id"])
            continue

        casos_final.append({
            "id": caso["id"],
            "ambito": caso["ambito"],
            "mensaje": caso["mensaje"],
            "relacion": caso["relacion"],
            "canal": caso["canal"],
            "contexto": caso["contexto"],
            "opciones": caso["opciones"],
            "analisis": salida,
        })

    if con_error:
        print("ERRORES (sin análisis, no se incluyen):")
        for id_, err in con_error:
            print(f"  {id_}: {err}")

    if con_bandera:
        print("\nAVISO: estos casos activaron bandera_seguridad y se excluyeron de la práctica:")
        for id_ in con_bandera:
            print(f"  {id_}")
        print("Reemplazalos por mensajes más neutros y volvé a correr el precálculo.")

    salida_final = {"casos": casos_final}
    (LIB_DIR / "practica.json").write_text(
        json.dumps(salida_final, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\nListo: lib/practica.json con {len(casos_final)}/{len(entrada['casos'])} casos.")

    por_ambito = {}
    for c in casos_final:
        por_ambito[c["ambito"]] = por_ambito.get(c["ambito"], 0) + 1
    print("Por ámbito:", por_ambito)


if __name__ == "__main__":
    main()
