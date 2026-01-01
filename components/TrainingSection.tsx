'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Assistant,
  TrainingConfig,
  Integration,
  Objective,
  LeadCategory,
  Channel,
  defaultTrainingConfig,
  defaultIntegrations,
  FileAnalysis,
  ConversationContext,
  ChatMessage,
} from '@/types/assistant';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { IntegrationModal } from './IntegrationModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Save,
  Loader2,
  CheckCircle,
  FileText,
  Target,
  Users,
  MessageSquare,
  Zap,
  Calendar,
  Brain,
  ShoppingBag,
  GitBranch,
  Play,
  Clock,
  Mail,
  Bell,
  Database,
  ChevronDown,
  ChevronRight,
  Settings,
  Megaphone,
  Send,
  FileSearch,
  History,
  Trash2,
  FileSpreadsheet,
  FileVideo,
  Image as ImageIcon,
  File,
  TrendingUp,
  TrendingDown,
  Minus,
  Hash,
  Tag,
  BarChart3,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CollaboratorsTab } from './CollaboratorsTab';

interface TrainingSectionProps {
  assistant: Assistant;
  onSaveRules: (rules: string, config: TrainingConfig) => void;
}
interface FNode {
  id: string;
  type: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const OBJ: { v: Objective; l: string; i: React.ReactNode }[] = [
  { v: 'Ventas', l: 'Ventas', i: <ShoppingBag className="h-4 w-4" /> },
  { v: 'Soporte', l: 'Soporte', i: <MessageSquare className="h-4 w-4" /> },
  { v: 'Marketing', l: 'Marketing', i: <Target className="h-4 w-4" /> },
  { v: 'Automatización', l: 'Automatización', i: <Zap className="h-4 w-4" /> },
  { v: 'Captación de Leads', l: 'Leads', i: <Users className="h-4 w-4" /> },
];
const LEADS: LeadCategory[] = ['Hot', 'Warm', 'Cold', 'Todos'];
const CHS: { v: Channel; l: string; i: React.ReactNode }[] = [
  { v: 'Webchat', l: 'Webchat', i: <MessageSquare className="h-3 w-3" /> },
  { v: 'WhatsApp', l: 'WhatsApp', i: <MessageSquare className="h-3 w-3" /> },
  { v: 'Email', l: 'Email', i: <Mail className="h-3 w-3" /> },
  { v: 'SMS', l: 'SMS', i: <MessageSquare className="h-3 w-3" /> },
  { v: 'Facebook Ads', l: 'Facebook', i: <Megaphone className="h-3 w-3" /> },
  { v: 'Instagram', l: 'Instagram', i: <MessageSquare className="h-3 w-3" /> },
  { v: 'YouTube', l: 'YouTube', i: <Play className="h-3 w-3" /> },
  { v: 'TikTok', l: 'TikTok', i: <Play className="h-3 w-3" /> },
  { v: 'LinkedIn', l: 'LinkedIn', i: <MessageSquare className="h-3 w-3" /> },
  { v: 'Telegram', l: 'Telegram', i: <Send className="h-3 w-3" /> },
  { v: 'Messenger', l: 'Messenger', i: <MessageSquare className="h-3 w-3" /> },
  { v: 'Google Ads', l: 'Google Ads', i: <Megaphone className="h-3 w-3" /> },
  { v: 'Todos', l: 'Todos', i: <Target className="h-3 w-3" /> },
];

const getFlow = (o: Objective): FNode[] => {
  const f: Record<Objective, FNode[]> = {
    Ventas: [
      { id: '1', type: 'trigger', title: 'Disparador', desc: 'Usuario inicia', icon: <Play className="h-3 w-3" />, color: 'bg-red-500' },
      { id: '2', type: 'message', title: 'Saludo', desc: 'Bienvenida', icon: <MessageSquare className="h-3 w-3" />, color: 'bg-blue-500' },
      { id: '3', type: 'action', title: 'Datos', desc: 'Capturar', icon: <Database className="h-3 w-3" />, color: 'bg-purple-500' },
      { id: '4', type: 'condition', title: 'Clasificar', desc: 'Lead', icon: <GitBranch className="h-3 w-3" />, color: 'bg-amber-500' },
      { id: '5', type: 'message', title: 'Oferta', desc: 'Producto', icon: <ShoppingBag className="h-3 w-3" />, color: 'bg-green-500' },
    ],
    Soporte: [
      { id: '1', type: 'trigger', title: 'Ticket', desc: 'Recibido', icon: <Play className="h-3 w-3" />, color: 'bg-red-500' },
      { id: '2', type: 'action', title: 'Análisis', desc: 'IA', icon: <Brain className="h-3 w-3" />, color: 'bg-purple-500' },
      { id: '3', type: 'condition', title: 'Prioridad', desc: 'Check', icon: <GitBranch className="h-3 w-3" />, color: 'bg-amber-500' },
      { id: '4', type: 'message', title: 'Respuesta', desc: 'Auto', icon: <MessageSquare className="h-3 w-3" />, color: 'bg-blue-500' },
      { id: '5', type: 'action', title: 'Escalar', desc: 'Humano', icon: <Users className="h-3 w-3" />, color: 'bg-orange-500' },
    ],
    Marketing: [
      { id: '1', type: 'trigger', title: 'Suscriptor', desc: 'Nuevo', icon: <Play className="h-3 w-3" />, color: 'bg-red-500' },
      { id: '2', type: 'action', title: 'Segmentar', desc: 'Intereses', icon: <Users className="h-3 w-3" />, color: 'bg-purple-500' },
      { id: '3', type: 'message', title: 'Email', desc: 'Bienvenida', icon: <Mail className="h-3 w-3" />, color: 'bg-blue-500' },
      { id: '4', type: 'delay', title: 'Espera', desc: '3 días', icon: <Clock className="h-3 w-3" />, color: 'bg-cyan-500' },
      { id: '5', type: 'condition', title: 'Abrió?', desc: 'Check', icon: <GitBranch className="h-3 w-3" />, color: 'bg-amber-500' },
    ],
    Automatización: [
      { id: '1', type: 'trigger', title: 'Webhook', desc: 'Evento', icon: <Play className="h-3 w-3" />, color: 'bg-red-500' },
      { id: '2', type: 'action', title: 'Procesar', desc: 'Data', icon: <Database className="h-3 w-3" />, color: 'bg-purple-500' },
      { id: '3', type: 'condition', title: 'Validar', desc: 'Check', icon: <GitBranch className="h-3 w-3" />, color: 'bg-amber-500' },
      { id: '4', type: 'action', title: 'API', desc: 'CRM', icon: <Zap className="h-3 w-3" />, color: 'bg-blue-500' },
      { id: '5', type: 'action', title: 'Notificar', desc: 'Alert', icon: <Bell className="h-3 w-3" />, color: 'bg-orange-500' },
    ],
    'Captación de Leads': [
      { id: '1', type: 'trigger', title: 'Visita', desc: 'Landing', icon: <Play className="h-3 w-3" />, color: 'bg-red-500' },
      { id: '2', type: 'message', title: 'Magnet', desc: 'Recurso', icon: <Target className="h-3 w-3" />, color: 'bg-blue-500' },
      { id: '3', type: 'action', title: 'Capturar', desc: 'Email', icon: <Mail className="h-3 w-3" />, color: 'bg-purple-500' },
      { id: '4', type: 'condition', title: 'Score', desc: '>50?', icon: <GitBranch className="h-3 w-3" />, color: 'bg-amber-500' },
      { id: '5', type: 'action', title: 'Asignar', desc: 'Vendedor', icon: <Users className="h-3 w-3" />, color: 'bg-green-500' },
    ],
  };
  return f[o] || f['Ventas'];
};

const FN = ({ n, a, i }: { n: FNode; a: boolean; i: number }) => (
  <div className={cn('flex-shrink-0 p-2 rounded-lg border', a ? 'border-primary bg-primary/10' : 'border-border bg-card/80')} style={{ minWidth: '95px' }}>
    <div className="flex items-center gap-1 mb-1">
      <div className={cn('p-1 rounded text-white', n.color)}>{n.icon}</div>
      <span className="text-[9px] text-muted-foreground">#{i + 1}</span>
    </div>
    <p className="text-[10px] font-medium truncate">{n.title}</p>
    <p className="text-[9px] text-muted-foreground truncate">{n.desc}</p>
  </div>
);

const IC: Record<string, string> = {
  messaging: 'bg-green-500/20 text-green-400 border-green-500/30',
  ads: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  crm: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  automation: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};
const II: Record<string, React.ReactNode> = {
  messaging: <MessageSquare className="h-3 w-3" />,
  ads: <Megaphone className="h-3 w-3" />,
  crm: <Database className="h-3 w-3" />,
  automation: <Zap className="h-3 w-3" />,
};

// Helper para iconos de archivos
const getFileIcon = (type: string) => {
  switch (type) {
    case 'image': return <ImageIcon className="h-4 w-4 text-blue-400" />;
    case 'video': return <FileVideo className="h-4 w-4 text-purple-400" />;
    case 'pdf': return <FileText className="h-4 w-4 text-red-400" />;
    case 'excel': return <FileSpreadsheet className="h-4 w-4 text-green-400" />;
    case 'word': return <FileText className="h-4 w-4 text-blue-500" />;
    default: return <File className="h-4 w-4 text-muted-foreground" />;
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return <TrendingUp className="h-3 w-3 text-green-400" />;
    case 'negative': return <TrendingDown className="h-3 w-3 text-red-400" />;
    default: return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
};

// Storage keys
const ANALYSES_KEY = 'ai-assistant-file-analyses';
const CONTEXTS_KEY = 'ai-assistant-conversation-contexts';

export function TrainingSection({ assistant, onSaveRules }: TrainingSectionProps) {
  const [rules, setRules] = useState(assistant.rules);
  const [cfg, setCfg] = useState<TrainingConfig>(() => ({
    ...defaultTrainingConfig,
    ...assistant.trainingConfig,
    integrations: assistant.trainingConfig?.integrations || defaultIntegrations,
  }));
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [tab, setTab] = useState<'config' | 'rules' | 'auto' | 'analysis' | 'context' | 'collaborators'>('config');
  const [node, setNode] = useState(0);
  const [col, setCol] = useState(false);
  const [selInt, setSelInt] = useState<Integration | null>(null);
  const [intOpen, setIntOpen] = useState(false);
  const [intCol, setIntCol] = useState(true);
  
  // Estados para análisis y contexto
  const [fileAnalyses, setFileAnalyses] = useState<FileAnalysis[]>([]);
  const [contexts, setContexts] = useState<ConversationContext[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<FileAnalysis | null>(null);
  const [selectedContext, setSelectedContext] = useState<ConversationContext | null>(null);

  const flow = getFlow(cfg.objective);

  // Cargar análisis y contextos desde localStorage
  useEffect(() => {
    const storedAnalyses = localStorage.getItem(`${ANALYSES_KEY}-${assistant.id}`);
    const storedContexts = localStorage.getItem(`${CONTEXTS_KEY}-${assistant.id}`);
    
    if (storedAnalyses) {
      try {
        const parsed = JSON.parse(storedAnalyses);
        setFileAnalyses(parsed.map((a: FileAnalysis) => ({ ...a, analyzedAt: new Date(a.analyzedAt) })));
      } catch (e) { console.error('Error parsing analyses:', e); }
    }
    
    if (storedContexts) {
      try {
        const parsed = JSON.parse(storedContexts);
        setContexts(parsed.map((c: ConversationContext) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map((m: ChatMessage) => ({ ...m, timestamp: new Date(m.timestamp) })),
        })));
      } catch (e) { console.error('Error parsing contexts:', e); }
    }
  }, [assistant.id]);

  // Guardar análisis en localStorage
  const saveAnalyses = useCallback((analyses: FileAnalysis[]) => {
    localStorage.setItem(`${ANALYSES_KEY}-${assistant.id}`, JSON.stringify(analyses));
    setFileAnalyses(analyses);
  }, [assistant.id]);

  // Guardar contextos en localStorage
  const saveContexts = useCallback((ctxs: ConversationContext[]) => {
    localStorage.setItem(`${CONTEXTS_KEY}-${assistant.id}`, JSON.stringify(ctxs));
    setContexts(ctxs);
  }, [assistant.id]);

  // Función para agregar un nuevo análisis (llamada desde el chat)
  const addFileAnalysis = useCallback((analysis: FileAnalysis) => {
    const newAnalyses = [analysis, ...fileAnalyses];
    saveAnalyses(newAnalyses);
  }, [fileAnalyses, saveAnalyses]);

  // Función para guardar contexto de conversación
  const saveConversationContext = useCallback((messages: ChatMessage[], analyses: FileAnalysis[]) => {
    const topics = extractTopics(messages);
    const sentiment = analyzeSentiment(messages);
    
    const newContext: ConversationContext = {
      id: `ctx-${Date.now()}`,
      assistantId: assistant.id,
      assistantName: assistant.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages,
      fileAnalyses: analyses,
      topics,
      sentiment,
      leadScore: calculateLeadScore(messages, sentiment),
    };
    
    const newContexts = [newContext, ...contexts];
    saveContexts(newContexts);
    return newContext;
  }, [assistant.id, assistant.name, contexts, saveContexts]);

  // Eliminar análisis
  const deleteAnalysis = (id: string) => {
    const newAnalyses = fileAnalyses.filter(a => a.id !== id);
    saveAnalyses(newAnalyses);
    if (selectedAnalysis?.id === id) setSelectedAnalysis(null);
  };

  // Eliminar contexto
  const deleteContext = (id: string) => {
    const newContexts = contexts.filter(c => c.id !== id);
    saveContexts(newContexts);
    if (selectedContext?.id === id) setSelectedContext(null);
  };

  // Limpiar todo
  const clearAllAnalyses = () => {
    saveAnalyses([]);
    setSelectedAnalysis(null);
  };

  const clearAllContexts = () => {
    saveContexts([]);
    setSelectedContext(null);
  };

  // Exponer funciones globalmente para el chat
  useEffect(() => {
    (window as unknown as { addFileAnalysis?: typeof addFileAnalysis }).addFileAnalysis = addFileAnalysis;
    (window as unknown as { saveConversationContext?: typeof saveConversationContext }).saveConversationContext = saveConversationContext;
    return () => {
      delete (window as unknown as { addFileAnalysis?: typeof addFileAnalysis }).addFileAnalysis;
      delete (window as unknown as { saveConversationContext?: typeof saveConversationContext }).saveConversationContext;
    };
  }, [addFileAnalysis, saveConversationContext]);

  useEffect(() => { setNode(0); }, [cfg.objective]);
  
  useEffect(() => {
    if (tab === 'auto' && !col) {
      const t = setInterval(() => setNode((p) => (p + 1) % flow.length), 2000);
      return () => clearInterval(t);
    }
  }, [tab, flow.length, col]);

  useEffect(() => {
    setChanged(
      rules !== assistant.rules ||
      JSON.stringify(cfg) !== JSON.stringify({
        ...defaultTrainingConfig,
        ...assistant.trainingConfig,
        integrations: assistant.trainingConfig?.integrations || defaultIntegrations,
      })
    );
  }, [rules, cfg, assistant]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSaveRules(rules, cfg);
    setSaving(false);
    setChanged(false);
  };

  const upd = <K extends keyof TrainingConfig>(k: K, v: TrainingConfig[K]) => setCfg((p) => ({ ...p, [k]: v }));
  const onInt = (i: Integration) => { setSelInt(i); setIntOpen(true); };
  const saveInt = (i: Integration) => upd('integrations', cfg.integrations.map((x) => (x.id === i.id ? i : x)));
  const conn = cfg.integrations.filter((i) => i.connected).length;

  const tabs = [
    { id: 'config', i: <Zap className="h-3.5 w-3.5" />, l: 'Config' },
    { id: 'rules', i: <FileText className="h-3.5 w-3.5" />, l: 'Reglas' },
    { id: 'auto', i: <GitBranch className="h-3.5 w-3.5" />, l: 'Auto' },
    { id: 'analysis', i: <FileSearch className="h-3.5 w-3.5" />, l: 'Análisis', badge: fileAnalyses.length },
    { id: 'context', i: <History className="h-3.5 w-3.5" />, l: 'Contexto', badge: contexts.length },
    { id: 'collaborators', i: <UserPlus className="h-3.5 w-3.5" />, l: 'Colaboradores' },
  ];

  return (
    <div className="glass-card p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between cursor-pointer sm:cursor-default" onClick={() => window.innerWidth < 640 && setCol(!col)}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Configuración</h3>
            <p className="text-[10px] text-muted-foreground hidden sm:block">Entrenamiento del asistente</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {changed && <span className="text-[9px] text-warning bg-warning/20 px-1.5 py-0.5 rounded-full">Sin guardar</span>}
          <button className="sm:hidden">{col ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
        </div>
      </div>

      <div className={cn('space-y-3 transition-all overflow-hidden', col ? 'max-h-0 opacity-0' : 'max-h-[2500px] opacity-100')}>
        {/* Mobile select - Selector de pestañas */}
        <div className="sm:hidden px-0.5">
          <Select value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <SelectTrigger className="h-10 text-xs bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/50 hover:border-primary hover:from-primary/30 hover:to-accent/30 transition-all shadow-sm shadow-primary/20 focus:ring-inset">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="config">⚡ Configuración</SelectItem>
              <SelectItem value="rules">📝 Reglas</SelectItem>
              <SelectItem value="auto">🔀 Automatización</SelectItem>
              <SelectItem value="analysis">🔍 Análisis ({fileAnalyses.length})</SelectItem>
              <SelectItem value="context">📚 Contexto ({contexts.length})</SelectItem>
              <SelectItem value="collaborators">👥 Colaboradores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:flex gap-1 border-b border-border pb-1.5 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-t flex items-center gap-1 whitespace-nowrap',
                tab === t.id ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t.i}
              {t.l}
              {t.badge !== undefined && t.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-primary/30 rounded-full">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Config Tab */}
        {tab === 'config' && (
          <div className="space-y-3 animate-fade-in">
            <div className="space-y-1.5">
              <Label className="text-[10px] flex items-center gap-1"><Target className="h-3 w-3 text-primary" />Objetivo</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {OBJ.map((o) => (
                  <button
                    key={o.v}
                    onClick={() => upd('objective', o.v)}
                    className={cn('flex items-center gap-1 p-1.5 rounded border text-[10px]', cfg.objective === o.v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')}
                  >
                    {o.i}<span className="truncate">{o.l}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] flex items-center gap-1"><Users className="h-3 w-3 text-accent" />Lead</Label>
                <Select value={cfg.leadCategory} onValueChange={(v) => upd('leadCategory', v as LeadCategory)}>
                  <SelectTrigger className="h-8 text-[10px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LEADS.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">
                        {c === 'Hot' ? '🔥 ' : c === 'Warm' ? '🌡️ ' : c === 'Cold' ? '❄️ ' : ''}{c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] flex items-center gap-1"><MessageSquare className="h-3 w-3 text-success" />Canal</Label>
                <Select value={cfg.channel} onValueChange={(v) => upd('channel', v as Channel)}>
                  <SelectTrigger className="h-8 text-[10px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHS.map((c) => (
                      <SelectItem key={c.v} value={c.v} className="text-xs">
                        <span className="flex items-center gap-1">{c.i}{c.l}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { k: 'autoEscalate' as const, l: 'Escalado', i: <Users className="h-2.5 w-2.5" /> },
                { k: 'scheduleEnabled' as const, l: 'Citas', i: <Calendar className="h-2.5 w-2.5" /> },
                { k: 'sentimentAnalysis' as const, l: 'Sentimiento', i: <Brain className="h-2.5 w-2.5" /> },
                { k: 'productRecommendations' as const, l: 'Recomend.', i: <ShoppingBag className="h-2.5 w-2.5" /> },
              ].map((x) => (
                <label key={x.k} className="flex items-center gap-1.5 p-1.5 rounded border border-border text-[10px] cursor-pointer">
                  <Checkbox checked={cfg[x.k]} onCheckedChange={(c) => upd(x.k, c === true)} className="h-3.5 w-3.5" />
                  <span className="flex items-center gap-1">{x.i}{x.l}</span>
                </label>
              ))}
            </div>
            {/* Integrations */}
            <div className="pt-2 border-t border-border">
              <button onClick={() => setIntCol(!intCol)} className="w-full flex items-center justify-between p-2 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-medium">Integraciones</span>
                  <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{conn} conectadas</span>
                </div>
                {intCol ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
              <div className={cn('space-y-2 overflow-hidden transition-all duration-300', intCol ? 'max-h-0 opacity-0 mt-0' : 'max-h-[500px] opacity-100 mt-2')}>
                {(['messaging', 'ads', 'crm', 'automation'] as const).map((t) => {
                  const its = cfg.integrations.filter((i) => i.type === t);
                  const lb: Record<string, string> = { messaging: 'Mensajería', ads: 'Publicidad', crm: 'CRM', automation: 'Automatización' };
                  return (
                    <div key={t} className="space-y-1">
                      <p className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">{II[t]}{lb[t]}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        {its.map((i) => (
                          <button key={i.id} onClick={() => onInt(i)} className={cn('flex items-center justify-between p-1 rounded border text-[9px]', i.connected ? IC[t] : 'border-border text-muted-foreground')}>
                            <span className="truncate">{i.name}</span>
                            {i.connected ? <CheckCircle className="h-2.5 w-2.5" /> : <Settings className="h-2.5 w-2.5 opacity-50" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {tab === 'rules' && (
          <div className="space-y-2 animate-fade-in px-0.5">
            <div className="space-y-1">
              <Label className="text-[10px]">Instrucciones</Label>
              <Textarea value={rules} onChange={(e) => setRules(e.target.value)} placeholder="Reglas..." className="min-h-[100px] text-xs resize-y w-full" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Prompt</Label>
              <Textarea value={cfg.customPrompt} onChange={(e) => upd('customPrompt', e.target.value)} placeholder="Prompt base..." className="min-h-[70px] text-xs resize-y w-full" />
            </div>
          </div>
        )}

        {/* Auto Tab */}
        {tab === 'auto' && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[11px] font-medium">Flujo: {cfg.objective}</h4>
                <p className="text-[9px] text-muted-foreground">Automatizado</p>
              </div>
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />Activo
              </span>
            </div>
            <div className="rounded border border-border bg-background/50 p-2">
              <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin">
                {flow.map((n, i) => (
                  <div key={n.id} className="flex items-center gap-1">
                    <FN n={n} a={i === node} i={i} />
                    {i < flow.length - 1 && (
                      <div className="flex items-center">
                        <div className={cn('w-2.5 h-0.5', i < node ? 'bg-primary' : 'bg-border')} />
                        <ChevronRight className={cn('h-2 w-2 -ml-0.5', i < node ? 'text-primary' : 'text-muted-foreground')} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[8px]">
              {[{ c: 'bg-red-500', l: 'Trigger' }, { c: 'bg-blue-500', l: 'Mensaje' }, { c: 'bg-purple-500', l: 'Acción' }, { c: 'bg-amber-500', l: 'Condición' }].map((x) => (
                <span key={x.l} className="flex items-center gap-1 text-muted-foreground">
                  <span className={cn('w-1.5 h-1.5 rounded', x.c)} />{x.l}
                </span>
              ))}
            </div>
            <div className="p-1.5 rounded bg-primary/5 border border-primary/20 flex items-center gap-2">
              <div className={cn('p-1 rounded text-white', flow[node]?.color)}>{flow[node]?.icon}</div>
              <div>
                <p className="text-[10px] font-medium">Paso {node + 1}: {flow[node]?.title}</p>
                <p className="text-[9px] text-muted-foreground">{flow[node]?.desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {tab === 'analysis' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[11px] font-medium flex items-center gap-1">
                  <FileSearch className="h-3.5 w-3.5 text-primary" />
                  Análisis de Archivos
                </h4>
                <p className="text-[9px] text-muted-foreground">{fileAnalyses.length} archivos analizados</p>
              </div>
              {fileAnalyses.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllAnalyses} className="text-[9px] h-6 text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3 mr-1" />Limpiar
                </Button>
              )}
            </div>

            {fileAnalyses.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <FileSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No hay archivos analizados</p>
                <p className="text-[10px]">Sube archivos en el chat para ver su análisis aquí</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                {fileAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    onClick={() => setSelectedAnalysis(selectedAnalysis?.id === analysis.id ? null : analysis)}
                    className={cn(
                      'p-2 rounded-lg border cursor-pointer transition-all',
                      selectedAnalysis?.id === analysis.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getFileIcon(analysis.fileType)}
                        <div>
                          <p className="text-[10px] font-medium truncate max-w-[150px]">{analysis.fileName}</p>
                          <p className="text-[9px] text-muted-foreground">
                            {new Date(analysis.analyzedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {analysis.sentiment && getSentimentIcon(analysis.sentiment)}
                        <button onClick={(e) => { e.stopPropagation(); deleteAnalysis(analysis.id); }} className="p-1 hover:bg-destructive/20 rounded">
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>

                    {selectedAnalysis?.id === analysis.id && (
                      <div className="mt-2 pt-2 border-t border-border space-y-2 animate-fade-in">
                        <div>
                          <p className="text-[9px] text-muted-foreground uppercase">Resumen</p>
                          <p className="text-[10px]">{analysis.summary}</p>
                        </div>
                        {analysis.keyPoints.length > 0 && (
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                              <Hash className="h-2.5 w-2.5" />Puntos Clave
                            </p>
                            <ul className="text-[10px] space-y-0.5">
                              {analysis.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-primary">•</span>{point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {analysis.entities.length > 0 && (
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                              <Tag className="h-2.5 w-2.5" />Entidades
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {analysis.entities.map((entity, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.5 bg-secondary rounded">
                                  {entity.type}: {entity.value}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 text-[9px] text-muted-foreground">
                          {analysis.wordCount && <span>📝 {analysis.wordCount} palabras</span>}
                          {analysis.pageCount && <span>📄 {analysis.pageCount} páginas</span>}
                          {analysis.duration && <span>⏱️ {analysis.duration}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Context Tab */}
        {tab === 'context' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[11px] font-medium flex items-center gap-1">
                  <History className="h-3.5 w-3.5 text-accent" />
                  Historial de Conversaciones
                </h4>
                <p className="text-[9px] text-muted-foreground">{contexts.length} conversaciones guardadas</p>
              </div>
              {contexts.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllContexts} className="text-[9px] h-6 text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3 mr-1" />Limpiar
                </Button>
              )}
            </div>

            {contexts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No hay conversaciones guardadas</p>
                <p className="text-[10px]">Las conversaciones se guardan automáticamente</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                {contexts.map((ctx) => (
                  <div
                    key={ctx.id}
                    onClick={() => setSelectedContext(selectedContext?.id === ctx.id ? null : ctx)}
                    className={cn(
                      'p-2 rounded-lg border cursor-pointer transition-all',
                      selectedContext?.id === ctx.id ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium">{ctx.messages.length} mensajes</p>
                          <p className="text-[9px] text-muted-foreground">
                            {new Date(ctx.createdAt).toLocaleDateString()} {new Date(ctx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ctx.leadScore !== undefined && (
                          <span className={cn(
                            'text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1',
                            ctx.leadScore >= 70 ? 'bg-green-500/20 text-green-400' :
                            ctx.leadScore >= 40 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          )}>
                            <BarChart3 className="h-2.5 w-2.5" />
                            {ctx.leadScore}%
                          </span>
                        )}
                        {getSentimentIcon(ctx.sentiment)}
                        <button onClick={(e) => { e.stopPropagation(); deleteContext(ctx.id); }} className="p-1 hover:bg-destructive/20 rounded">
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>

                    {/* Topics */}
                    {ctx.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {ctx.topics.slice(0, 3).map((topic, i) => (
                          <span key={i} className="text-[8px] px-1.5 py-0.5 bg-secondary rounded-full">
                            {topic}
                          </span>
                        ))}
                        {ctx.topics.length > 3 && (
                          <span className="text-[8px] text-muted-foreground">+{ctx.topics.length - 3}</span>
                        )}
                      </div>
                    )}

                    {selectedContext?.id === ctx.id && (
                      <div className="mt-2 pt-2 border-t border-border space-y-2 animate-fade-in">
                        {/* Messages preview */}
                        <div>
                          <p className="text-[9px] text-muted-foreground uppercase mb-1">Conversación</p>
                          <div className="space-y-1 max-h-[150px] overflow-y-auto scrollbar-thin">
                            {ctx.messages.map((msg) => (
                              <div key={msg.id} className={cn('text-[10px] p-1.5 rounded', msg.role === 'user' ? 'bg-primary/10 ml-4' : 'bg-secondary mr-4')}>
                                <span className="text-[8px] text-muted-foreground">{msg.role === 'user' ? '👤' : '🤖'}</span>
                                <span className="ml-1">{msg.content.slice(0, 100)}{msg.content.length > 100 ? '...' : ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* File analyses in this context */}
                        {ctx.fileAnalyses.length > 0 && (
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                              <FileSearch className="h-2.5 w-2.5" />
                              Archivos analizados ({ctx.fileAnalyses.length})
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {ctx.fileAnalyses.map((fa) => (
                                <span key={fa.id} className="text-[9px] px-1.5 py-0.5 bg-secondary rounded flex items-center gap-1">
                                  {getFileIcon(fa.fileType)}
                                  {fa.fileName.slice(0, 15)}{fa.fileName.length > 15 ? '...' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Summary */}
                        {ctx.summary && (
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase">Resumen</p>
                            <p className="text-[10px]">{ctx.summary}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collaborators Tab */}
        {tab === 'collaborators' && (
          <CollaboratorsTab assistantId={assistant.id} assistantName={assistant.name} />
        )}

        {/* Save button */}
        <div className="flex justify-end pt-2 border-t border-border">
          <Button onClick={save} disabled={saving || !changed} variant={changed ? 'gradient' : 'secondary'} size="sm" className="text-[10px] h-7">
            {saving ? (
              <><Loader2 className="mr-1 h-3 w-3 animate-spin" />...</>
            ) : changed ? (
              <><Save className="mr-1 h-3 w-3" />Guardar</>
            ) : (
              <><CheckCircle className="mr-1 h-3 w-3" />OK</>
            )}
          </Button>
        </div>
      </div>

      <IntegrationModal isOpen={intOpen} onClose={() => setIntOpen(false)} integration={selInt} onSave={saveInt} />
    </div>
  );
}

// Helper functions
function extractTopics(messages: ChatMessage[]): string[] {
  const topics: string[] = [];
  const keywords = ['precio', 'costo', 'producto', 'servicio', 'ayuda', 'problema', 'comprar', 'información', 'contacto', 'soporte', 'venta', 'oferta', 'descuento', 'envío', 'pago'];
  
  messages.forEach(msg => {
    const content = msg.content.toLowerCase();
    keywords.forEach(kw => {
      if (content.includes(kw) && !topics.includes(kw)) {
        topics.push(kw);
      }
    });
  });
  
  return topics.slice(0, 5);
}

function analyzeSentiment(messages: ChatMessage[]): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['gracias', 'excelente', 'perfecto', 'genial', 'bueno', 'bien', 'encanta', 'feliz', 'satisfecho'];
  const negativeWords = ['problema', 'mal', 'error', 'queja', 'molesto', 'terrible', 'peor', 'nunca', 'horrible'];
  
  let score = 0;
  messages.forEach(msg => {
    const content = msg.content.toLowerCase();
    positiveWords.forEach(w => { if (content.includes(w)) score++; });
    negativeWords.forEach(w => { if (content.includes(w)) score--; });
  });
  
  if (score > 1) return 'positive';
  if (score < -1) return 'negative';
  return 'neutral';
}

function calculateLeadScore(messages: ChatMessage[], sentiment: string): number {
  let score = 50;
  
  // Más mensajes = más interés
  score += Math.min(messages.length * 3, 20);
  
  // Sentimiento positivo aumenta score
  if (sentiment === 'positive') score += 15;
  if (sentiment === 'negative') score -= 10;
  
  // Palabras de compra aumentan score
  const buyWords = ['comprar', 'precio', 'costo', 'pagar', 'adquirir', 'contratar'];
  messages.forEach(msg => {
    buyWords.forEach(w => {
      if (msg.content.toLowerCase().includes(w)) score += 5;
    });
  });
  
  return Math.min(Math.max(score, 0), 100);
}
