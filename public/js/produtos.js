// public/js/produtos.js

// 1) URL base do seu backend Express
const API_BASE_URL = 'http://127.0.0.1:3000';

const formProduto     = document.getElementById('formProduto');
const nomeInput       = document.getElementById('nomeProd');
const precoInput      = document.getElementById('precoProd');
const qtdInput        = document.getElementById('qtdProd');
const fotoInput       = document.getElementById('fotoProd');
const btnSalvar       = document.getElementById('btnSalvarProduto');
const listaProdutos   = document.getElementById('listaProdutos');

let editProdutoId = null;

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

precoInput.addEventListener('blur', (e) => {
  let v = e.target.value.replace(/[R$\.\s]/g, '').replace(/,/g, '.');
  const num = parseFloat(v);
  e.target.value = isNaN(num) ? '' : formatter.format(num);
});
precoInput.addEventListener('focus', (e) => {
  let v = e.target.value.replace(/[R$\.\s]/g, '').replace(/,/g, '.');
  e.target.value = v;
});
function parseBRL(v) {
  const num = parseFloat(v.replace(/[R$\.\s]/g, '').replace(/,/g, '.'));
  return isNaN(num) ? 0 : num;
}

// 2) Função genérica de chamada à API, já com host/porta e token
async function apiRequest(endpoint, method, data, isFormData = false) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data)
  };

  const token = localStorage.getItem('token');
  if (token) {
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Status ${res.status}`);
  return res.json();
}

// 3) Busca lista de produtos
async function fetchProdutos() {
  try {
    return await apiRequest('/api/produtos', 'GET');
  } catch (err) {
    console.error('Erro na API:', err);
    return [];
  }
}

// 4) Renderiza os produtos na página
async function renderProdutos() {
  const produtos = await fetchProdutos();
  listaProdutos.innerHTML = '';
  if (produtos.length === 0) {
    listaProdutos.innerHTML = '<li>Nenhum produto encontrado.</li>';
    return;
  }
  produtos.forEach(p => {
    // p.foto já é algo como 'uploads/arquivo.ext'
    const imgUrl = p.foto
      ? `${API_BASE_URL}/${p.foto}`
      : 'https://via.placeholder.com/50';

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${imgUrl}" style="width:50px;height:50px" />
      <span>${p.nome}</span>
      <span>${formatter.format(p.preco)}</span>
      <span>Qtd: ${p.qtd}</span>
      <button onclick="editProduto(${p.id})">✏️</button>
      <button onclick="deleteProduto(${p.id})">❌</button>
    `;
    listaProdutos.appendChild(li);
  });
}

// 5) Envio do formulário para criar/atualizar
formProduto.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome  = nomeInput.value.trim();
  const preco = parseBRL(precoInput.value);
  const qtd   = parseInt(qtdInput.value, 10) || 0;
  const file  = fotoInput.files[0];

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('preco', preco);
  formData.append('qtd', qtd);
  if (file) formData.append('image', file);

  let endpoint = '/api/produtos';
  let method   = 'POST';
  if (editProdutoId) {
    endpoint = `/api/produtos/${editProdutoId}`;
    method   = 'PUT';
  }

  try {
    await apiRequest(endpoint, method, formData, true);
    formProduto.reset();
    editProdutoId = null;
    btnSalvar.textContent = 'Cadastrar';
    renderProdutos();
  } catch (err) {
    console.error('Erro ao salvar produto:', err);
    alert('Houve um erro ao salvar o produto.');
  }
});

// 6) Funções auxiliares de editar e deletar
window.editProduto = async (id) => {
  const produtos = await fetchProdutos();
  const p = produtos.find(x => x.id === id);
  if (!p) return;
  nomeInput.value  = p.nome;
  precoInput.value = formatter.format(p.preco);
  qtdInput.value   = p.qtd;
  editProdutoId    = id;
  btnSalvar.textContent = 'Atualizar';
};

window.deleteProduto = async (id) => {
  if (!confirm('Confirma exclusão deste produto?')) return;
  try {
    await apiRequest(`/api/produtos/${id}`, 'DELETE');
    renderProdutos();
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    alert('Não foi possível excluir o produto.');
  }
};

// 7) Ao carregar a página, já busca e renderiza
document.addEventListener('DOMContentLoaded', renderProdutos);
