'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Assistant } from '@/types/assistant';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreVertical, 
  Pencil, 
  Trash2, 
  GraduationCap,
  Globe,
  MessageSquare,
  Volume2,
  VolumeX
} from 'lucide-react';

interface AssistantCardProps {
  assistant: Assistant;
  onEdit: (assistant: Assistant) => void;
  onDelete: (id: string) => void;
}

const toneColors: Record<string, string> = {
  Formal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Casual: 'bg-green-500/20 text-green-400 border-green-500/30',
  Profesional: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Amigable: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const languageFlags: Record<string, string> = {
  Español: '🇪🇸',
  Inglés: '🇬🇧',
  Portugués: '🇧🇷',
};

export function AssistantCard({ assistant, onEdit, onDelete }: AssistantCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onDelete(assistant.id);
    setShowDeleteDialog(false);
    setIsDeleting(false);
  };

  const handleTrain = () => {
    router.push(`/${assistant.id}`);
  };

  return (
    <>
      <div className="glass-card p-5 glow-hover group animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-foreground truncate pr-2">
              {assistant.name}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon-sm" 
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(assistant)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTrain}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Entrenar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge-modern bg-secondary border border-border flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            <span className="mr-1">{languageFlags[assistant.language]}</span>
            {assistant.language}
          </span>
          <span className={`badge-modern border ${toneColors[assistant.tone]}`}>
            <MessageSquare className="h-3 w-3 mr-1 inline" />
            {assistant.tone}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {assistant.audioEnabled ? (
            <>
              <Volume2 className="h-4 w-4 text-success" />
              <span>Audio habilitado</span>
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4" />
              <span>Sin audio</span>
            </>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Distribución de respuestas</p>
          <div className="h-2 rounded-full bg-muted overflow-hidden flex">
            <div 
              className="bg-primary/80 transition-all duration-500" 
              style={{ width: `${assistant.responseLength.short}%` }}
            />
            <div 
              className="bg-accent/80 transition-all duration-500" 
              style={{ width: `${assistant.responseLength.medium}%` }}
            />
            <div 
              className="bg-success/80 transition-all duration-500" 
              style={{ width: `${assistant.responseLength.long}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Corta {assistant.responseLength.short}%</span>
            <span>Media {assistant.responseLength.medium}%</span>
            <span>Larga {assistant.responseLength.long}%</span>
          </div>
        </div>

        <Button onClick={handleTrain} variant="outline" className="w-full mt-4">
          <GraduationCap className="mr-2 h-4 w-4" />
          Entrenar asistente
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar asistente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el asistente{' '}
              <span className="font-semibold text-foreground">&quot;{assistant.name}&quot;</span>{' '}
              y toda su configuración.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
