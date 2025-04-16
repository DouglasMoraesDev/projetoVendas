// public/js/auth.js
import { apiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorP = document.getElementById('loginError');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    errorP.textContent = '';
    const username = form.username.value.trim();
    const password = form.password.value;
    try {
      const { token } = await apiRequest('auth/login', 'POST', { username, password });
      localStorage.setItem('token', token);
      window.location.href = 'dashboard.html';
    } catch (err) {
      errorP.textContent = err.message;
    }
  });
});
