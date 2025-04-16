// public/js/api.js
// Função genérica para chamadas à API (usa sempre /api como prefixo)
export async function apiRequest(endpoint, method = 'GET', data = null, isFormData = false) {
  const url = `${window.location.origin}/api/${endpoint}`;
  const opts = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  };

  const token = localStorage.getItem('token');
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (data) opts.body = isFormData ? data : JSON.stringify(data);

  const res = await fetch(url, opts);
  if (!res.ok) {
    let errMsg = `Erro ${res.status}`;
    try { const err = await res.json(); errMsg = err.error || err.message; } catch {}
    throw new Error(errMsg);
  }
  return res.json();
}
