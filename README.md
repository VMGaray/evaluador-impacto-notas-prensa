# 🤖 Proyecto: Evaluador de Impacto de Notas de Prensa

Este repositorio contiene el código fuente para la Prueba Técnica "Evaluador de Impacto de Notas de Prensa".

---

## 📅 DÍA 1: Workflow de Análisis (N8N Backend)

Esta sección documenta el endpoint de la API creado en n8n para realizar el análisis de impacto. El flujo se encarga de recibir los datos del formulario, consultar el endpoint base de Google Sheets y aplicar una lógica de simulación para calcular las métricas.

### 1. Endpoint de Análisis (Webhook)

El Frontend debe hacer una solicitud a la siguiente URL para iniciar el análisis.

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
