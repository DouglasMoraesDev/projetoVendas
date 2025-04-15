// js/comprovantes.js

// Exibe todos os comprovantes vinculados às vendas
async function renderComprovantes() {
    try {
      const comprovantesData = await window.apiRequest('comprovantes', 'GET'); // opcional: pode filtrar por venda_id
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
      console.error(error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', renderComprovantes);
  