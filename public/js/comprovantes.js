// public/js/comprovantes.js
import { apiRequest } from './api.js';

async function render() {
  const container = document.getElementById('comprovantes-container');

  try {
    // 1) Pega todos os comprovantes
    const comps = await apiRequest('comprovantes');

    if (!comps.length) {
      container.innerHTML = '<p>Sem comprovantes cadastrados.</p>';
      return;
    }

    // 2) Agrupa por venda_id
    const grouped = comps.reduce((acc, c) => {
      (acc[c.venda_id] = acc[c.venda_id] || []).push(c);
      return acc;
    }, {});

    let html = '';

    // 3) Para cada venda que tem comprovante...
    for (const vendaId of Object.keys(grouped)) {
      // 3.1) Busca dados da venda
      const sale = await apiRequest(`vendas/${vendaId}`);

      html += `
        <section class="venda-comprovantes">
          <h2>
            Venda #${sale.id} — Cliente: ${sale.cliente_name}
          </h2>
      `;

      // 3.2) Lista todos os comprovantes dessa venda
      grouped[vendaId].forEach(c => {
        html += `
          <div class="comprovante-item">
            <a href="${c.url}" target="_blank">Ver comprovante</a>
            <span>${new Date(c.created_at).toLocaleString()}</span>
          </div>
        `;
      });

      html += `</section><hr/>`;
    }

    container.innerHTML = html;
  } catch (err) {
    console.error('Erro ao carregar comprovantes:', err);
    container.innerHTML = '<p>Erro ao carregar comprovantes. Veja o console.</p>';
  }
}

document.addEventListener('DOMContentLoaded', render);
