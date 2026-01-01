# 🤖 AI Assistants - Módulo de Gestión de Asistentes IA

Sistema completo de gestión de asistentes de IA para automatizar interacciones con leads, desarrollado con Next.js 14 y App Router.

## 📋 Descripción

Aplicación web responsive que permite crear, listar, editar, eliminar y entrenar asistentes de IA con persistencia local de datos. Diseñada para Funnelhot como solución de automatización de interacciones con clientes.

## 🚀 Instalación y Ejecución

```bash

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción 
npm run build

# Ejecutar en producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + CSS personalizado
- **Componentes UI**: Radix UI (primitivos accesibles)
- **Iconos**: Lucide React
- **Persistencia**: LocalStorage
- **Fuentes**: Inter + Space Grotesk (Google Fonts)
- **PWA**: Progressive Web App (instalable en dispositivos)

## 📁 Estructura del Proyecto

```
nextjs-ai-assistants/
├── app/
│   ├── [id]/
│   │   └── page.tsx          # Página de entrenamiento
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   ├── not-found.tsx         # Página 404
│   └── page.tsx              # Página principal (listado)
├── components/
│   ├── ui/                   # Componentes UI reutilizables
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── neon-border.tsx   # Efecto de borde animado
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   └── textarea.tsx
│   ├── AlertModal.tsx        # Modal de alertas
│   ├── AssistantCard.tsx     # Tarjeta de asistente
│   ├── AssistantModal.tsx    # Modal crear/editar (2 pasos)
│   ├── ChatSimulator.tsx     # Simulador de chat
│   ├── CollaboratorsTab.tsx  # Pestaña de colaboradores
│   ├── EmptyState.tsx        # Estado vacío
│   ├── Footer.tsx            # Footer con marquee
│   ├── Header.tsx            # Cabecera
│   ├── IntegrationModal.tsx  # Modal de integraciones
│   ├── LandingHero.tsx       # Landing page
│   ├── ParticlesBackground.tsx # Fondo animado
│   └── TrainingSection.tsx   # Sección de entrenamiento
├── data/
│   └── initialData.ts        # Datos iniciales y respuestas
├── hooks/
│   ├── use-toast.ts          # Hook de notificaciones
│   ├── useAssistants.ts      # Hook principal de asistentes
│   └── useLocalStorage.ts    # Hook de persistencia
├── lib/
│   └── utils.ts              # Utilidades (cn, etc.)
└── types/
    └── assistant.ts          # Tipos TypeScript
