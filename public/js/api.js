// public/js/api.js

// determina automaticamente a origem da API (sem CORS extra)
const API_URL = window.location.origin + '/api';

export async function apiRequest(endpoint, method = 'GET', data = null, isFormData = false) {
  const url = `${API_URL}/${endpoint}`;
  const opts = {
    method,
    headers: isFormData
      ? {}
      : { 'Content-Type': 'application/json' },
  };

  const token = localStorage.getItem('token');
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (data) opts.body = isFormData ? data : JSON.stringify(data);

  const res = await fetch(url, opts);
  if (!res.ok) {
    let errMsg = `Erro ${res.status}`;
    try {
      const err = await res.json();
      errMsg = err.error || err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
}
