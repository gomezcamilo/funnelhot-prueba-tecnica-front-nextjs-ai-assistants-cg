'use client';

import { useState } from 'react';
import { Integration } from '@/types/assistant';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MessageSquare,
  Megaphone,
  Database,
  Zap,
  Check,
  X,
  Key,
  Link2,
  User,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration | null;
  onSave: (integration: Integration) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  messaging: <MessageSquare className="h-5 w-5" />,
  ads: <Megaphone className="h-5 w-5" />,
  crm: <Database className="h-5 w-5" />,
  automation: <Zap className="h-5 w-5" />,
  analytics: <Zap className="h-5 w-5" />,
};

const typeColors: Record<string, string> = {
  messaging: 'bg-green-500',
  ads: 'bg-blue-500',
  crm: 'bg-purple-500',
  automation: 'bg-amber-500',
  analytics: 'bg-cyan-500',
};

const integrationDocs: Record<string, string> = {
  whatsapp: 'https://developers.facebook.com/docs/whatsapp',
  messenger: 'https://developers.facebook.com/docs/messenger-platform',
  instagram: 'https://developers.facebook.com/docs/instagram-api',
  telegram: 'https://core.telegram.org/bots/api',
  'facebook-ads': 'https://developers.facebook.com/docs/marketing-apis',
  'google-ads': 'https://developers.google.com/google-ads/api',
  youtube: 'https://developers.google.com/youtube/v3',
  tiktok: 'https://developers.tiktok.com/',
  linkedin: 'https://docs.microsoft.com/linkedin/',
  hubspot: 'https://developers.hubspot.com/',
  salesforce: 'https://developer.salesforce.com/',
  zapier: 'https://zapier.com/developer',
  make: 'https://www.make.com/en/api-documentation',
  n8n: 'https://docs.n8n.io/',
};

export function IntegrationModal({ isOpen, onClose, integration, onSave }: IntegrationModalProps) {
  const [apiKey, setApiKey] = useState(integration?.apiKey || '');
  const [webhookUrl, setWebhookUrl] = useState(integration?.webhookUrl || '');
  const [accountId, setAccountId] = useState(integration?.accountId || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(integration?.connected || false);

  if (!integration) return null;

  const handleConnect = async () => {
    if (!apiKey.trim()) return;
    
    setIsConnecting(true);
    // Simular conexión
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsConnected(true);
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey('');
    setWebhookUrl('');
    setAccountId('');
  };

  const handleSave = () => {
    onSave({
      ...integration,
      apiKey,
      webhookUrl,
      accountId,
      connected: isConnected,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', typeColors[integration.type])}>
              {typeIcons[integration.type]}
            </div>
            <div>
              <span className="text-lg">{integration.name}</span>
              <p className="text-xs text-muted-foreground font-normal capitalize">
                {integration.type === 'ads' ? 'Publicidad' : 
                 integration.type === 'messaging' ? 'Mensajería' :
                 integration.type === 'crm' ? 'CRM' :
                 integration.type === 'automation' ? 'Automatización' : integration.type}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Estado de conexión */}
          <div className={cn(
            'flex items-center justify-between p-3 rounded-lg border',
            isConnected ? 'bg-success/10 border-success/30' : 'bg-muted/50 border-border'
          )}>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Check className="h-5 w-5 text-success" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={cn('text-sm font-medium', isConnected ? 'text-success' : 'text-muted-foreground')}>
                {isConnected ? 'Conectado' : 'No conectado'}
              </span>
            </div>
            {isConnected && (
              <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-destructive hover:text-destructive">
                Desconectar
              </Button>
            )}
          </div>

          {/* Campos de configuración */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="apiKey" className="flex items-center gap-1.5 text-xs">
                <Key className="h-3.5 w-3.5" />
                API Key / Token
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ingresa tu API Key..."
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="webhookUrl" className="flex items-center gap-1.5 text-xs">
                <Link2 className="h-3.5 w-3.5" />
                Webhook URL (opcional)
              </Label>
              <Input
                id="webhookUrl"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://tu-webhook.com/endpoint"
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accountId" className="flex items-center gap-1.5 text-xs">
                <User className="h-3.5 w-3.5" />
                Account ID / Page ID (opcional)
              </Label>
              <Input
                id="accountId"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="ID de cuenta o página"
                className="text-sm"
              />
            </div>
          </div>

          {/* Link a documentación */}
          <a
            href={integrationDocs[integration.id] || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver documentación de {integration.name}
          </a>
        </div>

        {/* Botones */}
        <div className="flex justify-between gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            {!isConnected && (
              <Button
                onClick={handleConnect}
                disabled={!apiKey.trim() || isConnecting}
                variant="outline"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  'Probar conexión'
                )}
              </Button>
            )}
            <Button onClick={handleSave} variant="gradient">
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
