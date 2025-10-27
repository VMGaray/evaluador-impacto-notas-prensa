# 📊 Evaluador de Impacto de Notas de Prensa

> Aplicación web para analizar y evaluar el impacto mediático de notas de prensa en medios de comunicación locales y regionales.

![Estado](https://img.shields.io/badge/estado-funcional-brightgreen)
![Tecnología](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)
![N8N](https://img.shields.io/badge/backend-N8N%20Workflow-orange)
![Claude](https://img.shields.io/badge/frontend-Claude%20AI%20Artifacts-blue)
![IA](https://img.shields.io/badge/an%C3%A1lisis-Agente%20IA-purple)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración del Workflow N8N](#configuración-del-workflow-n8n)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Casos de Prueba](#casos-de-prueba)
- [Documentación Técnica](#documentación-técnica)

---

## 🎯 Descripción

Esta aplicación permite a organizaciones, empresas y entidades gubernamentales **evaluar el impacto real** de sus comunicados de prensa en los medios de comunicación. A través de un workflow automatizado en N8N que integra un **agente de IA** (OpenAI/Claude) que consulta datos de un endpoint externo, el sistema analiza métricas clave y proporciona insights accionables inteligentes.

### 🤖 Desarrollo del Frontend con Claude AI

El frontend fue desarrollado utilizando **Claude AI Artifacts** (claude.ai), lo que permitió:
- ✅ Desarrollo rápido con vista previa en tiempo real
- ✅ Código de alta calidad generado por IA
- ✅ Diseño responsive y moderno
- ✅ Iteración rápida mediante prompts

📄 **Ver documentación completa:** [`INSTRUCCIONES_CLAUDE_ARTIFACTS.md`](INSTRUCCIONES_CLAUDE_ARTIFACTS.md)

### ¿Qué problema resuelve?

- ❌ **Antes:** No había forma de medir objetivamente si una nota de prensa tuvo impacto
- ✅ **Ahora:** Métricas cuantificables, análisis automático y recomendaciones personalizadas

---

## ✨ Características

### Funcionalidades Core

✅ **Formulario Intuitivo**
- Ingreso de organización, tema y fecha de publicación
- Validación de campos requeridos
- Diseño moderno y responsive

✅ **Análisis con IA**
- 🤖 **Agente de IA** (OpenAI GPT-4 / Claude 3.5) para análisis inteligente
- Integración con workflow N8N
- Consulta a endpoint externo con 50 registros
- Procesamiento contextual de datos en tiempo real
- Recomendaciones personalizadas basadas en IA

✅ **Métricas de Impacto**
- 📰 **Cobertura mediática:** Cantidad de medios que publicaron
- 👥 **Alcance estimado:** Número de personas impactadas
- ⏱️ **Duración:** Días en agenda mediática
- 💬 **Engagement:** Interacciones en redes sociales

✅ **Indicadores Visuales**
- Código de colores: 🟢 Verde / 🟡 Amarillo / 🔴 Rojo
- Estados por métrica: Excelente / Bien / Malo
- Resultado global: **FUNCIONÓ** / **NO FUNCIONÓ**

### Funcionalidades Adicionales

📊 **Ver Detalles Ampliados**
- Modal con información completa de cada métrica
- Descripciones detalladas
- Recomendaciones personalizadas basadas en el desempeño

📈 **Comparar con Otras Notas**
- Guardar múltiples análisis en localStorage
- Tabla comparativa con todas las métricas
- Visualización histórica de rendimiento

📄 **Solicitar Análisis Completo**
- Descarga de reporte en formato .txt
- Incluye todas las métricas y recomendaciones
- Listo para compartir con equipos

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Navegador web moderno (Chrome, Firefox, Edge, Safari)
- ✅ Cuenta en [N8N Cloud](https://n8n.io/) o instalación local de N8N
- ✅ Acceso al endpoint de datos (proporcionado en el workflow)

---

## 🚀 Instalación

### Opción 1: Uso Directo (Recomendado)

1. **Clona o descarga este repositorio:**

```bash
git clone https://github.com/VMGaray/evaluador-impacto-notas-prensa
cd evaluador-impacto-notas-prensa
```

2. **Abre el archivo `index.html` en tu navegador:**

```bash
# En Windows
start index.html

# En macOS
open index.html

# En Linux
xdg-open index.html
```

¡Listo! La aplicación se ejecutará directamente en tu navegador.

### Opción 2: Servidor Local

Si prefieres usar un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server
```

Luego abre `http://localhost:8000` en tu navegador.

---

## ⚙️ Configuración del Workflow N8N

✅ **El workflow incluye análisis con Claude AI (Anthropic) - Requiere configuración manual**

### Arquitectura del Workflow (7 nodos):

```
Webhook → Set → HTTP Request (Google Sheets) → Code (Preparar Prompt) →
HTTP Request (Claude API) → Code (Procesar Respuesta) → Respond to Webhook
```

### Paso 1: Crear el Workflow en N8N

Debido a limitaciones técnicas identificadas (no se puede hacer HTTP requests desde nodos Code), el workflow requiere configuración manual:

**Nodos necesarios:**

1. **Webhook** - Recibe datos del frontend (organizacion, tema, fecha)
2. **Set** - Extrae las variables del body
3. **HTTP Request Google Sheets** - Consulta endpoint externo (50 registros)
4. **Code "Preparar Prompt"** - Construye el prompt para Claude
5. **HTTP Request Claude API** - 🤖 Llama a Claude 3.5 Sonnet
6. **Code "Procesar Respuesta"** - Parsea respuesta + fallback algorítmico
7. **Respond to Webhook** - Devuelve análisis al frontend

📄 **Ver configuración detallada:** [`RESUMEN_INTEGRACION_IA.md`](RESUMEN_INTEGRACION_IA.md)

### Paso 2: Configurar el Nodo HTTP Request Claude API

**⚠️ CRÍTICO:** Este es el paso más importante.

| Campo | Valor |
|-------|-------|
| **Method** | POST |
| **URL** | `https://api.anthropic.com/v1/messages` |
| **Authentication** | None |
| **Send Headers** | ON |
| **Send Body** | ON |
| **Specify Body** | Using JSON |
| **JSON** | `={{ $json }}` (modo Expression) |

**Headers (agregar 3):**
1. `x-api-key`: `TU_API_KEY_DE_ANTHROPIC_AQUI` (obtén tu key en https://console.anthropic.com)
2. `anthropic-version`: `2023-06-01`
3. `content-type`: `application/json`

**⚠️ Errores comunes a evitar:**
- ❌ NO uses `JSON.stringify()` en el campo JSON
- ❌ NO uses `Authentication: HTTP Header Auth`
- ✅ El campo JSON debe estar en modo **Expression**, no Fixed
- ✅ Solo escribe: `={{ $json }}`

### Paso 3: Verificar el Webhook URL

1. Abre el nodo **Webhook** en el workflow
2. Copia la URL del webhook generada
3. Abre el archivo `script.js` en tu editor
4. Verifica que la línea 20 tenga la URL correcta:

```javascript
const WEBHOOK_URL = "https://victoriagaray.app.n8n.cloud/webhook/evaluador-impacto";
```

**Nota:** Si la URL es diferente, actualiza el `script.js` con tu URL.

### Paso 4: Activar el Workflow

1. Haz clic en el botón **"Active"** en la esquina superior derecha
2. El workflow debe mostrar un toggle verde ✅
3. ¡Listo para recibir solicitudes!

---

## 💻 Uso de la Aplicación

### 1. Completar el Formulario

- **Organización:** Nombre de tu empresa/entidad (Ej: TechCorp)
- **Tema:** Título o tema de la nota de prensa (Ej: Lanzamiento Producto)
- **Fecha de Publicación:** Selecciona la fecha usando el calendario

### 2. Evaluar Repercusión

Haz clic en el botón **"Evaluar Repercusión"**. El sistema:
- Envía los datos al workflow N8N
- Consulta el endpoint externo
- Calcula las métricas automáticamente
- Muestra los resultados en 2-5 segundos

### 3. Interpretar Resultados

#### Códigos de Color:
- 🟢 **Verde (Excelente):** Métrica supera expectativas
- 🟡 **Amarillo (Bien):** Métrica en rango aceptable
- 🔴 **Rojo (Malo):** Métrica necesita mejorar

#### Resultado Global:
- ✅ **FUNCIONÓ:** 3 o más métricas en verde/amarillo
- ❌ **NO FUNCIONÓ:** Más de 1 métrica en rojo

### 4. Acciones Adicionales

#### 📊 Ver Detalles Ampliados
- Información completa de cada métrica
- Recomendaciones personalizadas
- Explicación de qué significa cada indicador

#### 📈 Comparar con Otras Notas
- Guarda el análisis actual
- Realiza más análisis
- Compara rendimiento en tabla

#### 📄 Solicitar Análisis Completo
- Descarga reporte en .txt
- Incluye todas las métricas
- Listo para compartir

---

## 📁 Estructura del Proyecto

```
evaluador-impacto-notas-prensa/
│
├── index.html                            # Página principal (HTML estructural)
├── styles.css                            # Estilos y diseño visual
├── script.js                             # Lógica de la aplicación
├── frontend-artifact.html                # 🤖 Versión consolidada para Claude Artifacts
├── INSTRUCCIONES_CLAUDE_ARTIFACTS.md     # 🤖 Guía de uso de Claude AI
├── README.md                             # Documentación completa del proyecto
│
├── n8n-workflow/
│   ├── workflow.json                     # 🤖 Workflow N8N con Claude AI integrado (funcional)
│   └── PROMPT_CLAUDE_SIMPLE.txt          # Prompt de referencia para el agente IA
│
└── docs/                                 # Documentación y recursos
    ├── CASOS_DE_PRUEBA.md                # 5 casos de prueba documentados
    ├── DOCUMENTACION_TECNICA.md          # Arquitectura y detalles técnicos
    ├── CLAUDE_ARTIFACTS_DESARROLLO.md    # 🤖 Proceso de desarrollo con Claude
    ├── INTEGRACION_IA_WORKFLOW.md        # 🤖 Integración de IA en N8N
    └── video-demo.mp4                    # Video explicativo 60-90s
```

### Arquitectura de Archivos

#### Frontend
- **`index.html` (96 líneas):** Estructura HTML semántica, sin CSS inline
- **`styles.css` (464 líneas):** Todos los estilos, animaciones y responsive design
- **`script.js` (359 líneas):** Lógica de interacción, fetch API y manejo de datos
- **`frontend-artifact.html`:** 🤖 Versión todo-en-uno para Claude Artifacts

#### Backend (N8N)
- **`n8n-workflow/workflow.json`:** Workflow funcional con Claude 3.5 Sonnet integrado
- **`n8n-workflow/PROMPT_CLAUDE_SIMPLE.txt`:** Prompt de referencia para el agente IA

#### Documentación
- **`INSTRUCCIONES_CLAUDE_ARTIFACTS.md`:** Cómo reproducir el artifact en claude.ai
- **`docs/CLAUDE_ARTIFACTS_DESARROLLO.md`:** Proceso completo de desarrollo con IA
- **`docs/INTEGRACION_IA_WORKFLOW.md`:** Guía de integración de IA en N8N

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5:** Estructura semántica modular
- **CSS3:** Estilos externos con gradientes, animaciones y responsive design
- **JavaScript (Vanilla):** Lógica sin dependencias externas
- **🤖 Claude AI Artifacts:** Herramienta de desarrollo del frontend

### Backend
- **N8N:** Orquestación de workflow
- **🤖 Claude 3.5 Sonnet (Anthropic):** Agente de IA para análisis inteligente
- **JavaScript (Node.js):** Procesamiento en nodos Code para preparar prompts y procesar respuestas
- **HTTP Request:** Consulta a endpoint externo (Google Sheets API) y API de Claude

### Características Técnicas
- ✅ Arquitectura modular (HTML, CSS y JS separados)
- ✅ 🤖 Frontend generado con Claude AI Artifacts
- ✅ 🤖 Análisis inteligente con Claude 3.5 Sonnet integrado
- ✅ Diseño responsive (mobile-first)
- ✅ LocalStorage para persistencia de datos
- ✅ Fetch API para comunicación asíncrona
- ✅ Manejo de errores robusto
- ✅ Animaciones CSS3 (keyframes)
- ✅ Separación de responsabilidades (estructura, presentación, comportamiento)

---

## 🧪 Casos de Prueba

Se han documentado **5 casos de prueba exitosos** que validan todas las funcionalidades:

1. ✅ **Campaña Tecnológica Exitosa** - Todas las métricas en verde
2. ✅ **Evento Cultural Regional** - Métricas en amarillo, resultado positivo
3. ✅ **Iniciativa Ambiental Local** - Mix de colores, funcionó
4. ❌ **Comunicado Empresarial Bajo Impacto** - Todas las métricas en rojo
5. ✅ **Anuncio Gubernamental Alto Impacto** - Excelente desempeño

**Ver detalles completos:** [CASOS_DE_PRUEBA.md](docs/CASOS_DE_PRUEBA.md)

---

## 📚 Documentación Técnica

### Documentos Principales

| Documento | Descripción |
|-----------|-------------|
| **[DOCUMENTACION_TECNICA.md](docs/DOCUMENTACION_TECNICA.md)** | Arquitectura del sistema, flujo de datos, decisiones técnicas |
| **🤖 [CLAUDE_ARTIFACTS_DESARROLLO.md](docs/CLAUDE_ARTIFACTS_DESARROLLO.md)** | Proceso de desarrollo del frontend con Claude AI |
| **🤖 [INTEGRACION_IA_WORKFLOW.md](docs/INTEGRACION_IA_WORKFLOW.md)** | Guía para integrar OpenAI/Claude en N8N workflow |
| **[INSTRUCCIONES_CLAUDE_ARTIFACTS.md](INSTRUCCIONES_CLAUDE_ARTIFACTS.md)** | Cómo reproducir el artifact en claude.ai |
| **[CASOS_DE_PRUEBA.md](docs/CASOS_DE_PRUEBA.md)** | 5 casos de prueba documentados |

### Temas Cubiertos:
- Arquitectura del sistema
- Flujo de datos completo
- 🤖 Desarrollo con Claude AI Artifacts
- 🤖 Integración de agentes de IA
- Cálculo de métricas y umbrales
- Decisiones de diseño
- Seguridad y mejores prácticas

---


## ⚡ Inicio Rápido (TL;DR)

```bash
# 1. Clona el repo
git clone https://github.com/tu-usuario/evaluador-impacto-notas-prensa.git

# 2. Configura N8N
# - Importa workflow-evaluador-impacto.json
# - Copia URL del webhook
# - Pega en script.js línea 8

# 3. Abre index.html en tu navegador
start index.html

# 4. ¡Evalúa tu primera nota de prensa!
```

---

## 🔗 Enlaces Relevantes

- **Video Demo**: [Ver demo del proyecto](docs/video-demo.mp4) (60-90s explicando funcionalidades)
- **Endpoint de Análisis**: `https://victoriagaray.app.n8n.cloud/webhook/evaluador-impacto`
- **Google Sheets API**: Endpoint externo utilizado para los datos

---

## 📝 Notas Técnicas

### ✅ Implementado
- El sistema utiliza datos reales del endpoint externo de Google Sheets (50 registros)
- Frontend desarrollado con **Claude AI Artifacts** (claude.ai)
- **🤖 Claude 3.5 Sonnet** integrado en el workflow para análisis inteligente
- Diseño responsive y compacto (800px max-width, optimizado para pantallas pequeñas)
- Estilos CSS modulares con paleta de colores consistente
- **IMPORTANTE**: El workflow de N8N debe estar **ACTIVO** para que funcione

### ⚠️ Configuración Requerida
- **Workflow requiere configuración manual:** Ver [`RESUMEN_INTEGRACION_IA.md`](RESUMEN_INTEGRACION_IA.md)
- **7 nodos necesarios:** No se puede hacer HTTP requests desde nodos Code
- **Nodo HTTP Request Claude API es crítico:** Debe configurarse sin Authentication y con headers manuales
- El workflow incluye sistema de **fallback algorítmico** si Claude API falla
- **Claude AI genera:** Análisis contextual, recomendaciones personalizadas y métricas inteligentes

### 🔧 Problemas Conocidos y Soluciones
- **Error "Cannot read properties of undefined (reading 'helpers')"**: No uses `$http.request()` o `global.n8n.helpers` en Code nodes
- **Error "Bad request"**: No uses `JSON.stringify()` en el campo JSON del nodo HTTP Request
- **Botones desalineados**: Contenedor ampliado a 800px, botones con font-size 0.9em
- **Ver documentación completa de troubleshooting:** [`RESUMEN_INTEGRACION_IA.md`](RESUMEN_INTEGRACION_IA.md)

---

## 👤 Autor

**Victoria Garay**

Proyecto desarrollado como prueba técnica.

---
