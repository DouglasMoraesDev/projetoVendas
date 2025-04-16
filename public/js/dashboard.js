// public/js/dashboard.js
import { apiRequest } from './api.js';

async function loadDashboard() {
  try {
    const stats = await apiRequest('dashboard');
    document.getElementById('welcome').innerText = stats.welcome;
    document.getElementById('total-clientes').innerText = stats.clientes;
    document.getElementById('total-produtos').innerText = stats.produtos;
    document.getElementById('total-vendas').innerText = stats.vendas;

    const notifEl = document.getElementById('notificacoes');
    notifEl.innerHTML = stats.notifications.length
      ? stats.notifications.map(n => `<li>${n}</li>`).join('')
      : '<li>Sem notificações hoje.</li>';
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadDashboard);
