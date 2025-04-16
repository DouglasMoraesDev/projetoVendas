// public/js/produtos.js
import { apiRequest } from './api.js';

const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');
const btn = document.getElementById('btnSalvarProduto');
let editId = null;

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(parseFloat(v) || 0);
}

// Monitora formatação de preço
form.precoProd.addEventListener('blur', e => {
  e.target.value = formatBRL(e.target.value);
});
form.precoProd.addEventListener('focus', e => {
  e.target.value = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
});

async function fetchProdutos() {
  return await apiRequest('produtos');
}

async function render() {
  const produtos = await fetchProdutos();
  lista.innerHTML = produtos.map(p => {
    const img = p.foto ? `/uploads/${p.foto}` : 'https://via.placeholder.com/50';
    return `
      <li>
        <img src="${img}" width="50" height="50" />
        ${p.nome} — ${formatBRL(p.preco)} — Qtd: ${p.qtd}
        <button onclick="editar(${p.id})">✏️</button>
        <button onclick="deletar(${p.id})">❌</button>
      </li>
    `;
  }).join('') || '<li>Nenhum produto encontrado.</li>';
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData();
  data.append('nome', form.nomeProd.value.trim());
  data.append('preco', form.precoProd.value.replace(/[^0-9.,]/g, '').replace(',', '.'));
  data.append('qtd', form.qtdProd.value);
  if (form.fotoProd.files[0]) data.append('image', form.fotoProd.files[0]);

  if (editId) {
    await apiRequest(`produtos/${editId}`, 'PUT', data, true);
    editId = null;
    btn.textContent = 'Cadastrar';
  } else {
    await apiRequest('produtos', 'POST', data, true);
  }
  form.reset();
  render();
});

window.editar = async id => {
  const produtos = await fetchProdutos();
  const p = produtos.find(x => x.id === id);
  form.nomeProd.value = p.nome;
  form.precoProd.value = formatBRL(p.preco);
  form.qtdProd.value = p.qtd;
  editId = id;
  btn.textContent = 'Atualizar';
};

window.deletar = async id => {
  if (confirm('Confirma exclusão?')) {
    await apiRequest(`produtos/${id}`, 'DELETE');
    render();
  }
};

document.addEventListener('DOMContentLoaded', render);
