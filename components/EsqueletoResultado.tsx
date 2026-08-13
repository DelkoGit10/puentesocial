function Barra({ ancho = "w-full" }: { ancho?: string }) {
  return <div className={`h-3 ${ancho} animate-pulse rounded bg-gray-200`} />;
}

function BloqueEsqueleto() {
  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
      <div className="h-2.5 w-24 animate-pulse rounded bg-gray-200" />
      <Barra ancho="w-full" />
      <Barra ancho="w-5/6" />
    </div>
  );
}

/**
 * Misma forma que ResultadoAnalisis, en gris. El análisis tarda 10-15s;
 * un placeholder vacío se siente el doble de largo que uno con esta forma.
 */
export default function EsqueletoResultado() {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-gray-200 p-4 sm:p-5">
      <div className="flex gap-2">
        <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200" />
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <BloqueEsqueleto key={i} />
      ))}

      <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
        <div className="h-2.5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-16 animate-pulse rounded border border-gray-100 bg-gray-100" />
        <div className="h-16 animate-pulse rounded border border-gray-100 bg-gray-100" />
        <div className="h-16 animate-pulse rounded border border-gray-100 bg-gray-100" />
      </div>
    </div>
  );
}
