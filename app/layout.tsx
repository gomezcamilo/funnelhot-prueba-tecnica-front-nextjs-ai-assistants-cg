import type { Metadata } from 'next';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Assistants - Gestión de Asistentes IA',
  description: 'Módulo de Gestión de Asistentes IA - Crea, edita, elimina y entrena asistentes de inteligencia artificial',
};

// Script para bloquear atajos de teclado que permiten ver código fuente
const disableDevToolsScript = `
  (function() {
    // Bloquear atajos de teclado
    document.addEventListener('keydown', function(e) {
      // Ctrl+U - Ver código fuente
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I - DevTools
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J - Consola
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C - Inspector
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      // F12 - DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    });
    
    // Bloquear clic derecho (menú contextual)
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="AI Assistants" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script dangerouslySetInnerHTML={{ __html: disableDevToolsScript }} />
      </head>
      <body>
        <ParticlesBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
