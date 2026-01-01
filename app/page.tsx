'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAssistants } from '@/hooks/useAssistants';
import { Assistant, Language, Tone, ResponseLength, defaultTrainingConfig } from '@/types/assistant';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AssistantCard } from '@/components/AssistantCard';
import { AssistantModal } from '@/components/AssistantModal';
import { AlertModal } from '@/components/AlertModal';
import { EmptyState } from '@/components/EmptyState';
import { LandingHero } from '@/components/LandingHero';
import { AnimatedBorderButton } from '@/components/ui/neon-border';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, Search } from 'lucide-react';

interface AlertState {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  description: string;
  onContinue?: () => void;
}

const LANDING_SEEN_KEY = 'funnelhot-landing-seen';

export default function HomePage() {
  const router = useRouter();
  const { assistants, isLoaded, createAssistant, updateAssistant, deleteAssistant } = useAssistants();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: 'success',
    title: '',
    description: '',
  });

  // Verificar si ya vio el landing
  useEffect(() => {
    const seen = localStorage.getItem(LANDING_SEEN_KEY);
    if (seen === 'true') {
      setShowLanding(false);
    }
  }, []);

  const handleStartFromLanding = () => {
    localStorage.setItem(LANDING_SEEN_KEY, 'true');
    setShowLanding(false);
  };

  const showAlert = (type: 'success' | 'error', title: string, description: string, onContinue?: () => void) => {
    setAlert({ isOpen: true, type, title, description, onContinue });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCreate = () => {
    setEditingAssistant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assistant: Assistant) => {
    setEditingAssistant(assistant);
    setIsModalOpen(true);
  };

  const handleSave = (data: {
    name: string;
    language: Language;
    tone: Tone;
    responseLength: ResponseLength;
    audioEnabled: boolean;
  }) => {
    try {
      if (editingAssistant) {
        updateAssistant(editingAssistant.id, data);
        setIsModalOpen(false);
        setEditingAssistant(null);
        showAlert(
          'success',
          '¡Asistente actualizado!',
          `"${data.name}" ha sido actualizado correctamente.`,
          () => router.push(`/${editingAssistant.id}`)
        );
      } else {
        const newAssistant = createAssistant({ ...data, rules: '', trainingConfig: defaultTrainingConfig });
        setIsModalOpen(false);
        setEditingAssistant(null);
        showAlert(
          'success',
          '¡Asistente creado!',
          `"${data.name}" ha sido creado exitosamente. Presiona continuar para entrenarlo.`,
          () => router.push(`/${newAssistant.id}`)
        );
      }
    } catch (error) {
      showAlert(
        'error',
        'Error al guardar',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado al guardar el asistente.'
      );
    }
  };

  const handleDelete = (id: string) => {
    try {
      const assistant = assistants.find((a) => a.id === id);
      deleteAssistant(id);
      showAlert(
        'success',
        '¡Asistente eliminado!',
        assistant ? `"${assistant.name}" ha sido eliminado correctamente.` : 'El asistente ha sido eliminado.'
      );
    } catch (error) {
      showAlert(
        'error',
        'Error al eliminar',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado al eliminar el asistente.'
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssistant(null);
  };

  const handleBackToLanding = () => {
    localStorage.removeItem(LANDING_SEEN_KEY);
    setShowLanding(true);
  };

  // Filtrar asistentes por búsqueda
  const filteredAssistants = useMemo(() => {
    if (!searchQuery.trim()) return assistants;
    const query = searchQuery.toLowerCase();
    return assistants.filter((assistant) =>
      assistant.name.toLowerCase().includes(query)
    );
  }, [assistants, searchQuery]);

  // Mostrar landing si no lo ha visto
  if (showLanding) {
    return <LandingHero onStart={handleStartFromLanding} />;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando asistentes...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showHomeButton onHomeClick={handleBackToLanding} />
      
      <main className="flex-1 px-4 lg:px-16 xl:px-24 py-8 relative max-w-7xl mx-auto w-full">
        {/* Header con título y botón */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
              Mis Asistentes
            </h2>
            <p className="text-muted-foreground">
              {assistants.length === 0
                ? 'Crea tu primer asistente de IA'
                : `${assistants.length} asistente${assistants.length !== 1 ? 's' : ''} configurado${assistants.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          
          {assistants.length > 0 && (
            <AnimatedBorderButton onClick={handleCreate}>
              <Plus className="mr-2 h-5 w-5" />
              Crear Asistente
            </AnimatedBorderButton>
          )}
        </div>

        {/* Buscador */}
        {assistants.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar automatización..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            {searchQuery && filteredAssistants.length === 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                No se encontraron asistentes con "{searchQuery}"
              </p>
            )}
          </div>
        )}

        {assistants.length === 0 ? (
          <EmptyState onCreateClick={handleCreate} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAssistants.map((assistant, index) => (
              <div
                key={assistant.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-slide-up"
              >
                <AssistantCard
                  assistant={assistant}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <AssistantModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        assistant={editingAssistant}
      />

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        description={alert.description}
        onContinue={alert.onContinue}
      />

      <Footer />
    </div>
  );
}
