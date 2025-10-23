# 📘 DOCUMENTACIÓN TÉCNICA - Evaluador de Impacto de Notas de Prensa

Este documento proporciona una visión técnica detallada del sistema, incluyendo arquitectura, flujos de datos, decisiones de diseño y consideraciones de implementación.

---

## 📐 Arquitectura del Sistema

### Visión General

El sistema implementa una arquitectura **cliente-servidor desacoplada** con las siguientes capas:

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                  │
│              (Frontend - HTML/CSS/JavaScript)            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Formulario │  │ Visualización│  │ Funcionalidades│  │
│  │  de Entrada │  │  de Métricas │  │   Adicionales │  │
│  └──────┬──────┘  └──────────────┘  └──────────────┘   │
└─────────┼───────────────────────────────────────────────┘
          │ HTTP POST (JSON)
          ▼
┌─────────────────────────────────────────────────────────┐
│                 CAPA DE ORQUESTACIÓN                     │
│                   (N8N Workflow)                         │
│  ┌──────────┐  ┌─────┐  ┌──────────┐  ┌──────────┐     │
│  │ Webhook  │→ │ Set │→ │   HTTP   │→ │   Code   │     │
│  │ (Trigger)│  │     │  │  Request │  │(JavaScript)│    │
│  └──────────┘  └─────┘  └────┬─────┘  └─────┬────┘     │
│                               │              │           │
│                               ▼              ▼           │
│                        ┌─────────────────────────┐      │
│                        │  Respond to Webhook     │      │
│                        └──────────┬──────────────┘      │
└───────────────────────────────────┼──────────────────────┘
                                    │ HTTP Response (JSON)
                                    ▼
┌─────────────────────────────────────────────────────────┐
│                  FUENTE DE DATOS EXTERNA                 │
│             (Google Sheets API Endpoint)                 │
│              50 registros de prueba                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos Completo

### 1. Entrada del Usuario (Frontend → N8N)

```javascript
// Estructura del payload enviado
{
  "organizacion": "string",  // Ej: "TechCorp Argentina"
  "tema": "string",          // Ej: "Lanzamiento de IA"
  "fecha": "YYYY-MM-DD"      // Ej: "2025-01-15"
}
```

**Método:** `POST`
**Content-Type:** `application/json`
**URL:** `https://victoriagaray.app.n8n.cloud/webhook/evaluador-impacto`

### 2. Procesamiento en N8N

#### Nodo 1: Webhook (Trigger)
- Recibe la solicitud HTTP POST
- Valida que el body contenga JSON válido
- Pasa los datos al siguiente nodo

#### Nodo 2: Set
- Prepara los campos para uso posterior
- Estructura los datos en formato consistente
- Campos configurados:
  - `organizacion`: `{{ $json.body.organizacion }}`
  - `tema`: `{{ $json.body.tema }}`
  - `fecha`: `{{ $json.body.fecha }}`

#### Nodo 3: HTTP Request
- **URL:** `https://script.google.com/macros/s/.../exec?action=getData&limit=50`
- **Método:** GET
- **Respuesta esperada:** Array con 50 objetos
- Cada objeto contiene:
  ```json
  {
    "Query id": "string",
    "Timestamp": "string",
    // ... otros campos
  }
  ```

#### Nodo 4: Code (JavaScript)
Aquí es donde ocurre la magia del análisis.

**Entrada:**
- `records`: Array de 50 registros del HTTP Request
- `organizacion`, `tema`, `fecha`: Datos del formulario

**Proceso:**

