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
          <div class="comprovante-item" style="margin-bottom:1rem;">
            <!-- miniatura inline -->
            <img 
              src="${c.url}" 
              alt="Comprovante #${c.id}" 
              style="max-width:200px; max-height:200px; object-fit:contain; border:1px solid #ccc; border-radius:4px;"
            />
            <div>
              <span><strong>Enviado em:</strong> ${new Date(c.created_at).toLocaleString('pt-BR')}</span>
            </div>
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
