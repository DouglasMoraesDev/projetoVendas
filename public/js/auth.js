// public/js/auth.js
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const data = await window.api.request('auth/login', 'POST', { username, password });
    localStorage.setItem('token', data.token);
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Erro no login:', error);
    loginError.textContent = error.message || 'Falha no login';
  }
});