```javascript
// 1. Cobertura: Cantidad de registros
const cobertura = records.length; // Máximo 50

// 2. Alcance: Calculado desde "Query id"
let alcanceEstimado = 0;
records.forEach(record => {
    const idString = record["Query id"].slice(-4);
    const baseNum = parseInt(idString) || 0;
    alcanceEstimado += baseNum * 100;
});

// 3. Duración: Simulación aleatoria 2-7 días
const duracionDias = Math.floor(Math.random() * 6) + 2;

// 4. Engagement: Simulación de interacciones
let engagementTotal = 0;
records.forEach(() => {
    engagementTotal += Math.floor(Math.random() * 50);
});

// 5. Determinar estados con umbrales
const analisisCobertura = determinarEstado(cobertura, 40, 20);
const analisisAlcance = determinarEstado(alcanceEstimado, 400000, 150000);
const analisisDuracion = determinarEstado(duracionDias, 5, 3);
const analisisEngagement = determinarEstado(engagementTotal, 1800, 800);

// 6. Resultado global: 3 de 4 métricas deben estar bien
let exitoCount = [analisisCobertura, analisisAlcance,
                  analisisDuracion, analisisEngagement]
                  .filter(a => a.color !== "rojo").length;
const resultadoGlobal = exitoCount >= 3 ? "FUNCIONÓ" : "NO FUNCIONÓ";
```

**Salida:**

```json
{
  "organizacion": "TechCorp Argentina",
  "tema": "Lanzamiento de IA",
  "cobertura_medios": 50,
  "alcance_estimado": 523450,
  "duracion_dias": 6,
  "engagement_total": 2234,
  "analisis": {
    "cobertura": {"estado": "Excelente", "color": "verde"},
    "alcance": {"estado": "Excelente", "color": "verde"},
    "duracion": {"estado": "Bien", "color": "amarillo"},
    "engagement": {"estado": "Excelente", "color": "verde"}
  },
  "resultado_global": "FUNCIONÓ"
}
```

#### Nodo 5: Respond to Webhook
- Devuelve el JSON al frontend
- Status Code: 200 OK
- Content-Type: application/json

### 3. Renderizado en Frontend

El frontend recibe la respuesta y:

1. **Muestra información básica:**
   - Organización y Tema ingresados
   - Fecha de análisis

2. **Renderiza métricas con colores:**
   ```javascript
   for (const key in analysisDetail) {
       const detail = analysisDetail[key];
       const metricBox = `
           <div class="metric-box ${detail.color}">
               <strong>${metricDisplayName}:</strong> ${metricValue}
               (<small>Estado: ${detail.estado}</small>)
           </div>
       `;
   }
   ```

3. **Muestra resultado global:**
   - Verde si FUNCIONÓ
   - Rojo si NO FUNCIONÓ

4. **Guarda en variable global:**
   ```javascript
   window.currentAnalysis = {
       ...analysisResult,
       organizacion: organizacion,
       tema: tema,
       fecha: fecha
   };
   ```

---

## 🎨 Decisiones de Diseño

### Frontend

#### 1. **Arquitectura Sin Frameworks**
**Decisión:** Usar Vanilla JavaScript en lugar de React, Vue o Angular.

**Razones:**
- ✅ Simplicidad: Proyecto pequeño que no justifica bundler
- ✅ Rendimiento: Carga instantánea sin overhead de framework
- ✅ Portabilidad: Un solo archivo HTML funciona en cualquier navegador
- ✅ Mantenibilidad: Menos dependencias = menos problemas

#### 2. **LocalStorage para Persistencia**
**Decisión:** Usar LocalStorage para guardar análisis comparativos.

**Razones:**
- ✅ No requiere backend adicional
- ✅ Datos persisten entre sesiones
- ✅ Acceso sincrónico y rápido
- ⚠️ Limitación: 5-10MB por dominio (suficiente para este caso)

**Implementación:**
```javascript
// Guardar
localStorage.setItem('savedAnalyses', JSON.stringify(savedAnalyses));

// Recuperar
let savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses')) || [];
```

#### 3. **CSS Moderno con Gradientes**
**Decisión:** Usar CSS3 puro sin preprocessores.

**Técnicas utilizadas:**
- **Gradientes lineales:** Para fondos y botones
  ```css
  background: linear-gradient(135deg, #3d944c 0%, #764ba2 100%);
  ```
- **Animaciones con @keyframes:**
  ```css
  @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
  }
  ```
- **Transiciones suaves:**
  ```css
  transition: all 0.3s ease;
  ```
