// Cuando el documento se carga, se obtienen los emisores y se muestran en la página
document.addEventListener('DOMContentLoaded', function() {
    fetch('/emisores.json')
        .then(response => response.json())
        .then(data => {
            const emisorContainer = document.getElementById('emisor-container');
            emisorContainer.innerHTML = ''; // Asegurarnos de que el contenedor está vacío antes de añadir emisores

            // Añadir emisores al contenedor
            data.forEach((emisor, index) => {
                if (emisor.show) {
                    const emisorDiv = document.createElement('div');
                    emisorDiv.classList.add('emisor-card', getCardClass(emisor.recommendation));
                    emisorDiv.innerHTML = `
                        <h2><center>${emisor.title}</center></h2>
                        <h1><center><p><strong>Recomendación:</strong> <strong class="${getRecommendationClass(emisor.recommendation)}">${emisor.recommendation}</strong></p></center></h1>
                        <p><strong>Precio Actual:</strong> <span class="currency">${formatCurrency(emisor.currentPrice)}</span></p>
                        <p><strong>Precio de Entrada:</strong> <input type="number" value="${emisor.entryPrice}" id="entryPrice${index}"></p>
                        <p><strong>Precio Objetivo:</strong> <input type="number" value="${emisor.targetPrice}" id="targetPrice${index}"></p>
                        <p><strong>Potencial valorización:</strong> <span id="valorization${index}">${calculateValorization(emisor.currentPrice, emisor.targetPrice)}</span></p>
                        <p><strong>Noticias:</strong> ${emisor.news}</p>
                        <p><strong>Sector:</strong> ${emisor.sector}</p>
                        <p><strong>Riesgo político:</strong> ${emisor.politicalRisk}</p>
                        <p><strong>Dividendos Pendientes 2024:</strong> ${emisor.dividends}</p>
                        <h1><center><span id="dividendsValue${index}" class="currency">${formatCurrency(emisor.dividendsValue)}</span></p></center></h1>
                    `;
                    emisorContainer.appendChild(emisorDiv);
                }
            });
        })
        .catch(error => console.error('Error fetching emisores:', error));
});

// Formatea los valores monetarios a la notación colombiana
function formatCurrency(value) {
    if (value === null) return '$ 0';
    return `$ ${value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Calcula la valorización porcentual entre el precio actual y el precio objetivo
function calculateValorization(currentPrice, targetPrice) {
    if (currentPrice === null || targetPrice === null) return '0%';
    const valorization = ((targetPrice - currentPrice) / currentPrice) * 100;
    return valorization.toFixed(2) + '%';
}

// Devuelve la clase CSS adecuada según la recomendación del emisor
function getCardClass(recommendation) {
    if (recommendation.toLowerCase() === 'comprar') {
        return 'card-buy';
    } else if (recommendation.toLowerCase() === 'vender') {
        return 'card-sell';
    } else {
        return 'card-hold';
    }
}

// Devuelve la clase CSS adecuada según la recomendación del emisor para el texto
function getRecommendationClass(recommendation) {
    if (recommendation.toLowerCase() === 'comprar') {
        return 'text-buy';
    } else if (recommendation.toLowerCase() === 'vender') {
        return 'text-sell';
    } else {
        return 'text-hold';
    }
}

// Calcula la comisión basada en la inversión
function calculateCommission(investment) {
    if (investment <= 500000) return 91300 * 1.19;
    if (investment <= 1000000) return 135700 * 1.19;
    if (investment <= 2000000) return 227300 * 1.19;
    if (investment <= 9573333) return 287200 * 1.19;
    return investment * 0.03 * 1.19;
}

// Realiza el cálculo de la inversión y actualiza la tabla de resultados
function calcular() {
    const monto = document.getElementById('monto').value;
    const resultadoTableBody = document.getElementById('resultado-table-body');
    resultadoTableBody.innerHTML = ''; // Limpiar resultados previos

    fetch('/emisores.json')
        .then(response => response.json())
        .then(data => {
            data.forEach((emisor, index) => {
                if (emisor.show) {
                    const targetPrice = document.getElementById(`targetPrice${index}`).value;
                    const entryPrice = document.getElementById(`entryPrice${index}`).value;
                    const dividendsValue = emisor.dividendsValue; // Obtener directamente del JSON

                    const acciones = Math.floor((monto - calculateCommission(monto)) / entryPrice);
                    const valorFinal = (acciones * targetPrice) + (acciones * dividendsValue);
                    const gananciaPerdida = valorFinal - monto - calculateCommission(valorFinal);

                    const row = `
                        <tr>
                            <td>${emisor.title}</td>
                            <td>${formatCurrency(parseInt(monto))}</td>
                            <td>${acciones}</td>
                            <td>${formatCurrency(valorFinal)}</td>
                            <td>${formatCurrency(gananciaPerdida)}</td>
                        </tr>
                    `;

                    resultadoTableBody.innerHTML += row;
                }
            });

            document.getElementById('resultado').style.display = 'block';
        })
        .catch(error => console.error('Error calculating investment:', error));
}
