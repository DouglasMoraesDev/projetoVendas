// public/js/dashboard.js
import { apiRequest } from './api.js';

document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

async function load() {
  try {
    const stats = await apiRequest('dashboard');
    document.getElementById('welcome').innerText = stats.welcome;
    document.getElementById('total-clientes').innerText = stats.clientes;
    document.getElementById('total-produtos').innerText = stats.produtos;
    document.getElementById('total-vendas').innerText = stats.vendas;
    const notifEl = document.getElementById('notificacoes');
    notifEl.innerHTML = stats.notifications.length
      ? stats.notifications.map(n => `<li>${n}</li>`).join('')
      : '<li>Sem notificações.</li>';
  } catch {
    // Caso token inválido, redireciona para login
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', load);
