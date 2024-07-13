document.addEventListener('DOMContentLoaded', function () {
    fetch('/emisores.json')
        .then(response => response.json())
        .then(emisores => {
            const emisorContainer = document.getElementById('emisor-container');

            emisores.forEach((emisor, i) => {
                const emisorCard = document.createElement('div');
                emisorCard.classList.add('emisor-card');

                emisorCard.innerHTML = `
                    <h2>Emisor ${i + 1}</h2>
                    <div class="form-group">
                        <label for="title-${i}">Título:</label>
                        <input type="text" id="title-${i}" value="${emisor.title || ''}">
                    </div>
                    <div class="form-group">
                        <label for="dividends-${i}">Dividendos Pendientes:</label>
                        <input type="text" id="dividends-${i}" value="${emisor.dividends || ''}">
                    </div>
                    <div class="form-group">
                        <label for="current-price-${i}">Precio Actual:</label>
                        <input type="number" id="current-price-${i}" value="${emisor.currentPrice || ''}">
                    </div>
                    <div class="form-group">
                        <label for="target-price-${i}">Precio Objetivo:</label>
                        <input type="number" id="target-price-${i}" value="${emisor.targetPrice || ''}">
                    </div>
                    <div class="form-group">
                        <label for="news-${i}">Noticias:</label>
                        <input type="text" id="news-${i}" value="${emisor.news || ''}">
                    </div>
                    <div class="form-group">
                        <label for="sector-${i}">Sector:</label>
                        <input type="text" id="sector-${i}" value="${emisor.sector || ''}">
                    </div>
                    <div class="form-group">
                        <label for="political-risk-${i}">Riesgo Político:</label>
                        <input type="text" id="political-risk-${i}" value="${emisor.politicalRisk || ''}">
                    </div>
                    <div class="form-group">
                        <label for="entry-price-${i}">Precio de Entrada:</label>
                        <input type="number" id="entry-price-${i}" value="${emisor.entryPrice || ''}">
                    </div>
                    <div class="form-group">
                        <label for="dividends-value-${i}">Valor de Dividendos:</label>
                        <input type="number" id="dividends-value-${i}" value="${emisor.dividendsValue || ''}">
                    </div>
                    <div class="form-group">
                        <label for="recommendation-${i}">Recomendación:</label>
                        <select id="recommendation-${i}">
                            <option value="Comprar" ${emisor.recommendation === 'Comprar' ? 'selected' : ''}>Comprar</option>
                            <option value="Vender" ${emisor.recommendation === 'Vender' ? 'selected' : ''}>Vender</option>
                            <option value="Mantener" ${emisor.recommendation === 'Mantener' ? 'selected' : ''}>Mantener</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="show-${i}">Mostrar:</label>
                        <input type="checkbox" id="show-${i}" ${emisor.show ? 'checked' : ''}>
                    </div>
                `;
                emisorContainer.appendChild(emisorCard);
            });
        });
});

function guardarDatos() {
    const emisores = Array.from(document.querySelectorAll('.emisor-card')).map((card, i) => ({
        title: document.getElementById(`title-${i}`).value,
        dividends: document.getElementById(`dividends-${i}`).value,
        currentPrice: parseFloat(document.getElementById(`current-price-${i}`).value),
        targetPrice: parseFloat(document.getElementById(`target-price-${i}`).value),
        news: document.getElementById(`news-${i}`).value,
        sector: document.getElementById(`sector-${i}`).value,
        politicalRisk: document.getElementById(`political-risk-${i}`).value,
        entryPrice: parseFloat(document.getElementById(`entry-price-${i}`).value),
        dividendsValue: parseFloat(document.getElementById(`dividends-value-${i}`).value),
        recommendation: document.getElementById(`recommendation-${i}`).value,
        show: document.getElementById(`show-${i}`).checked,
    }));

    fetch('/saveEmisores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emisores),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos guardados:', data);
        alert('Datos guardados exitosamente');
    })
    .catch(error => {
        console.error('Error guardando los datos:', error);
        alert('Error guardando los datos');
    });
}
