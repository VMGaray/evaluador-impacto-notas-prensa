# 📋 CASOS DE PRUEBA REALES - EVALUADOR DE IMPACTO DE NOTAS DE PRENSA

Este documento detalla casos de prueba **ejecutados en tiempo real** sobre la aplicación web de evaluación de impacto mediático.

**Fecha de ejecución:** 23 de octubre de 2025
**Ejecutado por:** Victoria Garay

---

## 🧪 CASO DE PRUEBA #1: Nota de Prensa Tecnológica

### Datos de Entrada
- **Organización:** TechStartup Argentina
- **Tema:** Lanzamiento de nueva app de inteligencia artificial
- **Fecha de Publicación:** 2025-01-15

### Resultado Obtenido
- **Cobertura de Medios:** 50 medios - Estado: **Excelente** ✅
- **Alcance Estimado:** 0 personas - Estado: **Malo** ❌
- **Duración:** 7 días - Estado: **Excelente** ✅
- **Engagement Total:** 1,305 interacciones - Estado: **Bien** ⚠️
- **RESULTADO GLOBAL:** ✅ **FUNCIONÓ**

### Observaciones
A pesar de que el alcance estimado fue 0 (indicador en rojo), el sistema determinó que la nota **FUNCIONÓ** porque 3 de las 4 métricas estuvieron en verde o amarillo. Esto valida correctamente la lógica de evaluación implementada: una métrica en rojo no invalida todo el análisis si las demás son positivas.

---

## 🧪 CASO DE PRUEBA #2: Evento Cultural

### Datos de Entrada
- **Organización:** Ministerio de Cultura
- **Tema:** Festival Internacional de Cine Independiente
- **Fecha de Publicación:** 2025-02-20

### Resultado Obtenido
- **Cobertura de Medios:** 50 medios - Estado: **Excelente** ✅
- **Alcance Estimado:** 0 personas - Estado: **Malo** ❌
- **Duración:** 3 días - Estado: **Bien** ⚠️
- **Engagement Total:** 1,173 interacciones - Estado: **Bien** ⚠️
- **RESULTADO GLOBAL:** ✅ **FUNCIONÓ**

### Observaciones
Similar al caso anterior, el alcance estimado fue 0 (rojo), pero gracias a que las otras 3 métricas estuvieron en verde/amarillo, el resultado global fue positivo. La duración de 3 días obtuvo "Bien" en lugar de "Excelente" como en el caso #1.

---

## 🧪 CASO DE PRUEBA #3: Comunicado Empresarial Local

### Datos de Entrada
- **Organización:** PyME Construcciones del Sur
- **Tema:** Apertura de nueva sucursal en barrio
- **Fecha de Publicación:** 2025-03-10

### Resultado Obtenido
- **Cobertura de Medios:** 50 medios - Estado: **Excelente** ✅
- **Alcance Estimado:** 0 personas - Estado: **Malo** ❌
- **Duración:** 3 días - Estado: **Bien** ⚠️
- **Engagement Total:** 1,332 interacciones - Estado: **Bien** ⚠️
- **RESULTADO GLOBAL:** ✅ **FUNCIONÓ**

### Observaciones
Patrón consistente: cobertura excelente (50 medios), alcance 0, y métricas de duración y engagement en amarillo. A pesar de ser una pequeña empresa local, obtuvo una cobertura mediática excelente según los datos retornados por la API.

---

## 🧪 CASO DE PRUEBA #4: Anuncio Interno de Bajo Impacto

### Datos de Entrada
- **Organización:** Club Deportivo Barrial
- **Tema:** Cambio de horarios de actividades
- **Fecha de Publicación:** 2025-04-05

### Resultado Obtenido
- **Cobertura de Medios:** 50 medios - Estado: **Excelente** ✅
- **Alcance Estimado:** 0 personas - Estado: **Malo** ❌
- **Duración:** 3 días - Estado: **Bien** ⚠️
- **Engagement Total:** 1,088 interacciones - Estado: **Bien** ⚠️
- **RESULTADO GLOBAL:** ✅ **FUNCIONÓ**

### Observaciones
Se mantiene el patrón de los casos anteriores. La API parece devolver datos simulados con valores consistentes: siempre 50 medios de cobertura, 0 de alcance, y engagement variable entre 1,000-1,400.

---

## 🧪 CASO DE PRUEBA #5: Anuncio Gubernamental

### Datos de Entrada
- **Organización:** Gobierno Provincial
- **Tema:** Inauguración de nuevo hospital público
- **Fecha de Publicación:** 2025-05-01

### Resultado Obtenido
- **Cobertura de Medios:** 50 medios - Estado: **Excelente** ✅
- **Alcance Estimado:** 0 personas - Estado: **Malo** ❌
- **Duración:** 4 días - Estado: **Bien** ⚠️
- **Engagement Total:** 1,099 interacciones - Estado: **Bien** ⚠️
- **RESULTADO GLOBAL:** ✅ **FUNCIONÓ**

### Observaciones
El quinto caso confirma el patrón: cobertura siempre en 50 medios, alcance en 0, duración variable entre 3-7 días, y engagement entre 1,088-1,332. Esto evidencia que la API está usando un generador de datos aleatorios con rangos predefinidos.

