// js/comprovantes.js

async function renderComprovantes() {
  try {
    // Pode ser ajustado para filtrar por venda: ex. 'comprovantes/1'
    const comprovantesData = await window.apiRequest('comprovantes', 'GET');
    const container = document.getElementById('listaComprovantes');
    container.innerHTML = '';
    
    comprovantesData.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card comprovante-card';
      card.innerHTML = `
        <p><strong>Venda ID:</strong> ${c.venda_id}</p>
        <img src="${c.imagem}" alt="Comprovante" class="proof-img">
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao renderizar comprovantes:', error);
  }
}

document.addEventListener('DOMContentLoaded', renderComprovantes);
