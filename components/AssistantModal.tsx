'use client';

import { useState, useEffect, useCallback } from 'react';
import { Assistant, AssistantFormData, Language, Tone } from '@/types/assistant';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Assistant, 'id' | 'rules'>) => void;
  assistant?: Assistant | null;
}

const LANGUAGES: Language[] = ['Español', 'Inglés', 'Portugués'];
const TONES: Tone[] = ['Formal', 'Casual', 'Profesional', 'Amigable'];

const initialFormData: AssistantFormData = {
  name: '',
  language: '',
  tone: '',
  responseLength: { short: 33, medium: 34, long: 33 },
  audioEnabled: false,
};

export function AssistantModal({ isOpen, onClose, onSave, assistant }: AssistantModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AssistantFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isEditing = !!assistant;

  useEffect(() => {
    if (isOpen) {
      if (assistant) {
        setFormData({
          name: assistant.name,
          language: assistant.language,
          tone: assistant.tone,
          responseLength: { ...assistant.responseLength },
          audioEnabled: assistant.audioEnabled,
        });
      } else {
        setFormData(initialFormData);
      }
      setStep(1);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, assistant]);

  const validateStep1 = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!formData.language) newErrors.language = 'Selecciona un idioma';
    if (!formData.tone) newErrors.tone = 'Selecciona un tono';
    return newErrors;
  }, [formData.name, formData.language, formData.tone]);

  const validateStep2 = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const total = formData.responseLength.short + formData.responseLength.medium + formData.responseLength.long;
    if (total !== 100) {
      newErrors.responseLength = `La suma debe ser exactamente 100% (actual: ${total}%)`;
    }
    return newErrors;
  }, [formData.responseLength]);

  useEffect(() => {
    setErrors(step === 1 ? validateStep1() : validateStep2());
  }, [step, validateStep1, validateStep2]);

  const isStep1Valid = Object.keys(validateStep1()).length === 0;
  const isStep2Valid = Object.keys(validateStep2()).length === 0;

  const handleNext = () => {
    setTouched({ name: true, language: true, tone: true });
    if (isStep1Valid) setStep(2);
  };

  const handleSave = async () => {
    if (!isStep2Valid) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    onSave({
      name: formData.name.trim(),
      language: formData.language as Language,
      tone: formData.tone as Tone,
      responseLength: formData.responseLength,
      audioEnabled: formData.audioEnabled,
    });
    setIsSaving(false);
  };

  const handleSliderChange = (key: 'short' | 'medium' | 'long', value: number) => {
    const currentTotal = formData.responseLength.short + formData.responseLength.medium + formData.responseLength.long;
    const currentValue = formData.responseLength[key];
    const diff = value - currentValue;
    const newTotal = currentTotal + diff;
    
    if (newTotal > 100) {
      const excess = newTotal - 100;
      const otherKeys = ['short', 'medium', 'long'].filter(k => k !== key) as Array<'short' | 'medium' | 'long'>;
      const newValues = { ...formData.responseLength, [key]: value };
      let remaining = excess;
      for (const otherKey of otherKeys) {
        const reduction = Math.min(newValues[otherKey], remaining);
        newValues[otherKey] -= reduction;
        remaining -= reduction;
      }
      setFormData(prev => ({ ...prev, responseLength: newValues }));
    } else {
      setFormData(prev => ({ ...prev, responseLength: { ...prev.responseLength, [key]: value } }));
    }
  };

  const responseLengthTotal = formData.responseLength.short + formData.responseLength.medium + formData.responseLength.long;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-display">
            {isEditing ? 'Editar Asistente' : 'Crear Asistente'}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={cn('step-indicator', step >= 1 ? 'active' : 'pending')}>
                {step > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className={cn('text-sm font-medium', step >= 1 ? 'text-foreground' : 'text-muted-foreground')}>
                Datos básicos
              </span>
            </div>
            <div className="w-12 h-0.5 bg-border rounded-full overflow-hidden">
              <div className={cn('h-full bg-primary transition-all duration-300', step >= 2 ? 'w-full' : 'w-0')} />
            </div>
            <div className="flex items-center gap-2">
              <div className={cn('step-indicator', step >= 2 ? 'active' : 'pending')}>2</div>
              <span className={cn('text-sm font-medium', step >= 2 ? 'text-foreground' : 'text-muted-foreground')}>
                Configuración
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 min-h-[280px]">
          {step === 1 ? (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del asistente *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                  placeholder="Ej: Asistente de Ventas"
                  className={cn(touched.name && errors.name && 'border-destructive')}
                />
                {touched.name && errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, language: value as Language }));
                    setTouched(prev => ({ ...prev, language: true }));
                  }}
                >
                  <SelectTrigger className={cn(touched.language && errors.language && 'border-destructive')}>
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang === 'Español' && '🇪🇸 '}
                        {lang === 'Inglés' && '🇬🇧 '}
                        {lang === 'Portugués' && '🇧🇷 '}
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.language && errors.language && <p className="text-xs text-destructive">{errors.language}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tono de comunicación *</Label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, tone: value as Tone }));
                    setTouched(prev => ({ ...prev, tone: true }));
                  }}
                >
                  <SelectTrigger className={cn(touched.tone && errors.tone && 'border-destructive')}>
                    <SelectValue placeholder="Selecciona un tono" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((tone) => (
                      <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.tone && errors.tone && <p className="text-xs text-destructive">{errors.tone}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Longitud de respuestas</Label>
                  <span className={cn(
                    'text-sm font-medium px-2 py-0.5 rounded',
                    responseLengthTotal === 100 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  )}>
                    Total: {responseLengthTotal}%
                  </span>
                </div>

                {(['short', 'medium', 'long'] as const).map((key) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {key === 'short' ? 'Corta' : key === 'medium' ? 'Media' : 'Larga'}
                      </span>
                      <span className={cn(
                        'font-medium',
                        key === 'short' ? 'text-primary' : key === 'medium' ? 'text-accent' : 'text-success'
                      )}>
                        {formData.responseLength[key]}%
                      </span>
                    </div>
                    <Slider
                      value={[formData.responseLength[key]]}
                      onValueChange={([value]) => handleSliderChange(key, value)}
                      max={100}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                ))}

                {errors.responseLength && <p className="text-xs text-destructive">{errors.responseLength}</p>}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="audioEnabled"
                  checked={formData.audioEnabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, audioEnabled: checked === true }))}
                />
                <Label htmlFor="audioEnabled" className="cursor-pointer">
                  Habilitar respuestas de audio
                </Label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-6 pt-4 border-t border-border bg-muted/30">
          {step === 1 ? (
            <>
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleNext} disabled={!isStep1Valid}>
                Siguiente
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setStep(1)} disabled={isSaving}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={handleSave} disabled={!isStep2Valid || isSaving} variant="gradient">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
