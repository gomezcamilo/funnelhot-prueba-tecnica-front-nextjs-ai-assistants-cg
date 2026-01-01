'use client';

export function Footer() {
  const linkedInUrl = 'https://www.linkedin.com/in/camilo-g%C3%B3mez-76aa0a252/';
  
  return (
    <footer className="border-t border-border bg-background/50 py-6">
      {/* Texto deslizante */}
      <div className="overflow-hidden mb-6">
        <div className="animate-marquee whitespace-nowrap font-mono">
          <span className="mx-8 text-sm text-muted-foreground">
            Prueba Técnica — Módulo de Gestión de Asistentes IA — Desarrollado por Camilo Gomez Roman — Visita mi perfil de LinkedIn{' '}
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              haciendo click aquí
            </a>
          </span>
          <span className="mx-8 text-sm text-muted-foreground">
            Prueba Técnica — Módulo de Gestión de Asistentes IA — Desarrollado por Camilo Gomez Roman — Visita mi perfil de LinkedIn{' '}
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              haciendo click aquí
            </a>
          </span>
          <span className="mx-8 text-sm text-muted-foreground">
            Prueba Técnica — Módulo de Gestión de Asistentes IA — Desarrollado por Camilo Gomez Roman — Visita mi perfil de LinkedIn{' '}
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              haciendo click aquí
            </a>
          </span>
        </div>
      </div>

      {/* Logo centrado con link a LinkedIn */}
      <div className="flex justify-center">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all hover:scale-105"
        >
          <img
            src="/molocorp.png"
            alt="Molocorp"
            className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
          />
        </a>
      </div>
    </footer>
  );
}
