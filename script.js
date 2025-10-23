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
    .then(response => {
        if (!response.ok) {
          throw new Error(`Error en el servidor de análisis (HTTP Status: ${response.status})`);
        }
        return response.json();
    })
    .then(analysisResult => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        document.getElementById('res-organizacion').textContent = analysisResult.organizacion || "No Proporcionado";
        document.getElementById('res-tema').textContent = analysisResult.tema || "No Proporcionado";
       
        const globalResultDiv = document.getElementById('global-result');
        globalResultDiv.textContent = `Resultado Global: ${analysisResult.resultado_global}`;
        globalResultDiv.className = analysisResult.resultado_global === 'FUNCIONÓ' ? 'global-result verde' : 'global-result rojo';

        const metricsOutput = document.getElementById('metrics-output');
        const metrics = {
            'Cobertura de Medios': analysisResult.cobertura_medios.toLocaleString(),
            'Alcance Estimado': analysisResult.alcance_estimado.toLocaleString(),
            'Duración en Días': analysisResult.duracion_dias,
            'Engagement Total': analysisResult.engagement_total.toLocaleString()
        };

        const analysisDetail = analysisResult.analisis;
        
        for (const key in analysisDetail) {
            const detail = analysisDetail[key];
            let metricDisplayName = key.charAt(0).toUpperCase() + key.slice(1); 

            if (key === 'cobertura') metricDisplayName = 'Cobertura de Medios';
            if (key === 'alcance') metricDisplayName = 'Alcance Estimado';
            if (key === 'duracion') metricDisplayName = 'Duración en Días';

            let metricValue = metrics[metricDisplayName] || '';

            metricsOutput.innerHTML += `
                <div class="metric-box ${detail.color}">
                    <strong>${metricDisplayName}:</strong> ${metricValue} 
                    (<small>Estado: ${detail.estado}</small>)
                </div>
            `;
        }

    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').innerHTML = `<h2 style="color:red;">Error en el Análisis</h2><p>No se pudo completar la solicitud. Verifique que el workflow de n8n esté **ACTIVO**.</p><p>Detalle: ${error.message}</p>`;
        console.error('Fetch error:', error);
    });
});