- **Flexbox y Grid:** Para layouts responsivos

#### 4. **Modales Nativos**
**Decisión:** Implementar modales con JavaScript puro.

**Ventajas:**
- ✅ Control total sobre comportamiento
- ✅ Animaciones personalizadas
- ✅ No depende de bibliotecas externas

**Estructura:**
```html
<div class="modal" style="display:none;">
    <div class="modal-content">
        <span class="close">&times;</span>
        <!-- Contenido dinámico -->
    </div>
</div>
```

### Backend (N8N)

#### 1. **Workflow Lineal vs. Paralelo**
**Decisión:** Workflow secuencial (lineal).

**Razones:**
- ✅ Cada nodo depende del anterior
- ✅ Más fácil de debuggear
- ✅ Suficiente para volumen esperado
- ⚠️ Trade-off: Latencia ligeramente mayor (aceptable: 2-5s)

#### 2. **Simulación de Métricas**
**Decisión:** Calcular métricas basadas en datos reales + simulación.

**Enfoque híbrido:**
- **Cobertura:** 100% real (cantidad de registros)
- **Alcance:** Parcialmente real (basado en Query ID)
- **Duración:** 100% simulado (aleatorio 2-7 días)
- **Engagement:** 100% simulado (aleatorio)

**Justificación:**
> En un sistema productivo, estas métricas vendrían de APIs reales (Google Analytics, Twitter API, etc.). Para la prueba técnica, la simulación demuestra la capacidad de procesar y evaluar datos.

#### 3. **Umbrales de Evaluación**
**Decisión:** Umbrales fijos definidos empíricamente.

| Métrica | Excelente | Bien | Malo |
|---------|-----------|------|------|
| Cobertura | ≥40 | 20-39 | <20 |
| Alcance | ≥400k | 150k-399k | <150k |
| Duración | ≥5 días | 3-4 días | <3 días |
| Engagement | ≥1800 | 800-1799 | <800 |

**Justificación:**
> Estos valores están calibrados para el endpoint de 50 registros. En producción, serían configurables por el usuario o ajustados mediante machine learning.

---

## 🔐 Seguridad y Mejores Prácticas

### Frontend

✅ **Validación de Entrada**
```javascript
// Todos los campos son required en HTML
<input type="text" id="organizacion" required>
```

✅ **Sanitización de Datos**
```javascript
// Uso de textContent en lugar de innerHTML para prevenir XSS
document.getElementById('res-organizacion').textContent = organizacion;
```

✅ **Manejo de Errores**
```javascript
fetch(WEBHOOK_URL)
    .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    })
    .catch(error => {
        // Mostrar mensaje al usuario
    });
```

### Backend (N8N)

✅ **Validación de Webhook**
- N8N valida automáticamente JSON
- Los nodos posteriores verifican existencia de campos

✅ **Manejo de Errores en Code Node**
```javascript
try {
    const setData = $('Set').first().json;
    // ...
} catch (error) {
    console.log("Error, usando valores por defecto");
}
```

✅ **CORS Configurado**
- N8N Cloud maneja CORS automáticamente
- Permite requests desde cualquier origen

---

## ⚡ Optimizaciones

### Performance

1. **Minimización de Reflows**
   - Se actualiza el DOM una sola vez por métrica
   - Uso de `innerHTML +=` en loop eficiente

2. **Carga Diferida**
   - JavaScript se carga al final del HTML
   - No bloquea renderizado inicial

3. **Caché de Elementos DOM**
   ```javascript
   const metricsOutput = document.getElementById('metrics-output');
   // Reutilizar en lugar de buscar múltiples veces
   ```

### UX

1. **Feedback Visual Inmediato**
   - Loading spinner mientras se procesa
   - Transiciones suaves entre estados

2. **Animaciones con Hardware Acceleration**
   ```css
   transform: translateY(-2px);
   /* GPU-accelerated, más suave que top/margin */
   ```

3. **Responsive Design**
   ```css
   @media (max-width: 768px) {
       .action-buttons {
           grid-template-columns: 1fr;
       }
   }
   ```

