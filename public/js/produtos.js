// public/js/produtos.js
import { apiRequest } from './api.js';

const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');
const btn = document.getElementById('btnSalvarProduto');
let editId = null;

// Converte string BRL ("R$ 20.000,00") em número (20000)
function parseBRL(v) {
  let s = String(v).replace(/[^\d.,]/g, '');
  s = s.replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(s) || 0;
}

// Formata número em BRL (20000 → "R$ 20.000,00")
function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(n);
}

// Eventos de formatação no campo preço
form.precoProd.addEventListener('blur', e => {
  const num = parseBRL(e.target.value);
  e.target.value = formatBRL(num);
});
form.precoProd.addEventListener('focus', e => {
  const num = parseBRL(e.target.value);
  e.target.value = num > 0 ? num.toString() : '';
});

// Busca lista de produtos
async function fetchProdutos() {
  return await apiRequest('produtos');
}

// Renderiza a lista na tela
async function render() {
  const produtos = await fetchProdutos();
  lista.innerHTML = produtos.map(p => {
    const imgUrl = p.foto
      ? `/uploads/produtos/${p.foto}`
      : 'https://via.placeholder.com/50';
    return `
      <li>
        <img src="${imgUrl}" width="50" height="50" />
        ${p.nome} — ${formatBRL(p.preco)} — Qtd: ${p.qtd}
        <button onclick="editar(${p.id})">✏️</button>
        <button onclick="deletar(${p.id})">❌</button>
      </li>
    `;
  }).join('') || '<li>Nenhum produto encontrado.</li>';
}

// Envio do formulário (criar ou editar)
form.addEventListener('submit', async e => {
  e.preventDefault();

  // Monta o objeto JSON com dados textuais
  const body = {
    nome: form.nomeProd.value.trim(),
    preco: parseBRL(form.precoProd.value),
    qtd: form.qtdProd.value
  };

  // Se houver arquivo de foto, faz upload primeiro
  if (form.fotoProd.files[0]) {
    const fm = new FormData();
    fm.append('file', form.fotoProd.files[0]);

    const uploadRes = await fetch(`${location.origin}/api/upload?type=produto`, {
      method: 'POST',
      body: fm
    });
    const { filename } = await uploadRes.json();
    body.foto = filename;
  }

  // Chama a API de produtos com JSON
  if (editId) {
    await apiRequest(`produtos/${editId}`, 'PUT', body);
    editId = null;
    btn.textContent = 'Cadastrar';
  } else {
    await apiRequest('produtos', 'POST', body);
  }

  form.reset();
  render();
});

// Função global para iniciar edição
window.editar = async id => {
  const produtos = await fetchProdutos();
  const p = produtos.find(x => x.id === id);
  form.nomeProd.value  = p.nome;
  form.precoProd.value = formatBRL(p.preco);
  form.qtdProd.value   = p.qtd;
  editId = id;
  btn.textContent = 'Atualizar';
};

// Função global para deletar
window.deletar = async id => {
  if (confirm('Confirma exclusão?')) {
    await apiRequest(`produtos/${id}`, 'DELETE');
    render();
  }
};

// Carrega a lista ao abrir a página
document.addEventListener('DOMContentLoaded', render);
