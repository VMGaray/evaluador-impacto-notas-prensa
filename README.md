# 📊 Evaluador de Impacto de Notas de Prensa

> Aplicación web para analizar y evaluar el impacto mediático de notas de prensa en medios de comunicación locales y regionales.

![Estado](https://img.shields.io/badge/estado-funcional-brightgreen)
![Tecnología](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)
![N8N](https://img.shields.io/badge/backend-N8N%20Workflow-orange)

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

Esta aplicación permite a organizaciones, empresas y entidades gubernamentales **evaluar el impacto real** de sus comunicados de prensa en los medios de comunicación. A través de un workflow automatizado en N8N que consulta datos de un endpoint externo, el sistema analiza métricas clave y proporciona insights accionables.

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

✅ **Análisis Automático**
- Integración con workflow N8N
- Consulta a endpoint externo con 50 registros
- Procesamiento de datos en tiempo real

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

### Paso 1: Importar el Workflow

1. Accede a tu instancia de N8N
2. Ve a **Workflows** → **Import from File**
3. Selecciona el archivo `workflow-evaluador-impacto.json` incluido en este repositorio
4. Haz clic en **Import**

### Paso 2: Configurar el Webhook

1. Abre el nodo **Webhook** en el workflow
2. Copia la URL del webhook generada
3. Abre el archivo `script.js` en tu editor
4. Verifica que la línea 8 tenga tu URL del webhook:

```javascript
const WEBHOOK_URL = "https://victoriagaray.app.n8n.cloud/webhook/evaluador-impacto";
```

**Nota:** Si importas el workflow en tu propia instancia de N8N, la URL será diferente. En ese caso, reemplázala con tu URL.

### Paso 3: Verificar Configuración

El workflow tiene la siguiente estructura:

```
Webhook → Set → HTTP Request → Code (JavaScript) → Respond to Webhook
```

- **Webhook:** Recibe datos del frontend (organizacion, tema, fecha)
- **Set:** Prepara los datos para procesamiento
- **HTTP Request:** Consulta el endpoint externo (50 registros)
- **Code:** Calcula métricas y determina estados
- **Respond to Webhook:** Devuelve resultados al frontend

### Paso 4: Activar el Workflow

1. Haz clic en el botón **"Active"** en la esquina superior derecha
2. El workflow debe mostrar un ícono verde ✅
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
├── index.html                         # Página principal (HTML estructural)
├── styles.css                         # Estilos y diseño visual
├── script.js                          # Lógica de la aplicación
├── workflow-evaluador-impacto.json    # Workflow N8N exportado
├── README.md                          # Documentación completa del proyecto
│
└── docs/                              # Documentación y recursos
    ├── CASOS_DE_PRUEBA.md             # 5 casos de prueba documentados
    ├── DOCUMENTACION_TECNICA.md       # Arquitectura y detalles técnicos
    └── video-demo.mp4                 # Video explicativo 60-90s
```

### Arquitectura de Archivos

- **`index.html` (96 líneas):** Estructura HTML semántica, sin CSS inline
- **`styles.css` (464 líneas):** Todos los estilos, animaciones y responsive design
- **`script.js`:** Lógica de interacción, fetch API y manejo de datos

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5:** Estructura semántica modular
- **CSS3:** Estilos externos con gradientes, animaciones y responsive design
- **JavaScript (Vanilla):** Lógica sin dependencias externas

### Backend
- **N8N:** Orquestación de workflow
- **JavaScript (Node.js):** Procesamiento en nodo Code
- **HTTP Request:** Consulta a endpoint externo

### Características Técnicas
- ✅ Arquitectura modular (HTML, CSS y JS separados)
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

Para información detallada sobre la arquitectura, flujo de datos, y decisiones técnicas:

📖 **Ver:** [DOCUMENTACION_TECNICA.md](docs/DOCUMENTACION_TECNICA.md)

### Temas Cubiertos:
- Arquitectura del sistema
- Flujo de datos completo
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

- El sistema utiliza datos reales del endpoint externo de Google Sheets
- El cálculo de métricas se basa en los 50 registros obtenidos
- La duración en días es simulada (2-7 días aleatorios)
- El engagement se calcula mediante simulación basada en datos
- **IMPORTANTE**: El workflow de N8N debe estar **ACTIVO** para que funcione

---

## 👤 Autor

**Victoria Garay**

Proyecto desarrollado como prueba técnica.

---
