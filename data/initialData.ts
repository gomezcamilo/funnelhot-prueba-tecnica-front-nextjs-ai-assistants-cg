import { Assistant, defaultTrainingConfig } from '@/types/assistant';

export const initialAssistants: Assistant[] = [
  {
    id: 'assistant-1',
    name: 'Asistente de Ventas',
    language: 'Español',
    tone: 'Profesional',
    responseLength: { short: 30, medium: 50, long: 20 },
    audioEnabled: true,
    rules: 'Responde siempre de manera profesional y enfocada en ayudar al cliente a encontrar el producto ideal.',
    trainingConfig: {
      ...defaultTrainingConfig,
      objective: 'Ventas',
      leadCategory: 'Hot',
      productRecommendations: true,
    },
  },
  {
    id: 'assistant-2',
    name: 'Soporte Técnico Bot',
    language: 'Inglés',
    tone: 'Formal',
    responseLength: { short: 20, medium: 40, long: 40 },
    audioEnabled: false,
    rules: 'Provide detailed technical support. Always ask for error codes and system information.',
    trainingConfig: {
      ...defaultTrainingConfig,
      objective: 'Soporte',
      leadCategory: 'Todos',
      sentimentAnalysis: true,
      autoEscalate: true,
    },
  },
];

export const simulatedResponses: Record<string, Record<string, string[]>> = {
  Español: {
    Ventas: [
      '¡Hola! Estoy aquí para ayudarte a encontrar el producto perfecto. ¿Qué estás buscando hoy?',
      'Excelente elección. Este producto tiene un 20% de descuento esta semana. ¿Te gustaría conocer más detalles?',
      'Basándome en tus preferencias, te recomiendo nuestro plan Premium. Incluye todas las funcionalidades que necesitas.',
      'Entiendo tu presupuesto. Tenemos opciones flexibles de pago. ¿Te gustaría que te explique las alternativas?',
      'Muchos clientes como tú han elegido esta solución y están muy satisfechos. ¿Quieres que te cuente sus experiencias?',
      '¡Perfecto! Puedo agendar una demostración personalizada para ti. ¿Qué horario te conviene mejor?',
      'Este producto resuelve exactamente el problema que mencionas. ¿Te gustaría probarlo gratis por 14 días?',
    ],
    Soporte: [
      'Entiendo tu problema. Vamos a resolverlo juntos. ¿Podrías darme más detalles sobre el error?',
      'He identificado el problema. Te guiaré paso a paso para solucionarlo.',
      'Gracias por tu paciencia. He escalado tu caso a un especialista que te contactará en breve.',
      'El problema que describes es común y tiene una solución rápida. Sigue estos pasos...',
      'He revisado tu cuenta y todo parece estar en orden. ¿Podrías intentar cerrar sesión y volver a entrar?',
      'Lamento los inconvenientes. Estoy generando un ticket de soporte prioritario para ti.',
    ],
    Marketing: [
      '¡Tenemos una promoción especial para ti! 30% de descuento en tu primera compra.',
      '¿Sabías que nuestros clientes ahorran en promedio un 40% con nuestras soluciones?',
      'Te invito a nuestro webinar gratuito donde aprenderás estrategias exclusivas.',
      'Basándome en tu perfil, creo que te interesaría conocer nuestra nueva línea de productos.',
      '¡Únete a nuestra comunidad! Miles de profesionales ya están aprovechando nuestros recursos.',
    ],
    Automatización: [
      'Puedo ayudarte a automatizar ese proceso. ¿Cuántas veces al día realizas esta tarea?',
      'He configurado una automatización que te ahorrará 5 horas semanales.',
      'Tu flujo de trabajo está optimizado. Recibirás notificaciones automáticas cuando haya actualizaciones.',
      'La integración está lista. Ahora tus datos se sincronizarán automáticamente.',
      'He detectado un patrón en tus tareas. ¿Te gustaría que lo automatice?',
    ],
    'Captación de Leads': [
      '¡Bienvenido! Me encantaría conocer más sobre tu negocio. ¿A qué te dedicas?',
      'Interesante. ¿Cuál es el principal desafío que enfrentas actualmente?',
      'Tenemos soluciones específicas para tu industria. ¿Te gustaría una consulta gratuita?',
      '¿Cuál es el tamaño de tu equipo? Así puedo recomendarte el plan más adecuado.',
      'Déjame tu email y te enviaré información personalizada sobre cómo podemos ayudarte.',
    ],
    default: [
      '¡Hola! Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?',
      'Entiendo tu consulta. Déjame analizar la mejor solución para ti.',
      'Excelente pregunta. Basándome en mi entrenamiento, te recomendaría...',
      'Gracias por tu paciencia. He procesado tu solicitud correctamente.',
      'Eso es muy interesante. ¿Podrías darme más detalles al respecto?',
      'Perfecto, he tomado nota de tu requerimiento. ¿Hay algo más en lo que pueda ayudarte?',
    ],
  },
  Inglés: {
    Ventas: [
      "Hi! I'm here to help you find the perfect product. What are you looking for today?",
      "Great choice! This product has a 20% discount this week. Would you like more details?",
      "Based on your preferences, I recommend our Premium plan. It includes all the features you need.",
      "I understand your budget. We have flexible payment options. Would you like me to explain?",
      "Many customers like you have chosen this solution and are very satisfied. Want to hear their experiences?",
    ],
    Soporte: [
      "I understand your issue. Let's solve it together. Could you give me more details about the error?",
      "I've identified the problem. I'll guide you step by step to fix it.",
      "Thank you for your patience. I've escalated your case to a specialist who will contact you shortly.",
      "The issue you describe is common and has a quick solution. Follow these steps...",
    ],
    default: [
      "Hello! I'm here to help you. How can I assist you today?",
      "I understand your query. Let me analyze the best solution for you.",
      "Great question. Based on my training, I would recommend...",
      "Thank you for your patience. I have processed your request successfully.",
      "That is very interesting. Could you provide more details about it?",
    ],
  },
  Portugués: {
    Ventas: [
      'Olá! Estou aqui para ajudá-lo a encontrar o produto perfeito. O que você está procurando hoje?',
      'Ótima escolha! Este produto tem 20% de desconto esta semana. Gostaria de mais detalhes?',
      'Com base nas suas preferências, recomendo nosso plano Premium.',
    ],
    default: [
      'Olá! Estou aqui para ajudá-lo. Como posso ajudá-lo hoje?',
      'Entendo sua consulta. Deixe-me analisar a melhor solução para você.',
      'Ótima pergunta. Com base no meu treinamento, eu recomendaria...',
      'Obrigado pela sua paciência. Processei sua solicitação com sucesso.',
      'Isso é muito interessante. Você poderia fornecer mais detalhes sobre isso?',
    ],
  },
};

export const getRandomResponse = (language: string, objective?: string): string => {
  const langResponses = simulatedResponses[language] || simulatedResponses['Español'];
  const objectiveResponses = objective && langResponses[objective] 
    ? langResponses[objective] 
    : langResponses['default'] || langResponses[Object.keys(langResponses)[0]];
  
  return objectiveResponses[Math.floor(Math.random() * objectiveResponses.length)];
};
