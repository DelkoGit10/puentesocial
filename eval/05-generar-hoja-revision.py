#!/usr/bin/env python3
"""
Genera una hoja de revisión legible a partir de un archivo de resultados para
completar 'acierto_intencion_manual' a mano.

Uso:
    python 05-generar-hoja-revision.py [resultados.json] [hoja-revision.md]
"""

import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent


def main(entrada="resultados.json", salida="hoja-revision.md"):
    data = json.load(open(SCRIPT_DIR / entrada, encoding="utf-8"))
    lineas = [f"# Hoja de revisión manual — {entrada}\n"]
    lineas.append(
        "Para cada caso: leé el mensaje, la intención esperada y lo que interpretó "
        "el modelo. Escribí el puntaje en la línea `Puntaje:` (1 = acertó, "
        "0.5 = parcial, 0 = erró).\n"
    )

    for caso in data:
        salida_caso = caso.get("salida") or {}
        interpretaciones = salida_caso.get("interpretaciones") or []

        lineas.append(f"\n---\n\n## Caso {caso['id']}\n")
        lineas.append(f"**Mensaje:** {caso['mensaje']}\n")
        lineas.append(
            f"**Categoría:** esperada=`{caso['categoria_esperada']}` "
            f"obtenida=`{caso['categoria_obtenida']}`\n"
        )
        lineas.append(f"\n**Intención esperada:** {caso['intencion_esperada']}\n")

        if interpretaciones:
            lineas.append("\n**Interpretación(es) del modelo:**\n")
            for i, interp in enumerate(interpretaciones, 1):
                lineas.append(
                    f"{i}. ({interp.get('confianza', '?')}) {interp.get('significado', '')}\n"
                )
        else:
            lineas.append("\n**Interpretación(es) del modelo:** (sin datos)\n")

        lineas.append("\nPuntaje: ___\n")

    out_path = SCRIPT_DIR / salida
    out_path.write_text("".join(lineas), encoding="utf-8")
    print(f"Listo: {out_path} ({len(data)} casos)")


if __name__ == "__main__":
    main(
        sys.argv[1] if len(sys.argv) > 1 else "resultados.json",
        sys.argv[2] if len(sys.argv) > 2 else "hoja-revision.md",
    )
