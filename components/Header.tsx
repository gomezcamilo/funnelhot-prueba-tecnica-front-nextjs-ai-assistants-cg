'use client';

import { Bot, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showHomeButton?: boolean;
  onHomeClick?: () => void;
}

export function Header({ showHomeButton = false, onHomeClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="px-4 lg:px-16 xl:px-24 py-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Funnelhot
              </h1>
              <p className="text-xs text-muted-foreground">Automatizaciones con IA</p>
            </div>
          </div>
          
          {showHomeButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onHomeClick}
              className="text-muted-foreground hover:text-foreground"
            >
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
