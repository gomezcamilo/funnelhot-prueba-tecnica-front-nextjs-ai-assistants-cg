'use client';

import { AnimatedBorderButton } from '@/components/ui/neon-border';
import { Zap, Bot, TrendingUp, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - compacto */}
      <header className="px-6 lg:px-16 xl:px-24 2xl:px-32 py-3 lg:py-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-display font-bold text-foreground">Funnelhot</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 lg:px-16 xl:px-24 2xl:px-32 pb-6 flex flex-col overflow-y-auto">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-12 items-center flex-1">
          
          {/* Left - Content */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-foreground mb-3 lg:mb-4 leading-tight">
              Automatizaciones
              <span className="text-primary"> simples con IA</span>
            </h1>
            
            <p className="text-sm lg:text-lg text-muted-foreground mb-5 lg:mb-6 max-w-lg">
              Crea asistentes inteligentes que interactúan con tus leads 24/7 
              y aumentan tus conversiones automáticamente.
            </p>

            <div className="mb-4 lg:mb-6">
              <AnimatedBorderButton onClick={onStart}>
                Empezar a Automatizar
                <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedBorderButton>
            </div>

            {/* Stats */}
            <div className="flex gap-4 lg:gap-6 pt-4 lg:pt-6 border-t border-border">
              <div className="p-2 lg:p-3 rounded-lg cursor-default transition-all duration-300 hover:bg-primary/10 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                <div className="text-xl lg:text-3xl font-bold text-foreground">24/7</div>
                <div className="text-[10px] lg:text-sm text-muted-foreground">Disponibilidad</div>
              </div>
              <div className="p-2 lg:p-3 rounded-lg cursor-default transition-all duration-300 hover:bg-primary/10 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                <div className="text-xl lg:text-3xl font-bold text-primary">+300%</div>
                <div className="text-[10px] lg:text-sm text-muted-foreground">Conversiones</div>
              </div>
              <div className="p-2 lg:p-3 rounded-lg cursor-default transition-all duration-300 hover:bg-primary/10 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                <div className="text-xl lg:text-3xl font-bold text-foreground">5min</div>
                <div className="text-[10px] lg:text-sm text-muted-foreground">Configuración</div>
              </div>
            </div>
          </div>

          {/* Right - Image Card */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg">
              {/* Glow effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50" />
              
              {/* Image container */}
              <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-xl">
                <img
                  src="/funnel-img-gen.png"
                  alt="Funnelhot - Automatización con IA"
                  className="w-full h-auto object-cover"
                />
                
                {/* Floating badge */}
                <div className="absolute bottom-2 left-2 right-2 lg:bottom-3 lg:left-3 lg:right-3">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 lg:p-3 border border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-md bg-success/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-success" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs lg:text-sm font-medium text-foreground truncate">Resultados en tiempo real</div>
                        <div className="text-[10px] lg:text-xs text-muted-foreground">Monitorea conversiones</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex-shrink-0 pt-3 lg:pt-6">
          <div className="grid grid-cols-3 gap-2 lg:gap-6">
            <div className="group p-2 lg:p-4 rounded-lg lg:rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
              <div className="flex items-center gap-1.5 lg:gap-3">
                <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md lg:rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 lg:w-5 lg:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground text-[10px] lg:text-base truncate">Asistentes IA</h3>
                  <p className="text-[8px] lg:text-xs text-muted-foreground hidden sm:block truncate">Ventas y soporte</p>
                </div>
              </div>
            </div>

            <div className="group p-2 lg:p-4 rounded-lg lg:rounded-xl bg-card border border-border hover:border-accent/30 transition-all">
              <div className="flex items-center gap-1.5 lg:gap-3">
                <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md lg:rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 lg:w-5 lg:h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground text-[10px] lg:text-base truncate">Automatización</h3>
                  <p className="text-[8px] lg:text-xs text-muted-foreground hidden sm:block truncate">Flujos 24/7</p>
                </div>
              </div>
            </div>

            <div className="group p-2 lg:p-4 rounded-lg lg:rounded-xl bg-card border border-border hover:border-success/30 transition-all">
              <div className="flex items-center gap-1.5 lg:gap-3">
                <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md lg:rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3 lg:w-5 lg:h-5 text-success" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground text-[10px] lg:text-base truncate">Conversiones</h3>
                  <p className="text-[8px] lg:text-xs text-muted-foreground hidden sm:block truncate">Leads calificados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
