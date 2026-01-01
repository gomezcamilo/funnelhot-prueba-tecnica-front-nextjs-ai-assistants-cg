'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  description: string;
  onContinue?: () => void;
}

export function AlertModal({ isOpen, onClose, type, title, description, onContinue }: AlertModalProps) {
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center mb-4',
              type === 'success' ? 'bg-success/20' : 'bg-destructive/20'
            )}
          >
            {type === 'success' ? (
              <CheckCircle className="w-8 h-8 text-success" />
            ) : (
              <XCircle className="w-8 h-8 text-destructive" />
            )}
          </div>
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center mt-4">
          <AlertDialogAction
            onClick={handleContinue}
            className={cn(
              'min-w-[120px]',
              type === 'success'
                ? 'bg-success hover:bg-success/90 text-success-foreground'
                : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            )}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
