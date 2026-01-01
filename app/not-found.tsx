'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-warning/20 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-warning/20 to-destructive/20 flex items-center justify-center border border-border">
              <AlertTriangle className="w-12 h-12 text-warning" />
            </div>
          </div>

          <h1 className="text-6xl font-display font-bold text-foreground mb-4">
            404
          </h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Página no encontrada
          </h2>
          <p className="text-muted-foreground max-w-md mb-8">
            La página que buscas no existe o ha sido movida. 
            Regresa al inicio para continuar gestionando tus asistentes.
          </p>

          <Button onClick={() => router.push('/')} variant="gradient" size="lg">
            <Home className="mr-2 h-5 w-5" />
            Volver al inicio
          </Button>
        </div>
      </main>
    </div>
  );
}
