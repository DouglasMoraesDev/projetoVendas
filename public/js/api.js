// public/js/api.js

const API_URL = 'http://localhost:3000/api';

/**
 * Centraliza chamadas à API.
 * @param {string} endpoint — ex: 'vendas', 'vendas/1/recibo'
 * @param {string} [method='GET']
 * @param {object} [data]
 */
export async function apiRequest(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_URL}/${endpoint}`, options);
  if (!res.ok) {
    let msg = 'Erro na requisição';
    try {
      const errJson = await res.json();
      msg = errJson.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
