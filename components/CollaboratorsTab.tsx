'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Users,
  Mail,
  QrCode,
  Download,
  Trash2,
  UserPlus,
  Crown,
  Edit3,
  Eye,
  Send,
  CheckCircle,
  Copy,
  Info,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'active';
  addedAt: Date;
}

interface CollaboratorsTabProps {
  assistantId: string;
  assistantName: string;
}

const COLLABORATORS_KEY = 'ai-assistant-collaborators';

const roleLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  admin: { label: 'Administrador', icon: <Crown className="h-3 w-3" />, color: 'text-amber-400 bg-amber-500/20' },
  editor: { label: 'Editor', icon: <Edit3 className="h-3 w-3" />, color: 'text-blue-400 bg-blue-500/20' },
  viewer: { label: 'Visualizador', icon: <Eye className="h-3 w-3" />, color: 'text-green-400 bg-green-500/20' },
};

export function CollaboratorsTab({ assistantId, assistantName }: CollaboratorsTabProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNote, setShowNote] = useState(false);

  // Cargar colaboradores desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`${COLLABORATORS_KEY}-${assistantId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCollaborators(parsed.map((c: Collaborator) => ({ ...c, addedAt: new Date(c.addedAt) })));
      } catch (e) {
        console.error('Error parsing collaborators:', e);
      }
    }
  }, [assistantId]);

  // Guardar colaboradores
  const saveCollaborators = (colabs: Collaborator[]) => {
    localStorage.setItem(`${COLLABORATORS_KEY}-${assistantId}`, JSON.stringify(colabs));
    setCollaborators(colabs);
  };

  // Invitar por email
  const handleInvite = async () => {
    if (!email || !email.includes('@')) return;
    
    setSending(true);
    
    // Simular envío de email
    await new Promise(r => setTimeout(r, 1000));
    
    const newCollaborator: Collaborator = {
      id: `colab-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      status: 'pending',
      addedAt: new Date(),
    };
    
    saveCollaborators([...collaborators, newCollaborator]);
    setEmail('');
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  // Eliminar colaborador
  const handleRemove = (id: string) => {
    saveCollaborators(collaborators.filter(c => c.id !== id));
  };

  // Generar URL de invitación
  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${assistantId}`;

  // Copiar URL
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generar QR (usando API de QR)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`;

  // Descargar QR
  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invite-${assistantName.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error downloading QR:', e);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div>
        <h4 className="text-[11px] font-medium flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-primary" />
          Invitar Colaboradores
        </h4>
        <p className="text-[9px] text-muted-foreground">
          Trabaja en equipo para alimentar y mejorar tu asistente
        </p>
      </div>

      {/* Invitar por email */}
      <div className="p-3 rounded-lg border border-border bg-card/50 space-y-3">
        <Label className="text-[10px] flex items-center gap-1">
          <Mail className="h-3 w-3 text-primary" />
          Invitar por correo electrónico
        </Label>
        
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-8 text-xs flex-1"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="h-8 text-[10px] px-2 rounded border border-border bg-background"
          >
            <option value="editor">Editor</option>
            <option value="viewer">Visualizador</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <Button
          onClick={handleInvite}
          disabled={sending || !email || !email.includes('@')}
          size="sm"
          className="w-full h-8 text-[10px]"
        >
          {sending ? (
            <>Enviando...</>
          ) : sent ? (
            <><CheckCircle className="h-3 w-3 mr-1" />¡Invitación enviada!</>
          ) : (
            <><Send className="h-3 w-3 mr-1" />Enviar invitación</>
          )}
        </Button>
      </div>

      {/* Generar QR */}
      <div className="p-3 rounded-lg border border-border bg-card/50 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] flex items-center gap-1">
            <QrCode className="h-3 w-3 text-accent" />
            Código QR de invitación
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQR(!showQR)}
            className="h-6 text-[9px]"
          >
            {showQR ? 'Ocultar' : 'Mostrar'} QR
          </Button>
        </div>

        {showQR && (
          <div className="flex flex-col items-center gap-3 py-2 animate-fade-in">
            <div className="p-2 bg-white rounded-lg">
              <img src={qrUrl} alt="QR de invitación" className="w-32 h-32" />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
                className="h-7 text-[9px]"
              >
                <Download className="h-3 w-3 mr-1" />
                Descargar QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="h-7 text-[9px]"
              >
                {copied ? (
                  <><CheckCircle className="h-3 w-3 mr-1" />Copiado</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" />Copiar URL</>
                )}
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground text-center max-w-[200px]">
              Comparte este código QR para que otros puedan unirse como colaboradores
            </p>
          </div>
        )}
      </div>

      {/* Lista de colaboradores */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] flex items-center gap-1">
            <UserPlus className="h-3 w-3 text-success" />
            Colaboradores ({collaborators.length})
          </Label>
        </div>

        {collaborators.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No hay colaboradores aún</p>
            <p className="text-[10px]">Invita a tu equipo para trabajar juntos</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
            {collaborators.map((colab) => (
              <div
                key={colab.id}
                className="flex items-center justify-between p-2 rounded-lg border border-border bg-card/50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {colab.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium">{colab.name}</p>
                    <p className="text-[9px] text-muted-foreground">{colab.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1',
                    roleLabels[colab.role].color
                  )}>
                    {roleLabels[colab.role].icon}
                    {roleLabels[colab.role].label}
                  </span>
                  
                  {colab.status === 'pending' && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      Pendiente
                    </span>
                  )}
                  
                  <button
                    onClick={() => handleRemove(colab.id)}
                    className="p-1 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nota informativa colapsable */}
      <div className="rounded-lg bg-primary/5 border border-primary/20 overflow-hidden">
        <button
          onClick={() => setShowNote(!showNote)}
          className="w-full p-2 flex items-center justify-between text-left hover:bg-primary/10 transition-colors"
        >
          <span className="text-[10px] text-primary font-medium flex items-center gap-1">
            <Info className="h-3 w-3" />
            Información para el analista
          </span>
          <ChevronDown className={cn(
            "h-3 w-3 text-primary transition-transform duration-200",
            showNote && "rotate-180"
          )} />
        </button>
        {showNote && (
          <div className="px-2 pb-2 animate-fade-in">
            <p className="text-[9px] text-muted-foreground">
              La funcionalidad completa de colaboradores requiere un sistema de autenticación. 
              Por ahora, las invitaciones se simulan localmente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
