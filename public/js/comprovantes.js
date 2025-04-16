// public/js/comprovantes.js
import { apiRequest } from './api.js';

async function render() {
  const params = new URLSearchParams(window.location.search);
  const vendaId = params.get('venda_id');
  if (!vendaId) {
    document.getElementById('comprovantes-container').innerHTML = '<p>ID de venda não informado.</p>';
    return;
  }
  const comps = await apiRequest(`comprovantes?venda_id=${vendaId}`);
  document.getElementById('comprovantes-container').innerHTML = comps.map(c => `
    <div class="comprovante-item">
      <a href="${c.url}" target="_blank">Ver comprovante</a>
      <span>${new Date(c.created_at).toLocaleString()}</span>
    </div>
  `).join('') || '<p>Sem comprovantes.</p>';
}

document.addEventListener('DOMContentLoaded', render);
