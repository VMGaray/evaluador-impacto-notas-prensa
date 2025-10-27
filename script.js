document.addEventListener('DOMContentLoaded', function() {
    
    // Función de ayuda para garantizar que los valores numéricos sean seguros
    const ensureNumber = (val) => {
        // Convierte explicitamente a número, o usa 0 si falla (NaN, null, undefined)
        const num = Number(val);
        return (typeof num === 'number' && !isNaN(num)) ? num : 0;
    };
    
    // ============================================
    // LÓGICA PRINCIPAL DEL FORMULARIO
    // ============================================
    document.getElementById('impact-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const organizacion = document.getElementById('organizacion').value;
        const tema = document.getElementById('tema').value;
        const fecha = document.getElementById('fecha').value;
    
        const WEBHOOK_URL = "https://victoriagaray.app.n8n.cloud/webhook/evaluador-impacto"; 
        
        const data = {
            organizacion: organizacion,
            tema: tema,
            fecha: fecha
        };
        
        // Muestra el loader y limpia los resultados
        document.getElementById('loading').style.display = 'block';
        document.getElementById('results').style.display = 'none';
        document.getElementById('metrics-output').innerHTML = '';
        document.getElementById('global-result').textContent = '';

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(async response => {
            console.log('Estado HTTP:', response.status);
            console.log('Headers:', response.headers);

            if (!response.ok) {
              throw new Error(`Error en el servidor de análisis (HTTP Status: ${response.status})`);
            }

            const text = await response.text();
            console.log('Respuesta del servidor (texto):', text);

            if (!text || text.trim() === '') {
                throw new Error('El servidor devolvió una respuesta vacía. Verifique que el workflow de N8N esté ACTIVO y configurado correctamente.');
            }

            try {
                return JSON.parse(text);
            } catch (e) {
                // Si el parseo falla, mostramos el error original
                throw new Error(`El servidor no devolvió JSON válido. Respuesta: ${text.substring(0, 200)}`);
            }
        })
        .then(analysisResult => {
            console.log('Respuesta completa de la API:', analysisResult);
            console.log('Objeto analisis:', analysisResult.analisis);

            document.getElementById('loading').style.display = 'none';
            document.getElementById('results').style.display = 'block';
            document.getElementById('res-organizacion').textContent = organizacion;
            document.getElementById('res-tema').textContent = tema;

            // Muestra el resumen ejecutivo de la IA
            if (analysisResult.resumen_ejecutivo) {
                document.getElementById('res-resumen-ejecutivo').textContent = analysisResult.resumen_ejecutivo;
            }

            // Mostrar badge de IA si el análisis fue generado con Claude AI
            const aiBadge = document.getElementById('ai-badge');
            if (analysisResult.ai_model === 'claude-3.5-sonnet' && analysisResult.ai_provider === 'anthropic') {
                aiBadge.style.display = 'flex';
                aiBadge.querySelector('.ai-text').innerHTML = 'Análisis generado con <strong>Claude AI 3.5 Sonnet (Anthropic)</strong>';
            } else if (analysisResult.ai_model === 'fallback') {
                aiBadge.style.display = 'flex';
                aiBadge.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                aiBadge.querySelector('.ai-text').innerHTML = '<strong>Análisis básico</strong> (IA no disponible temporalmente)';
            } else {
                aiBadge.style.display = 'none';
            }

            const globalResultDiv = document.getElementById('global-result');
            globalResultDiv.textContent = `Resultado Global: ${analysisResult.resultado_global}`;
            globalResultDiv.className = analysisResult.resultado_global === 'FUNCIONÓ' ? 'global-result verde' : 'global-result rojo';

            // ===============================================
            // CORRECCIÓN CLAVE: Aplicamos ensureNumber() a todos los campos
            // ===============================================
            const metricsOutput = document.getElementById('metrics-output');
            
            const coberturaMedios = ensureNumber(analysisResult.cobertura_medios);
            const alcanceEstimado = ensureNumber(analysisResult.alcance_estimado);
            const duracionDias = ensureNumber(analysisResult.duracion_dias);
            const engagementTotal = ensureNumber(analysisResult.engagement_total);
            
            const metrics = {
                'Cobertura de Medios': coberturaMedios.toLocaleString(),
                'Alcance Estimado': alcanceEstimado.toLocaleString(),
                'Duración en Días': duracionDias.toLocaleString(),
                'Engagement Total': engagementTotal.toLocaleString()
            };
            // ===============================================

            const analysisDetail = analysisResult.analisis;
            
            for (const key in analysisDetail) {
                const detail = analysisDetail[key];
                let metricDisplayName = key.charAt(0).toUpperCase() + key.slice(1);

                if (key === 'cobertura') metricDisplayName = 'Cobertura de Medios';
                if (key === 'alcance') metricDisplayName = 'Alcance Estimado';
                if (key === 'duracion') metricDisplayName = 'Duración en Días';
                if (key === 'engagement') metricDisplayName = 'Engagement Total';

                let metricValue = metrics[metricDisplayName] || '';

                metricsOutput.innerHTML += `
                    <div class="metric-box ${detail.color}">
                        <strong>${metricDisplayName}:</strong> ${metricValue} 
                        (<small>Estado: ${detail.estado}</small>)
                    </div>
                `;
            }

            window.currentAnalysis = {
                ...analysisResult,
                organizacion: organizacion,
                tema: tema,
                fecha: fecha
            };

        })
        .catch(error => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('results').style.display = 'block';
            document.getElementById('results').innerHTML = `<h2 style="color:red;">Error en el Análisis</h2><p>No se pudo completar la solicitud. Verifique que el workflow de n8n esté **ACTIVO**.</p><p>Detalle: ${error.message}</p>`;
            console.error('Fetch error:', error);
        });
    });

    // ============================================
    // FUNCIONALIDADES ADICIONALES (Resto del código)
    // ============================================

    // Variable global para almacenar análisis guardados
    let savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses')) || [];

    // 1. VER DETALLES AMPLIADOS
    document.getElementById('btn-detalles').addEventListener('click', function() {
        const modal = document.getElementById('modal-detalles');
        const modalBody = document.getElementById('modal-detalles-body');

        if (!window.currentAnalysis) {
            alert('No hay análisis disponible para mostrar detalles.');
            return;
        }

        const analysis = window.currentAnalysis;

        const aiInfoHTML = analysis.ai_model === 'claude-3.5-sonnet'
            ? `<div class="detail-item" style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-left-color: #667eea;">
                <h4>🤖 Análisis con Inteligencia Artificial</h4>
                <p><strong>Modelo:</strong> Claude 3.5 Sonnet</p>
                <p><strong>Proveedor:</strong> Anthropic</p>
                <p><strong>Tipo de análisis:</strong> Inteligencia Artificial generativa</p>
                <p><strong>Capacidades:</strong> Análisis contextual, interpretación de datos y generación de recomendaciones personalizadas basadas en patrones identificados en los datos del endpoint.</p>
            </div>`
            : analysis.ai_model === 'fallback'
            ? `<div class="detail-item" style="background: #fef3c7; border-left-color: #f59e0b;">
                <h4>⚠️ Análisis Básico</h4>
                <p><strong>Tipo:</strong> Algoritmo básico (IA no disponible)</p>
                <p><strong>Motivo:</strong> ${analysis.error || 'IA temporalmente no disponible'}</p>
            </div>`
            : '';

        modalBody.innerHTML = `
            <div class="detail-item">
                <h4>Información General</h4>
                <p><strong>Organización:</strong> ${analysis.organizacion}</p>
                <p><strong>Tema:</strong> ${analysis.tema}</p>
                <p><strong>Fecha:</strong> ${analysis.fecha}</p>
                <p><strong>Resultado Global:</strong> ${analysis.resultado_global}</p>
            </div>

            ${aiInfoHTML}
            
            <div class="detail-item">
                <h4>Resumen Ejecutivo del Análisis (Claude AI)</h4>
                <p>${analysis.resumen_ejecutivo || 'No disponible, verifique la respuesta de la IA.'}</p>
            </div>

            <div class="detail-item">
                <h4>Cobertura de Medios</h4>
                <p><strong>Cantidad:</strong> ${analysis.cobertura_medios || 0} medios</p>
                <p><strong>Estado:</strong> ${analysis.analisis?.cobertura?.estado || 'N/A'}</p>
                <p><strong>Descripción:</strong> Indica cuántos medios de comunicación publicaron información sobre la nota de prensa. Una cobertura alta sugiere que el mensaje tuvo una amplia difusión mediática.</p>
            </div>

            <div class="detail-item">
                <h4>Alcance Estimado</h4>
                <p><strong>Personas Impactadas:</strong> ${(analysis.alcance_estimado || 0).toLocaleString()}</p>
                <p><strong>Estado:</strong> ${analysis.analisis?.alcance?.estado || 'N/A'}</p>
                <p><strong>Descripción:</strong> Estimación del número total de personas que potencialmente vieron o fueron expuestas al mensaje a través de los diferentes medios de comunicación.</p>
            </div>

            <div class="detail-item">
                <h4>Duración en Agenda Mediática</h4>
                <p><strong>Días Activos:</strong> ${analysis.duracion_dias || 0} días</p>
                <p><strong>Estado:</strong> ${analysis.analisis?.duracion?.estado || 'N/A'}</p>
                <p><strong>Descripción:</strong> Tiempo durante el cual la nota de prensa se mantuvo relevante en los medios. Una mayor duración indica que el tema generó interés sostenido.</p>
            </div>

            <div class="detail-item">
                <h4>Engagement en Redes Sociales</h4>
                <p><strong>Interacciones Totales:</strong> ${(analysis.engagement_total || 0).toLocaleString()}</p>
                <p><strong>Estado:</strong> ${analysis.analisis?.engagement?.estado || 'N/A'}</p>
                <p><strong>Descripción:</strong> Suma de todas las interacciones en redes sociales (likes, comentarios, compartidos). Un alto engagement indica que el contenido resonó con la audiencia y generó conversación.</p>
            </div>

            <div class="detail-item">
                <h4>Recomendaciones</h4>
                <p>${generateRecommendations(analysis)}</p>
            </div>
        `;

        modal.style.display = 'block';
    });

    // Función para generar recomendaciones basadas en el análisis
    function generateRecommendations(analysis) {
        let recommendations = [];

        // Usamos encadenamiento opcional para prevenir errores si 'analisis' o sus claves son undefined
        if (analysis.analisis?.cobertura?.estado === 'Malo') {
            recommendations.push('📌 Considere ampliar su lista de contactos de medios y mejorar la segmentación de su audiencia.');
        }

        if (analysis.analisis?.alcance?.estado === 'Malo') {
            recommendations.push('📌 Trabaje en estrategias para llegar a medios con mayor alcance o considere inversión en medios pagados.');
        }

        if (analysis.analisis?.duracion?.estado === 'Malo') {
            recommendations.push('📌 Planifique contenido de seguimiento para mantener la conversación activa por más tiempo.');
        }

        if (analysis.analisis?.engagement?.estado === 'Malo') {
            recommendations.push('📌 Optimice su contenido para redes sociales con llamados a la acción más claros y contenido visual atractivo.');
        }
        
        // El resto de las validaciones de los modals también deben ser robustas.

        if (recommendations.length === 0) {
            return '✅ ¡Excelente trabajo! Su nota de prensa tuvo un desempeño óptimo en todas las métricas. Continúe con esta estrategia.';
        }

        return recommendations.join('<br><br>');
    }

    // 2. COMPARAR CON OTRAS NOTAS
    document.getElementById('btn-comparar').addEventListener('click', function() {
        const modal = document.getElementById('modal-comparar');
        updateComparisonList();
        modal.style.display = 'block';
    });

    document.getElementById('btn-guardar-actual').addEventListener('click', function() {
        if (!window.currentAnalysis) {
            alert('No hay análisis actual para guardar.');
            return;
        }

        savedAnalyses.push({
            ...window.currentAnalysis,
            savedAt: new Date().toISOString()
        });

        localStorage.setItem('savedAnalyses', JSON.stringify(savedAnalyses));
        updateComparisonList();
        alert('Análisis guardado exitosamente.');
    });

    document.getElementById('btn-limpiar-comparacion').addEventListener('click', function() {
        if (confirm('¿Está seguro de que desea eliminar todos los análisis guardados?')) {
            savedAnalyses = [];
            localStorage.removeItem('savedAnalyses');
            updateComparisonList();
        }
    });

    function updateComparisonList() {
        const listDiv = document.getElementById('comparacion-list');
        const chartDiv = document.getElementById('comparison-chart');

        if (savedAnalyses.length === 0) {
            listDiv.innerHTML = '<p class="info-message">Guarde este análisis y agregue más para comparar.</p>';
            chartDiv.innerHTML = '';
            return;
        }

        let html = '<h3>Análisis Guardados (' + savedAnalyses.length + ')</h3>';

        savedAnalyses.forEach((analysis, index) => {
            html += `
                <div class="comparison-item">
                    <div>
                        <h4>${analysis.organizacion} - ${analysis.tema}</h4>
                        <p>Fecha: ${analysis.fecha} | Resultado: ${analysis.resultado_global}</p>
                    </div>
                </div>
            `;
        });

        listDiv.innerHTML = html;

        // Crear tabla comparativa
        if (savedAnalyses.length > 0) {
            chartDiv.innerHTML = '<h3>Comparación de Métricas</h3>' + createComparisonTable();
        }
    }

    function createComparisonTable() {
        let tableHTML = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
        tableHTML += '<thead><tr style="background-color: #f7fafc;">';
        tableHTML += '<th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">Organización</th>';
        tableHTML += '<th style="padding: 12px; border: 1px solid #e2e8f0;">Cobertura</th>';
        tableHTML += '<th style="padding: 12px; border: 1px solid #e2e8f0;">Alcance</th>';
        tableHTML += '<th style="padding: 12px; border: 1px solid #e2e8f0;">Duración</th>';
        tableHTML += '<th style="padding: 12px; border: 1px solid #e2e8f0;">Engagement</th>';
        tableHTML += '<th style="padding: 12px; border: 1px solid #e2e8f0;">Resultado</th>';
        tableHTML += '</tr></thead><tbody>';

        savedAnalyses.forEach(analysis => {
            const resultColor = analysis.resultado_global === 'FUNCIONÓ' ? '#48bb78' : '#f56565';
            tableHTML += '<tr>';
            tableHTML += `<td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>${analysis.organizacion}</strong><br><small>${analysis.tema}</small></td>`;
            tableHTML += `<td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${analysis.cobertura_medios || 0}</td>`;
            tableHTML += `<td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${(analysis.alcance_estimado || 0).toLocaleString()}</td>`;
            tableHTML += `<td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${analysis.duracion_dias || 0}</td>`;
            tableHTML += `<td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${(analysis.engagement_total || 0).toLocaleString()}</td>`;
            tableHTML += `<td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: ${resultColor}; font-weight: bold;">${analysis.resultado_global}</td>`;
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table></div>';
        return tableHTML;
    }

    // 3. SOLICITAR ANÁLISIS COMPLETO
    document.getElementById('btn-analisis-completo').addEventListener('click', function() {
        if (!window.currentAnalysis) {
            alert('No hay análisis disponible para exportar.');
            return;
        }

        const analysis = window.currentAnalysis;

        // Crear contenido del reporte
        let reportContent = `ANÁLISIS COMPLETO DE IMPACTO - NOTA DE PRENSA\n`;
        reportContent += `${'='.repeat(60)}\n\n`;
        reportContent += `INFORMACIÓN GENERAL\n`;
        reportContent += `Organización: ${analysis.organizacion}\n`;
        reportContent += `Tema: ${analysis.tema}\n`;
        reportContent += `Fecha de Publicación: ${analysis.fecha}\n`;
        reportContent += `Fecha de Análisis: ${new Date().toLocaleDateString()}\n`;
        reportContent += `Resultado Global: ${analysis.resultado_global}\n\n`;

        // Agregar información de IA
        if (analysis.ai_model === 'claude-3.5-sonnet') {
            reportContent += `${'='.repeat(60)}\n`;
            reportContent += `ANÁLISIS CON INTELIGENCIA ARTIFICIAL\n`;
            reportContent += `${'='.repeat(60)}\n`;
            reportContent += `Modelo: Claude 3.5 Sonnet\n`;
            reportContent += `Proveedor: Anthropic\n`;
            reportContent += `Tipo: Inteligencia Artificial generativa\n`;
            reportContent += `Capacidades: Análisis contextual, interpretación de datos\n`;
            reportContent += `              y generación de recomendaciones personalizadas\n\n`;
        } else if (analysis.ai_model === 'fallback') {
            reportContent += `NOTA: Análisis básico generado con algoritmo (IA no disponible)\n`;
            reportContent += `Motivo: ${analysis.error || 'IA temporalmente no disponible'}\n\n`;
        }
        
        if (analysis.resumen_ejecutivo) {
            reportContent += `${'='.repeat(60)}\n`;
            reportContent += `RESUMEN EJECUTIVO (ANÁLISIS CLAUDE)\n`;
            reportContent += `${'='.repeat(60)}\n`;
            reportContent += `${analysis.resumen_ejecutivo}\n\n`;
        }

        reportContent += `${'='.repeat(60)}\n`;
        reportContent += `MÉTRICAS DETALLADAS\n`;
        reportContent += `${'='.repeat(60)}\n\n`;

        // Reporte final también debe ser robusto (|| 0)
        reportContent += `1. COBERTURA DE MEDIOS\n`;
        reportContent += `   Cantidad: ${analysis.cobertura_medios || 0} medios\n`;
        reportContent += `   Estado: ${analysis.analisis?.cobertura?.estado || 'N/A'}\n`;
        reportContent += `   Descripción: Indica cuántos medios publicaron sobre la nota.\n\n`;

        reportContent += `2. ALCANCE ESTIMADO\n`;
        reportContent += `   Personas Impactadas: ${(analysis.alcance_estimado || 0).toLocaleString()}\n`;
        reportContent += `   Estado: ${analysis.analisis?.alcance?.estado || 'N/A'}\n`;
        reportContent += `   Descripción: Estimación del número de personas expuestas al mensaje.\n\n`;

        reportContent += `3. DURACIÓN EN AGENDA MEDIÁTICA\n`;
        reportContent += `   Días Activos: ${analysis.duracion_dias || 0}\n`;
        reportContent += `   Estado: ${analysis.analisis?.duracion?.estado || 'N/A'}\n`;
        reportContent += `   Descripción: Tiempo que la nota se mantuvo relevante en medios.\n\n`;

        reportContent += `4. ENGAGEMENT EN REDES SOCIALES\n`;
        reportContent += `   Interacciones Totales: ${(analysis.engagement_total || 0).toLocaleString()}\n`;
        reportContent += `   Estado: ${analysis.analisis?.engagement?.estado || 'N/A'}\n`;
        reportContent += `   Descripción: Suma de interacciones en redes sociales.\n\n`;

        reportContent += `${'='.repeat(60)}\n`;
        reportContent += `RECOMENDACIONES\n`;
        reportContent += `${'='.repeat(60)}\n`;
        reportContent += generateRecommendations(analysis).replace(/<br><br>/g, '\n\n').replace(/📌|✅/g, '');

        // Crear y descargar archivo
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Analisis_Completo_${analysis.organizacion}_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alert('📄 Análisis completo descargado exitosamente.');
    });

    // CERRAR MODALES
    const modals = document.getElementsByClassName('modal');
    const closeButtons = document.getElementsByClassName('close');

    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].onclick = function() {
            this.parentElement.parentElement.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        for (let i = 0; i < modals.length; i++) {
            if (event.target === modals[i]) {
                modals[i].style.display = 'none';
            }
        }
    }

}); // CIERRE DOMContentLoaded