```

## ✅ Funcionalidades Implementadas

### Requerimientos Base Cumplidos

#### 1. Página Principal (Listado de Asistentes) - Ruta: `/`
- ✅ Listado de asistentes en formato de tarjetas
- ✅ Cada tarjeta muestra: nombre, idioma, tono/personalidad
- ✅ Menú de acciones (Editar, Eliminar, Entrenar)
- ✅ Botón "Crear Asistente" con efecto de borde animado
- ✅ Estado vacío cuando no hay asistentes

#### 2. Modal de Creación/Edición (2 pasos)
- ✅ **Paso 1 - Datos Básicos**:
  - Nombre del asistente (requerido, mínimo 3 caracteres)
  - Idioma (Español, Inglés, Portugués)
  - Tono (Formal, Casual, Profesional, Amigable)
- ✅ **Paso 2 - Configuración de Respuestas**:
  - Longitud de respuestas (Cortas, Medias, Largas con porcentajes)
  - Validación: suma debe ser 100%
  - Habilitar respuestas de audio (checkbox)
- ✅ Indicador visual del paso actual
- ✅ Validaciones en tiempo real
- ✅ Botones "Atrás" y "Guardar"

#### 3. Página de Entrenamiento - Ruta: `/{id}`
- ✅ Información del asistente en la parte superior
- ✅ Sección de entrenamiento con área de texto para prompts
- ✅ Botón "Guardar" con mensaje de éxito
- ✅ Persistencia en localStorage
- ✅ Chat simulado con interfaz completa
- ✅ Respuestas simuladas con delay 1-2 segundos
- ✅ Botón para reiniciar conversación
- ✅ **Subida de archivos** (PDF, Excel, Word, imágenes, videos)
- ✅ **Análisis de documentos** con respuestas contextualizadas
- ✅ **Vista previa** de archivos adjuntos en el chat

#### 4. Funcionalidad de Eliminación
- ✅ Confirmación antes de eliminar
- ✅ Mensaje de éxito tras eliminar
- ✅ Actualización inmediata de la lista

### Mejoras Adicionales Implementadas

#### 🎨 Diseño y UX
- **Tema oscuro moderno**: Paleta de colores profesional con acentos cyan y violeta
- **Glassmorphism**: Efectos de cristal en tarjetas y modales
- **Animaciones suaves**: Transiciones y efectos de entrada
- **Fondo de partículas**: Animación de partículas flotantes tipo universo
- **Bordes neón animados**: Efecto de gradiente rotativo en botones y chat
- **Responsive completo**: Diseño adaptativo para móvil, tablet y desktop

#### 🎤 Modo Conversación por Voz
- **Conversación fluida**: Activa el modo voz y habla naturalmente con el asistente
- **Transcripción en tiempo real**: Ve lo que dices mientras hablas
- **Envío automático**: Los mensajes se envían automáticamente al terminar de hablar
- **Respuesta hablada**: El asistente responde con voz (síntesis de voz)
- **Ciclo continuo**: Después de que el asistente habla, vuelve a escucharte
- **Indicadores visuales**:
  - Botón verde cuando el modo voz está activo
  - Animación de pulso cuando está escuchando
  - Placeholder dinámico mostrando el estado actual
- **Soporte multiidioma**: Español, Inglés, Portugués
- **Control manual**: Puedes desactivar el modo en cualquier momento

#### 📎 Sistema de Archivos Adjuntos
- **Tipos soportados**:
  - Imágenes: JPG, PNG, GIF, WebP
  - Videos: MP4, WebM, MOV, AVI
  - Documentos: PDF, Word (DOC, DOCX)
  - Hojas de cálculo: Excel (XLS, XLSX), CSV
  - Texto plano: TXT
- **Características**:
  - Vista previa de imágenes y videos
  - Iconos específicos por tipo de archivo
  - Indicador de tamaño de archivo
  - Límite de 10MB por archivo
  - Múltiples archivos simultáneos
  - Análisis simulado de contenido
  - Respuestas contextualizadas según archivos adjuntos
- **UX mejorada**:
  - Botón de adjuntar con icono de clip
  - Preview de archivos pendientes antes de enviar
  - Eliminación individual de archivos
  - Indicador "Analizando archivos..." durante procesamiento

#### 🔍 Sistema de Análisis de Archivos (Pestaña "Análisis")
- **Análisis automático** de cada archivo subido al chat
- **Información extraída**:
  - Resumen del contenido
  - Puntos clave identificados
  - Entidades detectadas (empresas, personas, emails, fechas, montos)
  - Análisis de sentimiento (positivo/neutral/negativo)
  - Conteo de palabras y páginas (documentos)
  - Duración (videos)
- **Gestión de análisis**:
  - Lista de todos los archivos analizados
  - Vista expandible con detalles completos
  - Eliminación individual o masiva
  - Persistencia en localStorage

#### 📚 Sistema de Contexto de Conversaciones (Pestaña "Contexto")
- **Guardado automático** de conversaciones al reiniciar chat
- **Guardado manual** con botón de guardar en el chat
- **Información almacenada**:
  - Historial completo de mensajes
  - Archivos analizados en la sesión
  - Temas detectados automáticamente
  - Análisis de sentimiento de la conversación
  - Lead Score calculado (0-100%)
- **Gestión de contextos**:
  - Lista de conversaciones guardadas
  - Vista previa de mensajes
  - Archivos asociados
  - Eliminación individual o masiva
  - Persistencia en localStorage

#### 👥 Sistema de Colaboradores (Pestaña "Colaboradores")
- **Invitación por email**: Campo para agregar colaboradores por correo electrónico
- **Roles disponibles**:
  - Administrador: Control total del asistente
  - Editor: Puede modificar configuración y entrenar
  - Visualizador: Solo puede ver información
- **Código QR de invitación**:
  - Generación automática de QR
  - Descarga del QR en formato PNG
  - Copiar URL de invitación al portapapeles
- **Lista de colaboradores**:
  - Nombre y email del colaborador
  - Rol asignado con badge de color
  - Estado (pendiente/activo)
  - Opción de eliminar colaborador
- **Nota**: Funcionalidad completa requiere sistema de autenticación (simulado localmente)

#### 🏠 Landing Page
- **Hero section** con diseño split (contenido + imagen)
- **Imagen de marca** destacada con glow effect
- **Estadísticas**: 24/7 disponibilidad, +300% conversiones, 5min configuración
- **Features cards**: Asistentes IA, Automatización, Conversiones
- **Responsive**: Adaptado para móvil y desktop
- **Persistencia**: Se muestra solo en primera visita

#### 📱 Progressive Web App (PWA)
- **Instalable**: La aplicación puede instalarse en dispositivos móviles y desktop
- **Standalone**: Se ejecuta como aplicación nativa sin barra de navegador
- **Iconos optimizados**: Iconos para iOS y Android (192x192, 512x512)
- **Theme color**: Integración con el tema oscuro del sistema
- **Apple Web App**: Soporte completo para dispositivos iOS

#### 🔍 Buscador de Asistentes
- **Input de búsqueda** en el dashboard
- **Filtrado en tiempo real** por nombre de asistente
- **Mensaje** cuando no hay resultados

#### 📝 Footer
- **Texto deslizante** (marquee) con tipografía monospace
- **Información**: "Prueba Técnica — Módulo de Gestión de Asistentes IA — Desarrollado por Camilo Gomez Roman"
- **Link a LinkedIn** en el texto deslizante
- **Logo Molocorp** centrado con link a LinkedIn

#### 📊 Sistema de Entrenamiento Avanzado
- **Objetivos de asistente**: Ventas, Soporte, Marketing, Calificación, Agendamiento
- **Categorías de leads**: Frío, Tibio, Caliente, Calificado
- **Canales de comunicación**: WhatsApp, Messenger, Instagram, Telegram, Email, Web Chat, SMS, Llamadas
- **Flujos de automatización**: Visualización dinámica de workflows según objetivo
- **Integraciones**: Sistema completo con 15+ servicios

#### 🔗 Sistema de Integraciones
Categorías de integraciones disponibles:
- **Mensajería**: WhatsApp Business, Messenger, Instagram, Telegram
- **Publicidad**: Facebook Ads, Google Ads, TikTok Ads, LinkedIn Ads
- **CRM**: HubSpot, Salesforce, Pipedrive, Zoho
- **Automatización**: Zapier, Make, n8n
- **Video**: YouTube, TikTok

Cada integración incluye:
- Modal de configuración con API Key
- Estado de conexión (conectado/desconectado)
- Validación de credenciales

#### 🔔 Sistema de Alertas
- **AlertModal**: Reemplazo de toasts por modales elegantes
- Estados: éxito (verde) y error (rojo)
- Botón de continuar con navegación opcional
- Animaciones de entrada/salida

## 🎯 Decisiones Técnicas

### ¿Por qué Next.js 14 con App Router?
- **Server Components**: Mejor rendimiento inicial
- **Routing basado en archivos**: Estructura clara y escalable
- **Layouts anidados**: Reutilización de UI
- **Metadata API**: SEO optimizado

### ¿Por qué Tailwind CSS?
- **Desarrollo rápido**: Clases utilitarias
- **Consistencia**: Sistema de diseño integrado
- **Personalización**: Tema extendido con variables CSS
- **Responsive**: Breakpoints predefinidos

### ¿Por qué Radix UI?
- **Accesibilidad**: Componentes ARIA compliant
- **Sin estilos**: Control total del diseño
- **Composición**: Primitivos flexibles
- **Mantenimiento**: Librería bien mantenida

### ¿Por qué LocalStorage?
- **Simplicidad**: Sin backend requerido
- **Persistencia**: Datos sobreviven recargas
- **Privacidad**: Datos en el cliente
- **Demostración**: Ideal para pruebas

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
--background: 222 47% 6%      /* Fondo oscuro */
--foreground: 210 40% 98%     /* Texto claro */
--primary: 187 85% 53%        /* Cyan principal */
--accent: 262 83% 58%         /* Violeta acento */
--success: 142 71% 45%        /* Verde éxito */
--destructive: 0 72% 51%      /* Rojo error */
```

