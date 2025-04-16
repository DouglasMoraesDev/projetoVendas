// public/js/comprovantes.js
import { request } from './api.js';

async function renderComprovantes() {
  try {
    const params = new URLSearchParams(window.location.search);
    const vendaId = params.get('venda_id');
    if (!vendaId) {
      throw new Error('ID de venda não informado.');
    }
    const comprovantes = await request(`comprovantes?venda_id=${vendaId}`);
    const container = document.getElementById('comprovantes-container');
    if (!container) {
      throw new Error('Elemento #comprovantes-container não encontrado no DOM.');
    }
    container.innerHTML = comprovantes
      .map(c => `
        <div class="comprovante-item">
          <a href="${c.url}" target="_blank">Visualizar comprovante</a>
          <span>${new Date(c.created_at).toLocaleString()}</span>
        </div>
      `)
      .join('');
  } catch (err) {
    console.error('Erro ao renderizar comprovantes:', err);
    const container = document.getElementById('comprovantes-container');
    if (container) container.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

window.addEventListener('DOMContentLoaded', renderComprovantes);