# 🤖 Proyecto: Evaluador de Impacto de Notas de Prensa

Este repositorio contiene el código fuente para la Prueba Técnica "Evaluador de Impacto de Notas de Prensa". El proyecto está compuesto por un **backend basado en N8N** (workflow de automatización) y un **frontend web** (HTML/CSS/JavaScript) que permite evaluar el impacto de notas de prensa mediante métricas calculadas automáticamente.

---

## 🚀 Descripción General

El sistema evalúa el impacto de notas de prensa mediante:
- **Cobertura de Medios**: Número de registros consultados desde Google Sheets
- **Alcance Estimado**: Cálculo basado en datos del ID de consulta
- **Duración en Días**: Simulación de permanencia en agenda (2-7 días)
- **Engagement Total**: Suma de interacciones simuladas

El análisis determina un **resultado global** (`FUNCIONÓ` / `NO FUNCIONÓ`) basado en umbrales predefinidos para cada métrica.

---

## 📂 Estructura del Proyecto

```
evaluador-impacto-notas-prensa/
├── index.html              # Interfaz de usuario del evaluador
├── script.js               # Lógica del frontend y llamada a la API
├── n8n-workflow/
│   └── My workflow.json    # Workflow de N8N (backend)
└── README.md               # Documentación del proyecto
```

---

## 📅 DÍA 1: Workflow de Análisis (N8N Backend)

Esta sección documenta el endpoint de la API creado en N8N para realizar el análisis de impacto. El flujo se encarga de recibir los datos del formulario, consultar el endpoint base de Google Sheets y aplicar una lógica de simulación para calcular las métricas.

### 1. Endpoint de Análisis (Webhook)

El Frontend hace una solicitud POST a la siguiente URL para iniciar el análisis.

| Descripción | Valor |
| :--- | :--- |
| **URL de Producción** | `https://victoriagaray.app.n8n.cloud/webhook/evaluador-impacto` |
| **Método** | `POST` |
| **Content-Type** | `application/json` |

---

### 2. Estructura de la Petición (Input)

El Webhook espera recibir los siguientes datos del formulario en el **cuerpo (Body)** de la solicitud JSON:

```json
{
  "organizacion": "Nombre de la organización (ej: EmpresaX)",
  "tema": "Título de la nota de prensa (ej: Lanzamiento Nuevo Producto)",
  "fecha": "Fecha de publicación (ej: 2025-10-22)"
}
```

### 3. Flujo del Workflow N8N

El workflow implementado consta de los siguientes nodos:

1. **Webhook (Trigger)**: Recibe la solicitud POST del frontend
2. **HTTP Request**: Consulta el endpoint de Google Sheets (`action=getData&limit=50`)
3. **Code (JavaScript)**:
   - Procesa los 50 registros obtenidos
   - Calcula las métricas de impacto
   - Aplica umbrales para determinar estados (Excelente/Bien/Malo)
   - Genera el resultado global
4. **Respond to Webhook**: Devuelve el JSON con los resultados al frontend

### 4. Estructura de la Respuesta (Output)

El backend devuelve un JSON con el siguiente formato:

```json
{
  "organizacion": "EmpresaX",
  "tema": "Lanzamiento Nuevo Producto",
  "cobertura_medios": 50,
  "alcance_estimado": 425000,
  "duracion_dias": 5,
  "engagement_total": 1250,
  "analisis": {
    "cobertura": {
      "estado": "Excelente",
      "color": "verde"
    },
    "alcance": {
      "estado": "Excelente",
      "color": "verde"
    },
    "duracion": {
      "estado": "Excelente",
      "color": "verde"
    }
  },
  "resultado_global": "FUNCIONÓ"
}
```

### 5. Lógica de Umbrales

| Métrica | Excelente (Verde) | Bien (Amarillo) | Malo (Rojo) |
|---------|-------------------|-----------------|-------------|
| **Cobertura de Medios** | ≥ 40 | 20 - 39 | < 20 |
| **Alcance Estimado** | ≥ 400,000 | 150,000 - 399,999 | < 150,000 |
| **Duración en Días** | ≥ 5 | 3 - 4 | < 3 |

**Resultado Global**: Se considera `FUNCIONÓ` cuando al menos 2 de las 3 métricas principales NO están en estado "Malo".

