'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Assistant, ChatMessage, ChatAttachment, FileType, FileAnalysis } from '@/types/assistant';
import { getRandomResponse } from '@/data/initialData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  RotateCcw,
  Bot,
  User,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Paperclip,
  X,
  FileText,
  FileSpreadsheet,
  FileVideo,
  Image as ImageIcon,
  File,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSimulatorProps {
  assistant: Assistant;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  'video/*': ['.mp4', '.webm', '.mov', '.avi'],
  'application/pdf': ['.pdf'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
};

function getFileType(mimeType: string): FileType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') return 'excel';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'word';
  if (mimeType.startsWith('text/')) return 'text';
  return 'other';
}

function getFileIcon(type: FileType) {
  switch (type) {
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    case 'video':
      return <FileVideo className="w-4 h-4" />;
    case 'pdf':
      return <FileText className="w-4 h-4 text-red-400" />;
    case 'excel':
      return <FileSpreadsheet className="w-4 h-4 text-green-400" />;
    case 'word':
      return <FileText className="w-4 h-4 text-blue-400" />;
    default:
      return <File className="w-4 h-4" />;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function ChatSimulator({ assistant }: ChatSimulatorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(assistant.audioEnabled);
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionAnalyses, setSessionAnalyses] = useState<FileAnalysis[]>([]);
  const [contextSaved, setContextSaved] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceModeRef = useRef(false);
  const isTypingRef = useRef(false);
  const isSpeakingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Refs para estado actualizado en callbacks
  useEffect(() => {
    voiceModeRef.current = voiceModeActive;
  }, [voiceModeActive]);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Ref para audioEnabled
  const audioEnabledRef = useRef(audioEnabled);
  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  // Hablar y continuar escuchando
  const speakTextAndContinue = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap: Record<string, string> = {
      Español: 'es-ES',
      Inglés: 'en-US',
      Portugués: 'pt-BR',
    };
    utterance.lang = langMap[assistant.language] || 'es-ES';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // Reiniciar escucha después de que el asistente termine de hablar
      if (voiceModeRef.current && recognitionRef.current) {
        setTimeout(() => {
          if (voiceModeRef.current && !isTypingRef.current) {
            try {
              recognitionRef.current?.start();
              setIsListening(true);
            } catch (e) {
              console.log('Recognition restart failed');
            }
          }
        }, 300);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [assistant.language]);

  // Inicializar reconocimiento de voz - solo una vez
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Verificar permisos de micrófono
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
        setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
        result.onchange = () => {
          setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
        };
      }).catch(() => {
        setMicPermission('unknown');
      });
    }
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    const langMap: Record<string, string> = {
      Español: 'es-ES',
      Inglés: 'en-US',
      Portugués: 'pt-BR',
    };
    recognition.lang = langMap[assistant.language] || 'es-ES';

    recognition.onstart = () => {
      console.log('🎤 Recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('🎤 Recognition result:', event.results);
      
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      // Mostrar transcripción intermedia
      if (interimText) {
        console.log('🎤 Interim:', interimText);
        setInterimTranscript(interimText);
      }

      // Procesar texto final
      if (finalText && finalText.trim()) {
        console.log('🎤 Final:', finalText);
        setInterimTranscript('');
        
        // Crear y enviar mensaje
        const userMessage: ChatMessage = {
          id: `msg-${Date.now()}-user`,
          role: 'user',
          content: finalText.trim(),
          timestamp: new Date(),
          isAudio: true,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        // Generar respuesta del asistente
        setTimeout(async () => {
          const delay = 1000 + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));

          const objective = assistant.trainingConfig?.objective;
          const response = getRandomResponse(assistant.language, objective);

          const assistantMessage: ChatMessage = {
            id: `msg-${Date.now()}-assistant`,
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setIsTyping(false);

          // Hablar la respuesta
          if (audioEnabledRef.current) {
            speakTextAndContinue(response);
          } else if (voiceModeRef.current) {
            // Reiniciar escucha si no hay audio
            setTimeout(() => {
              if (voiceModeRef.current && recognition) {
                try {
                  recognition.start();
                } catch (e) {
                  console.log('Recognition already started');
                }
              }
            }, 500);
          }
        }, 0);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('🎤 Recognition error:', event.error);
      
      if (event.error === 'not-allowed') {
        setMicPermission('denied');
        setVoiceModeActive(false);
        setIsListening(false);
        alert('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono en la configuración del navegador.');
        return;
      }
      
      // No detener en errores de "no-speech" o "aborted"
      if (event.error === 'no-speech') {
        // Reiniciar si el modo voz sigue activo
        if (voiceModeRef.current && !isSpeakingRef.current && !isTypingRef.current) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Restart after no-speech failed');
            }
          }, 100);
        }
      } else if (event.error !== 'aborted') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      console.log('🎤 Recognition ended');
      setIsListening(false);
      
      // Reiniciar automáticamente si el modo voz sigue activo
      if (voiceModeRef.current && !isSpeakingRef.current && !isTypingRef.current) {
        setTimeout(() => {
          if (voiceModeRef.current) {
            try {
              recognition.start();
              console.log('🎤 Recognition restarted');
            } catch (e) {
              console.log('Recognition restart on end failed');
            }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      window.speechSynthesis?.cancel();
    };
  }, [assistant.language, assistant.trainingConfig?.objective, speakTextAndContinue]);

  const speakText = (text: string) => {
    if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    speakTextAndContinue(text);
  };

  const toggleVoiceMode = async () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    if (voiceModeActive) {
      // Desactivar modo voz
      setVoiceModeActive(false);
      recognitionRef.current.abort();
      setIsListening(false);
      setInterimTranscript('');
      window.speechSynthesis?.cancel();
    } else {
      // Solicitar permiso de micrófono primero
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Detener el stream inmediatamente, solo lo usamos para pedir permiso
        stream.getTracks().forEach(track => track.stop());
        setMicPermission('granted');
        
        // Activar modo voz
        setVoiceModeActive(true);
        setAudioEnabled(true); // Activar audio automáticamente
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch {
          setIsListening(false);
        }
      } catch (err) {
        console.error('Error al acceder al micrófono:', err);
        setMicPermission('denied');
        alert('No se pudo acceder al micrófono. Por favor, permite el acceso en la configuración del navegador.');
      }
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: ChatAttachment[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`El archivo "${file.name}" excede el límite de 10MB`);
        return;
      }

      const attachment: ChatAttachment = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: getFileType(file.type),
        size: file.size,
        url: URL.createObjectURL(file),
        mimeType: file.type,
      };

      newAttachments.push(attachment);
    });

    setPendingAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  // Generar análisis simulado de archivo
  const generateFileAnalysis = useCallback((attachment: ChatAttachment): FileAnalysis => {
    const summaries: Record<FileType, string[]> = {
      pdf: [
        'Documento PDF con información estructurada sobre productos y servicios.',
        'Contrato o acuerdo legal con términos y condiciones detallados.',
        'Informe técnico con datos estadísticos y gráficos.',
        'Manual de usuario con instrucciones paso a paso.',
      ],
      excel: [
        'Hoja de cálculo con datos financieros y proyecciones.',
        'Base de datos de clientes con información de contacto.',
        'Inventario de productos con precios y cantidades.',
        'Reporte de ventas con métricas de rendimiento.',
      ],
      word: [
        'Documento de texto con propuesta comercial.',
        'Informe ejecutivo con resumen de actividades.',
        'Plantilla de contrato personalizable.',
        'Documentación de procesos internos.',
      ],
      image: [
        'Imagen con contenido visual relevante para el contexto.',
        'Captura de pantalla con información importante.',
        'Fotografía de producto o servicio.',
        'Diagrama o infografía explicativa.',
      ],
      video: [
        'Video explicativo con demostración de producto.',
        'Grabación de reunión o presentación.',
        'Tutorial paso a paso.',
        'Contenido promocional o publicitario.',
      ],
      text: [
        'Archivo de texto con notas o instrucciones.',
        'Código fuente o configuración.',
        'Lista de elementos o tareas.',
        'Transcripción de conversación.',
      ],
      other: [
        'Archivo con contenido relevante para análisis.',
      ],
    };

    const keyPointsPool = [
      'Información de contacto identificada',
      'Datos numéricos relevantes encontrados',
      'Referencias a productos/servicios',
      'Fechas importantes detectadas',
      'Términos clave del negocio',
      'Métricas de rendimiento',
      'Requisitos específicos mencionados',
      'Oportunidades de mejora identificadas',
    ];

    const entitiesPool = [
      { type: 'Empresa', value: 'Cliente Corp' },
      { type: 'Persona', value: 'Juan Pérez' },
      { type: 'Email', value: 'contacto@ejemplo.com' },
      { type: 'Teléfono', value: '+1 234 567 890' },
      { type: 'Fecha', value: new Date().toLocaleDateString() },
      { type: 'Monto', value: '$1,500.00' },
      { type: 'Producto', value: 'Servicio Premium' },
    ];

    const typeSummaries = summaries[attachment.type] || summaries.other;
    const randomKeyPoints = keyPointsPool.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3));
    const randomEntities = entitiesPool.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 3));

    return {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fileId: attachment.id,
      fileName: attachment.name,
      fileType: attachment.type,
      analyzedAt: new Date(),
      summary: typeSummaries[Math.floor(Math.random() * typeSummaries.length)],
      keyPoints: randomKeyPoints,
      entities: randomEntities,
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
      language: assistant.language,
      wordCount: attachment.type === 'image' || attachment.type === 'video' ? undefined : Math.floor(Math.random() * 5000) + 500,
      pageCount: attachment.type === 'pdf' || attachment.type === 'word' ? Math.floor(Math.random() * 20) + 1 : undefined,
      duration: attachment.type === 'video' ? `${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : undefined,
    };
  }, [assistant.language]);

  // Guardar contexto de conversación
  const saveContext = useCallback(() => {
    if (messages.length === 0) return;
    
    const saveConversationContext = (window as unknown as { saveConversationContext?: (messages: ChatMessage[], analyses: FileAnalysis[]) => void }).saveConversationContext;
    if (saveConversationContext) {
      saveConversationContext(messages, sessionAnalyses);
      setContextSaved(true);
      setTimeout(() => setContextSaved(false), 2000);
    }
  }, [messages, sessionAnalyses]);

  const generateResponse = async (hasAttachments: boolean, attachments: ChatAttachment[]) => {
    setIsTyping(true);

    if (hasAttachments) {
      setIsAnalyzing(true);
      // Simular análisis de archivos
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1500));
      
      // Generar análisis para cada archivo
      const newAnalyses: FileAnalysis[] = [];
      for (const attachment of attachments) {
        const analysis = generateFileAnalysis(attachment);
        newAnalyses.push(analysis);
        
        // Guardar en el sistema de análisis global
        const addFileAnalysis = (window as unknown as { addFileAnalysis?: (analysis: FileAnalysis) => void }).addFileAnalysis;
        if (addFileAnalysis) {
          addFileAnalysis(analysis);
        }
      }
      setSessionAnalyses(prev => [...prev, ...newAnalyses]);
      setIsAnalyzing(false);
    }

    const delay = 1000 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const objective = assistant.trainingConfig?.objective;
    let response = getRandomResponse(assistant.language, objective);

    // Agregar contexto si hay archivos
    if (hasAttachments) {
      const fileResponses: Record<string, string[]> = {
        Español: [
          'He analizado los archivos que compartiste. Basándome en el contenido, puedo ver información relevante para tu consulta.',
          'Gracias por compartir estos documentos. Después de revisarlos, tengo algunas observaciones importantes.',
          'He procesado los archivos adjuntos. Aquí está mi análisis detallado basado en la información proporcionada.',
          'Excelente, los documentos me ayudan a entender mejor tu situación. Permíteme darte una respuesta más precisa.',
        ],
        Inglés: [
          "I've analyzed the files you shared. Based on the content, I can see relevant information for your query.",
          'Thank you for sharing these documents. After reviewing them, I have some important observations.',
          "I've processed the attached files. Here is my detailed analysis based on the provided information.",
          'Excellent, the documents help me better understand your situation. Let me give you a more precise answer.',
        ],
        Portugués: [
          'Analisei os arquivos que você compartilhou. Com base no conteúdo, posso ver informações relevantes para sua consulta.',
          'Obrigado por compartilhar esses documentos. Após revisá-los, tenho algumas observações importantes.',
          'Processei os arquivos anexados. Aqui está minha análise detalhada com base nas informações fornecidas.',
          'Excelente, os documentos me ajudam a entender melhor sua situação. Deixe-me dar uma resposta mais precisa.',
        ],
      };

      const langResponses = fileResponses[assistant.language] || fileResponses['Español'];
      response = langResponses[Math.floor(Math.random() * langResponses.length)] + ' ' + response;
    }

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);

    if (audioEnabled) {
      speakText(response);
    }
  };

  const handleSend = () => {
    const trimmedValue = inputValue.trim();
    const hasContent = trimmedValue || pendingAttachments.length > 0;
    if (!hasContent || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: trimmedValue || (pendingAttachments.length > 0 ? '📎 Archivos adjuntos' : ''),
      timestamp: new Date(),
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    const hadAttachments = pendingAttachments.length > 0;
    const attachmentsCopy = [...pendingAttachments];
    setPendingAttachments([]);
    generateResponse(hadAttachments, attachmentsCopy);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    // Guardar contexto antes de limpiar si hay mensajes
    if (messages.length > 0) {
      saveContext();
    }
    
    // Desactivar modo voz
    setVoiceModeActive(false);
    recognitionRef.current?.abort();
    setIsListening(false);
    setInterimTranscript('');
    
    // Limpiar URLs de archivos
    pendingAttachments.forEach((a) => URL.revokeObjectURL(a.url));
    messages.forEach((m) => m.attachments?.forEach((a) => URL.revokeObjectURL(a.url)));

    setMessages([]);
    setInputValue('');
    setPendingAttachments([]);
    setSessionAnalyses([]);
    setIsTyping(false);
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    inputRef.current?.focus();
  };

  const supportsVoice =
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const acceptedTypes = Object.entries(ACCEPTED_FILE_TYPES)
    .map(([mime, exts]) => [mime, ...exts].join(','))
    .join(',');

  return (
    <div className="bg-card/80 backdrop-blur-xl flex flex-col h-[500px] rounded-xl">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center',
              isSpeaking && 'animate-pulse'
            )}
          >
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{assistant.name}</h4>
            <p className="text-xs text-muted-foreground">
              {assistant.language} • {assistant.tone}
              {assistant.trainingConfig?.objective && ` • ${assistant.trainingConfig.objective}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Desactivar audio' : 'Activar audio'}
            className={audioEnabled ? 'text-primary' : 'text-muted-foreground'}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={saveContext}
              title="Guardar contexto"
              className={contextSaved ? 'text-green-400' : 'text-muted-foreground'}
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={handleReset} title="Reiniciar conversación">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">Envía un mensaje para comenzar la conversación</p>
            <p className="text-xs text-muted-foreground mt-2">
              📎 Puedes adjuntar documentos, imágenes, videos, PDF o Excel
            </p>
            {supportsVoice && <p className="text-xs text-muted-foreground mt-1">🎤 Activa el modo voz para conversar fluidamente</p>}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex gap-3 animate-slide-up', message.role === 'user' ? 'flex-row-reverse' : '')}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn('max-w-[75%] space-y-2')}>
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="bg-secondary/80 rounded-lg p-2 flex items-center gap-2 text-xs"
                      >
                        {attachment.type === 'image' ? (
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : attachment.type === 'video' ? (
                          <video src={attachment.url} className="w-20 h-16 object-cover rounded" />
                        ) : (
                          <>
                            {getFileIcon(attachment.type)}
                            <div className="flex flex-col">
                              <span className="text-foreground truncate max-w-[120px]">{attachment.name}</span>
                              <span className="text-muted-foreground">{formatFileSize(attachment.size)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* Message content */}
                {message.content && (
                  <div
                    className={cn(
                      'px-4 py-2.5 text-sm',
                      message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
                    )}
                  >
                    {message.content}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div className="chat-bubble-assistant px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground text-sm">
                {isAnalyzing ? 'Analizando archivos...' : 'Escribiendo...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Pending attachments preview */}
      {pendingAttachments.length > 0 && (
        <div className="px-4 py-2 border-t border-border/50 bg-secondary/30">
          <div className="flex flex-wrap gap-2">
            {pendingAttachments.map((attachment) => (
              <div
                key={attachment.id}
                className="bg-secondary rounded-lg p-2 flex items-center gap-2 text-xs group relative"
              >
                {attachment.type === 'image' ? (
                  <img src={attachment.url} alt={attachment.name} className="w-10 h-10 object-cover rounded" />
                ) : (
                  <>
                    {getFileIcon(attachment.type)}
                    <span className="text-foreground truncate max-w-[100px]">{attachment.name}</span>
                  </>
                )}
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          {/* File upload button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isTyping}
            size="icon"
            variant="outline"
            title="Adjuntar archivo (PDF, Excel, Video, Imagen)"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {supportsVoice && (
            <Button
              onClick={toggleVoiceMode}
              disabled={isTyping || micPermission === 'denied'}
              size="icon"
              variant={voiceModeActive ? 'default' : 'outline'}
              className={cn(
                voiceModeActive && 'bg-green-500 hover:bg-green-600',
                isListening && voiceModeActive && 'animate-pulse ring-2 ring-green-400 ring-offset-2 ring-offset-background',
                micPermission === 'denied' && 'opacity-50 cursor-not-allowed'
              )}
              title={
                micPermission === 'denied' 
                  ? 'Permiso de micrófono denegado' 
                  : voiceModeActive 
                    ? 'Desactivar modo conversación' 
                    : 'Activar modo conversación por voz'
              }
            >
              {micPermission === 'denied' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Input
            ref={inputRef}
            value={interimTranscript || inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              voiceModeActive 
                ? (isListening ? '🎤 Escuchando... habla ahora' : isSpeaking ? '🔊 Asistente hablando...' : 'Modo voz activo')
                : 'Escribe un mensaje...'
            }
            disabled={isTyping || voiceModeActive}
            className={cn('flex-1', voiceModeActive && 'bg-green-500/10 border-green-500/30')}
          />
          <Button
            onClick={handleSend}
            disabled={(!inputValue.trim() && pendingAttachments.length === 0) || isTyping}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {voiceModeActive ? (
            <span className="text-green-400">🎤 Modo conversación activo - Habla y el asistente responderá</span>
          ) : (
            'Formatos: PDF, Excel, Word, Imágenes, Videos (máx. 10MB)'
          )}
        </p>
      </div>
    </div>
  );
}

// Declaración de tipos para Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
