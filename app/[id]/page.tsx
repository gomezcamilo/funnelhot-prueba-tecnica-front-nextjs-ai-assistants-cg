'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAssistants } from '@/hooks/useAssistants';
import { TrainingConfig } from '@/types/assistant';
import { Header } from '@/components/Header';
import { TrainingSection } from '@/components/TrainingSection';
import { ChatSimulator } from '@/components/ChatSimulator';
import { AlertModal } from '@/components/AlertModal';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Globe,
  MessageSquare,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { NeonBorder } from '@/components/ui/neon-border';

const toneColors: Record<string, string> = {
  Formal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Casual: 'bg-green-500/20 text-green-400 border-green-500/30',
  Profesional: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Amigable: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

interface AlertState {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  description: string;
}

export default function TrainingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getAssistantById, updateRules, updateTrainingConfig, isLoaded } = useAssistants();
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: 'success',
    title: '',
    description: '',
  });

  const assistant = id ? getAssistantById(id) : undefined;

  const showAlert = (
    type: 'success' | 'error',
    title: string,
    description: string
  ) => {
    setAlert({ isOpen: true, type, title, description });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen">
        <Header showHomeButton onHomeClick={() => router.push('/')} />
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando asistente...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen">
        <Header showHomeButton onHomeClick={() => router.push('/')} />
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Asistente no encontrado
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              El asistente que buscas no existe o ha sido eliminado. Verifica el
              ID o regresa al listado.
            </p>
            <Button onClick={() => router.push('/')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al listado
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleSaveRules = (rules: string, config: TrainingConfig) => {
    try {
      updateRules(assistant.id, rules);
      updateTrainingConfig(assistant.id, config);
      showAlert(
        'success',
        '¡Entrenamiento guardado!',
        'Las reglas y configuración del asistente han sido actualizadas correctamente.'
      );
    } catch (error) {
      showAlert(
        'error',
        'Error al guardar',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al guardar la configuración.'
      );
    }
  };

  return (
    <div className="min-h-screen">
      <Header showHomeButton onHomeClick={() => router.push('/')} />

      <main className="container mx-auto px-4 py-8 relative">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Button>
        </div>

        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                {assistant.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="badge-modern bg-secondary border border-border flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  {assistant.language}
                </span>
                <span
                  className={`badge-modern border ${toneColors[assistant.tone]}`}
                >
                  <MessageSquare className="h-3 w-3 mr-1 inline" />
                  {assistant.tone}
                </span>
                <span className="badge-modern bg-secondary border border-border flex items-center gap-1.5">
                  {assistant.audioEnabled ? (
                    <>
                      <Volume2 className="h-3 w-3 text-success" />
                      Audio habilitado
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-3 w-3" />
                      Sin audio
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-muted-foreground mb-2">
                Distribución de respuestas
              </p>
              <div className="flex gap-3 text-sm">
                <span className="text-primary font-medium">
                  Corta: {assistant.responseLength.short}%
                </span>
                <span className="text-accent font-medium">
                  Media: {assistant.responseLength.medium}%
                </span>
                <span className="text-success font-medium">
                  Larga: {assistant.responseLength.long}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <TrainingSection
              assistant={assistant}
              onSaveRules={handleSaveRules}
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="mb-4">
              <h3 className="font-display font-semibold text-foreground text-lg">
                Chat de prueba
              </h3>
              <p className="text-sm text-muted-foreground">
                Prueba cómo responde tu asistente
              </p>
            </div>
            <NeonBorder borderRadius="rounded-xl" borderWidth={2} animationDuration={4}>
              <ChatSimulator assistant={assistant} />
            </NeonBorder>
          </div>
        </div>
      </main>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        description={alert.description}
      />
    </div>
  );
}
