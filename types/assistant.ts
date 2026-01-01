export type Language = 'Español' | 'Inglés' | 'Portugués';
export type Tone = 'Formal' | 'Casual' | 'Profesional' | 'Amigable';
export type Objective = 'Ventas' | 'Soporte' | 'Marketing' | 'Automatización' | 'Captación de Leads';
export type LeadCategory = 'Hot' | 'Warm' | 'Cold' | 'Todos';
export type Channel = 
  | 'Webchat' 
  | 'WhatsApp' 
  | 'Email' 
  | 'SMS' 
  | 'Facebook Ads'
  | 'Instagram'
  | 'YouTube'
  | 'TikTok'
  | 'LinkedIn'
  | 'Telegram'
  | 'Messenger'
  | 'Google Ads'
  | 'Todos';

export interface Integration {
  id: string;
  name: string;
  type: 'messaging' | 'ads' | 'crm' | 'analytics' | 'automation';
  connected: boolean;
  apiKey?: string;
  webhookUrl?: string;
  accountId?: string;
}

export interface ResponseLength {
  short: number;
  medium: number;
  long: number;
}

export interface TrainingConfig {
  objective: Objective;
  leadCategory: LeadCategory;
  channel: Channel;
  autoEscalate: boolean;
  scheduleEnabled: boolean;
  sentimentAnalysis: boolean;
  productRecommendations: boolean;
  customPrompt: string;
  integrations: Integration[];
}

export interface Assistant {
  id: string;
  name: string;
  language: Language;
  tone: Tone;
  responseLength: ResponseLength;
  audioEnabled: boolean;
  rules: string;
  trainingConfig: TrainingConfig;
}

export type FileType = 'image' | 'video' | 'pdf' | 'excel' | 'word' | 'text' | 'other';

export interface ChatAttachment {
  id: string;
  name: string;
  type: FileType;
  size: number;
  url: string;
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAudio?: boolean;
  attachments?: ChatAttachment[];
}

// Análisis de archivos
export interface FileAnalysis {
  id: string;
  fileId: string;
  fileName: string;
  fileType: FileType;
  analyzedAt: Date;
  summary: string;
  keyPoints: string[];
  entities: { type: string; value: string }[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  language?: string;
  wordCount?: number;
  pageCount?: number;
  duration?: string; // Para videos
  dimensions?: { width: number; height: number }; // Para imágenes/videos
}

// Contexto de conversación
export interface ConversationContext {
  id: string;
  assistantId: string;
  assistantName: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  fileAnalyses: FileAnalysis[];
  summary?: string;
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  leadScore?: number;
}

export interface AssistantFormData {
  name: string;
  language: Language | '';
  tone: Tone | '';
  responseLength: ResponseLength;
  audioEnabled: boolean;
}

export const defaultIntegrations: Integration[] = [
  { id: 'whatsapp', name: 'WhatsApp Business', type: 'messaging', connected: false },
  { id: 'messenger', name: 'Messenger', type: 'messaging', connected: false },
  { id: 'instagram', name: 'Instagram DM', type: 'messaging', connected: false },
  { id: 'telegram', name: 'Telegram', type: 'messaging', connected: false },
  { id: 'facebook-ads', name: 'Facebook Ads', type: 'ads', connected: false },
  { id: 'google-ads', name: 'Google Ads', type: 'ads', connected: false },
  { id: 'youtube', name: 'YouTube', type: 'ads', connected: false },
  { id: 'tiktok', name: 'TikTok Ads', type: 'ads', connected: false },
  { id: 'linkedin', name: 'LinkedIn', type: 'ads', connected: false },
  { id: 'hubspot', name: 'HubSpot CRM', type: 'crm', connected: false },
  { id: 'salesforce', name: 'Salesforce', type: 'crm', connected: false },
  { id: 'zapier', name: 'Zapier', type: 'automation', connected: false },
  { id: 'make', name: 'Make (Integromat)', type: 'automation', connected: false },
  { id: 'n8n', name: 'n8n', type: 'automation', connected: false },
];

export const defaultTrainingConfig: TrainingConfig = {
  objective: 'Ventas',
  leadCategory: 'Todos',
  channel: 'Webchat',
  autoEscalate: true,
  scheduleEnabled: false,
  sentimentAnalysis: true,
  productRecommendations: false,
  customPrompt: '',
  integrations: defaultIntegrations,
};