### Tipografía
- **Display**: Space Grotesk (títulos)
- **Body**: Inter (texto general)

### Efectos Visuales
- **Glassmorphism**: `backdrop-blur-xl` + transparencia
- **Glow**: Sombras con color primario
- **Neon Border**: Gradiente cónico rotativo
- **Partículas**: Canvas animado con movimiento ascendente

## 📱 Responsive Design

| Breakpoint | Descripción |
|------------|-------------|
| < 640px    | Móvil - Layout vertical, menús colapsados |
| 640-768px  | Tablet - Grid 2 columnas |
| 768-1024px | Tablet grande - Ajustes de espaciado |
| > 1024px   | Desktop - Layout completo 2-3 columnas |

## ⏱️ Tiempo de Desarrollo

- **Analisis inicial**: ~4 horas
- **Funcionalidades base**: ~6 horas
- **Mejoras de UX/UI**: ~4 horas
- **Sistema de integraciones**: ~3 horas
- **Efectos visuales**: ~2 horas
- **Testing y ajustes**: ~2 horas

**Total aproximado**: ~28 horas

## 🔮 Mejoras Futuras (No implementadas por tiempo)

- [ ] Tests unitarios con Jest/Vitest
- [ ] Tests E2E con Playwright
- [ ] Backend real con API REST
- [ ] Autenticación de usuarios
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Integración real con APIs de terceros
- [ ] Analytics y métricas
- [ ] Exportación de conversaciones
- [ ] Modo claro/oscuro toggle
- [ ] Internacionalización (i18n)
- [ ] OCR para extracción de texto de imágenes
- [ ] Procesamiento real de PDFs y Excel
- [ ] Integración con OpenAI/Claude para análisis de documentos
- [ ] Almacenamiento en la nube para archivos (S3, Cloudinary)

## 📄 Licencia

MIT License - Proyecto desarrollado para evaluación técnica de Funnelhot.

---

Desarrollado con ❤️ usando Next.js 14, TypeScript y Tailwind CSS

Desarollador --> Camilo Gomez Roman
email --> camilogomezroman@protonmail.com