---

## 📊 Escalabilidad

### Limitaciones Actuales

| Aspecto | Limitación | Impacto |
|---------|-----------|---------|
| **Concurrencia** | 1 request por vez en N8N | ⚠️ Medio |
| **Almacenamiento** | LocalStorage (5MB) | ⚠️ Bajo |
| **Datos** | 50 registros fijos | ⚠️ Bajo |

### Propuestas de Mejora

1. **Escalabilidad Backend:**
   - Migrar a API REST dedicada (Node.js/Express)
   - Implementar caché con Redis
   - Queue system para procesamiento asíncrono

2. **Escalabilidad Frontend:**
   - Migrar a React/Vue para componentes reutilizables
   - Implementar paginación en comparativas
   - Server-Side Rendering (SSR) para SEO

3. **Escalabilidad de Datos:**
   - Base de datos relacional (PostgreSQL)
   - Almacenamiento de históricos
   - APIs reales para métricas (GA4, Twitter, etc.)

---

## 🧪 Testing

### Tests Manuales Realizados

✅ **Funcionales:**
- Envío de formulario con datos válidos
- Envío con campos vacíos (validación HTML5)
- Respuesta correcta del endpoint N8N
- Renderizado de métricas con colores
- Modales (apertura, cierre, funcionalidad)
- Descarga de análisis completo
- Guardado y comparación de múltiples análisis

✅ **Cross-Browser:**
- Chrome 120+ ✅
- Firefox 120+ ✅
- Edge 120+ ✅
- Safari 17+ ✅

✅ **Responsive:**
- Desktop (1920x1080) ✅
- Tablet (768x1024) ✅
- Mobile (375x667) ✅

### Tests Automatizados (Propuesta)

Para un entorno productivo, se recomienda:

```javascript
// Ejemplo con Jest
describe('Evaluador de Impacto', () => {
    test('calcula cobertura correctamente', () => {
        const records = [{}, {}, {}];
        expect(calcularCobertura(records)).toBe(3);
    });

    test('determina estado según umbrales', () => {
        expect(determinarEstado(45, 40, 20)).toEqual({
            estado: "Excelente",
            color: "verde"
        });
    });
});
```

---

## 📈 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Líneas de código (Frontend)** | ~450 |
| **Líneas de código (N8N Code Node)** | ~120 |
| **Nodos en workflow N8N** | 5 |
| **Tiempo de respuesta promedio** | 2-4 segundos |
| **Tamaño del HTML** | ~28 KB |
| **Tamaño del JS** | ~12 KB |
| **Sin dependencias externas** | ✅ |

---

## 🔮 Roadmap Futuro

### Fase 1: MVP Extendido (1-2 semanas)
- [ ] Autenticación de usuarios
- [ ] Dashboard con histórico de análisis
- [ ] Exportación a PDF/Excel

### Fase 2: Análisis Avanzado (1 mes)
- [ ] Integración con APIs reales (Google Analytics, Twitter)
- [ ] Machine learning para predecir impacto
- [ ] Análisis de sentimiento en comentarios

### Fase 3: Enterprise (2-3 meses)
- [ ] Multi-tenancy
- [ ] API pública documentada
- [ ] Webhooks para notificaciones
- [ ] Reportes personalizables

---

## 📞 Soporte Técnico

Para preguntas técnicas sobre la implementación:

1. **Revisar este documento** primero
2. **Consultar [README.md](README.md)** para instrucciones básicas
3. **Revisar [CASOS_DE_PRUEBA.md](CASOS_DE_PRUEBA.md)** para ejemplos prácticos
4. **Abrir un Issue** en el repositorio

---

## 📝 Changelog

### v1.0.0 (Octubre 2025)
- ✅ Release inicial
- ✅ Funcionalidades core implementadas
- ✅ 3 funcionalidades adicionales
- ✅ Documentación completa
- ✅ 5 casos de prueba validados

---

**Documentación técnica elaborada por:** Victoria Garay
**Última actualización:** Octubre 2025
**Versión del documento:** 1.0