---

## 📅 DÍA 2: Frontend Web (HTML/CSS/JavaScript)

### 1. Características del Frontend

- ✅ **Formulario interactivo**: Captura Organización, Tema y Fecha
- ✅ **Validación de campos**: Todos los campos son obligatorios
- ✅ **Indicador de carga**: Muestra mensaje mientras se procesa la solicitud
- ✅ **Visualización de resultados**:
  - Métricas con código de colores (verde/amarillo/rojo)
  - Resultado global destacado
  - Formateo de números con separadores de miles
- ✅ **Manejo de errores**: Muestra mensajes descriptivos si falla la conexión

### 2. Componentes del Frontend

#### `index.html`
Interfaz de usuario con diseño responsivo que incluye:
- Formulario de entrada de datos
- Área de resultados con métricas codificadas por colores
- Estilos CSS integrados para una presentación profesional

#### `script.js`
Lógica del frontend que implementa:
- Captura del evento submit del formulario
- Llamada `fetch` al endpoint de N8N
- Procesamiento y visualización de resultados
- Manejo de errores con mensajes al usuario

### 3. Flujo de Interacción

1. Usuario completa el formulario con los datos de la nota de prensa
2. Al hacer clic en "Evaluar Impacto", se muestra el indicador de carga
3. Se envía la solicitud POST al webhook de N8N
4. Se recibe la respuesta con las métricas calculadas
5. Se renderizan los resultados con colores según el estado de cada métrica
6. Se muestra el resultado global (FUNCIONÓ/NO FUNCIONÓ)

---

## 🛠️ Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a Internet (para acceder al endpoint de N8N)

### Ejecución Local

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd evaluador-impacto-notas-prensa
```

2. Abrir `index.html` en el navegador:
   - Doble clic en el archivo, o
   - Usar un servidor local (ej: Live Server en VS Code)

3. Completar el formulario y hacer clic en "Evaluar Impacto"

### Configuración del Workflow N8N

1. Importar el archivo `n8n-workflow/My workflow.json` en tu instancia de N8N
2. **ACTIVAR** el workflow para que el webhook esté disponible
3. Verificar que la URL del webhook coincida con la configurada en `script.js:8`

---

## 🧪 Ejemplo de Uso

**Entrada:**
- Organización: `TechCorp`
- Tema: `Lanzamiento de IA Generativa`
- Fecha: `2025-10-23`

**Salida esperada:**
- Cobertura de Medios: 50 (Excelente - Verde)
- Alcance Estimado: ~420,000 (Excelente - Verde)
- Duración en Días: 5 (Excelente - Verde)
- Engagement Total: ~1,200
- **Resultado Global: FUNCIONÓ**

---

## 📋 Tecnologías Utilizadas

- **Backend**: N8N (Workflow Automation)
  - Webhook Node
  - HTTP Request Node
  - Code Node (JavaScript)
- **Frontend**:
  - HTML5
  - CSS3 (diseño responsivo y moderno)
  - JavaScript (Vanilla JS con Fetch API)
- **Fuente de Datos**: Google Apps Script / Google Sheets

---

## 🔗 Enlaces Relevantes

- **Endpoint de Análisis**: `https://victoriagaray.app.n8n.cloud/webhook/evaluador-impacto`
- **Google Sheets API**: `https://script.google.com/macros/s/AKfycbyPP_fxSfu6vajpZG_0VNVggSA0eIoW38kSCG1a2zA5UlB9dsNoQn8gGf1UZ9l8oMIQJg/exec?action=getData&limit=50`

---

## 📝 Notas Técnicas

- El sistema utiliza **datos simulados** para el cálculo de métricas basándose en los IDs de consulta de Google Sheets
- La duración en días es aleatoria (2-7 días) en cada análisis
- El engagement es calculado mediante valores aleatorios sumados
- **IMPORTANTE**: El workflow de N8N debe estar **ACTIVO** para que funcione el sistema

---

## 👩‍💻 Desarrollo

**Día 1**: Diseño e implementación del workflow N8N + estructura de la API
**Día 2**: Desarrollo del frontend web con interfaz de usuario interactiva

---

## 📧 Contacto

Proyecto desarrollado como prueba técnica por **Victoria Garay**
