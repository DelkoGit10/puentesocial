import type { Metadata, Viewport } from "next";
import "./globals.css";

// Fuentes autohospedadas (@fontsource), no next/font/google: next/font/google
// descarga los archivos desde fonts.gstatic.com en cada build, y una falla
// transitoria de red ahí tira abajo el deploy entero — nos pasó una vez.
// Con @fontsource los .woff2 quedan empaquetados en node_modules, sin
// depender de la red en el momento del build.

// Display: el nombre de la app y el titular del patrón, con mucha
// restricción de uso — no más de dos o tres apariciones por pantalla.
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";

// Cuerpo: todo el análisis.
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";

// Evidencia: el mensaje original y los fragmentos citados en "señales".
// Lo que está en mono es texto ajeno citado como prueba, no interpretación.
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

export const metadata: Metadata = {
  title: "PuenteSocial",
  description: "Traducí lo que te quisieron decir.",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