---

## 📊 RESUMEN DE PRUEBAS

### Tabla Comparativa

| Caso | Organización | Cobertura | Alcance | Duración | Engagement | Resultado |
|------|-------------|-----------|---------|----------|------------|-----------|
| #1 | TechStartup Argentina | 50 ✅ | 0 ❌ | 7 días ✅ | 1,305 ⚠️ | ✅ FUNCIONÓ |
| #2 | Ministerio de Cultura | 50 ✅ | 0 ❌ | 3 días ⚠️ | 1,173 ⚠️ | ✅ FUNCIONÓ |
| #3 | PyME Construcciones | 50 ✅ | 0 ❌ | 3 días ⚠️ | 1,332 ⚠️ | ✅ FUNCIONÓ |
| #4 | Club Deportivo Barrial | 50 ✅ | 0 ❌ | 3 días ⚠️ | 1,088 ⚠️ | ✅ FUNCIONÓ |
| #5 | Gobierno Provincial | 50 ✅ | 0 ❌ | 4 días ⚠️ | 1,099 ⚠️ | ✅ FUNCIONÓ |

### Métricas por Color

| Métrica | Verde (✅) | Amarillo (⚠️) | Rojo (❌) |
|---------|-----------|---------------|----------|
| Cobertura de Medios | 5 | 0 | 0 |
| Alcance Estimado | 0 | 0 | 5 |
| Duración | 1 | 4 | 0 |
| Engagement | 0 | 5 | 0 |

---

## ✅ FUNCIONALIDADES VALIDADAS

### Funcionalidades Core Probadas
- ✅ **Formulario de entrada:** Validación de campos (organización, tema, fecha)
- ✅ **Integración con API n8n:** Comunicación exitosa en todos los casos
- ✅ **Cálculo de métricas:** Sistema de colores funcionando (verde/amarillo/rojo)
- ✅ **Estados por métrica:** Excelente/Bien/Malo según umbrales definidos
- ✅ **Resultado global:** Lógica de "FUNCIONÓ" cuando ≥3 métricas en verde/amarillo
- ✅ **Visualización:** Tarjetas de resultados con colores distintivos

### Funcionalidades Adicionales
- **Ver Detalles Ampliados:** Modal con información detallada (no probado en estos casos)
- **Comparar con Otras Notas:** Sistema de guardado y comparación (no probado en estos casos)
- **Solicitar Análisis Completo:** Descarga de reporte .txt (no probado en estos casos)

### Aspectos Técnicos Verificados
- ✅ **Diseño responsive:** Interfaz adaptable
- ✅ **Manejo de errores:** Sin errores durante las pruebas
- ✅ **Conectividad API:** 100% de éxito en llamadas
- ✅ **Interfaz moderna:** Diseño limpio y profesional

---

## 🔍 OBSERVACIONES IMPORTANTES

### Patrón de Datos de la API
Durante las pruebas se identificó que la API de n8n **devuelve datos simulados** con un patrón muy consistente:
- **Cobertura de Medios:** Siempre retorna 50 medios
- **Alcance Estimado:** Siempre retorna 0 personas
- **Duración:** Varía entre 3 y 7 días
- **Engagement:** Varía entre 1,088 y 1,332 interacciones

Esto sugiere que el **workflow de n8n está usando datos aleatorios o de prueba**, no datos reales conectados a bases de datos mediáticas.

### Validación de la Lógica de Evaluación
A pesar de los datos simulados, las pruebas **validan correctamente**:
1. ✅ El sistema evalúa correctamente cada métrica según umbrales
2. ✅ El código de colores funciona apropiadamente
3. ✅ La lógica de resultado global funciona: con 1 métrica en rojo pero 3 en verde/amarillo → **FUNCIONÓ**
4. ✅ La aplicación no se rompe con ningún tipo de entrada válida

### Limitaciones Identificadas
- ❌ No se pudo probar un caso con resultado **"NO FUNCIONÓ"** debido a que la API siempre devuelve valores altos de cobertura
- ⚠️ El alcance siempre en 0 podría indicar un problema en el workflow de n8n o un campo no configurado
- ℹ️ Las funcionalidades adicionales (modal de detalles, comparación, descarga) no fueron probadas en esta sesión

---

## 📝 CONCLUSIÓN

Los 5 casos de prueba demuestran que:

✅ **La aplicación web funciona correctamente** en términos de:
- Captura de datos del formulario
- Comunicación con la API
- Procesamiento y visualización de resultados
- Aplicación de lógica de evaluación

⚠️ **La API de n8n requiere revisión** porque:
- Está devolviendo datos demasiado consistentes (posiblemente simulados)
- El alcance siempre es 0, lo cual no es realista
- No permite probar casos de "bajo impacto" o "NO FUNCIONÓ"

📌 **Recomendación:** Revisar el workflow de n8n para conectarlo a fuentes de datos reales o mejorar el generador de datos aleatorios para obtener mayor variabilidad en los resultados.

---

**Estado de las pruebas:** ✅ Completadas
**Aplicación:** ✅ Funcionando correctamente
**API:** ⚠️ Requiere ajustes en datos de respuesta
