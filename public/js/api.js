// js/api.js

// URL base da API – ajuste se necessário
const API_URL = 'http://localhost:3000/api';

/**
 * Função que centraliza as requisições à API.
 * @param {string} endpoint - O endpoint da API (ex: 'clientes', 'auth/login').
 * @param {string} [method='GET'] - O método HTTP (GET, POST, PUT, DELETE).
 * @param {object} [data] - Dados a serem enviados (para POST/PUT).
 * @returns {Promise<object>} - A resposta em JSON.
 * @throws {Error} - Caso a requisição retorne erro.
 */
window.apiRequest = async (endpoint, method = 'GET', data) => {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(`${API_URL}/${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro na requisição');
  }
  return response.json();
};
