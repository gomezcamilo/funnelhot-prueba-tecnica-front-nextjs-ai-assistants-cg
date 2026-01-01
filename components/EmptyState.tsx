'use client';

import { Bot, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border">
          <Bot className="w-12 h-12 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">
        No hay asistentes
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Crea tu primer asistente de IA para comenzar. Podrás configurar su idioma, tono y entrenarlo con reglas personalizadas.
      </p>
      <Button onClick={onCreateClick} variant="gradient" size="lg">
        <Plus className="mr-2 h-5 w-5" />
        Crear primer asistente
      </Button>
    </div>
  );
}
