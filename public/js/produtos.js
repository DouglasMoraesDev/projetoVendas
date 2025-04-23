import { apiRequest } from './api.js';

const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');
const btn = document.getElementById('btnSalvarProduto');
let editId = null;

// Converte string local (ex: "20.000,00") em número (20000)
function parseBRL(v) {
  // remove tudo que não seja dígito, ponto ou vírgula
  let s = String(v).replace(/[^\d.,]/g, '');
  // tira pontos de milhar e troca vírgula decimal por ponto
  s = s.replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(s) || 0;
}

// Formata número em BRL (ex: 20000 → "R$ 20.000,00")
function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(n);
}

// Ao perder o foco, normaliza+formata
form.precoProd.addEventListener('blur', e => {
  const num = parseBRL(e.target.value);
  e.target.value = formatBRL(num);
});

// Ao focar, desserializa para edição
form.precoProd.addEventListener('focus', e => {
  const num = parseBRL(e.target.value);
  e.target.value = num > 0 ? num.toString() : '';
});

// Busca lista de produtos
async function fetchProdutos() {
  return await apiRequest('produtos');
}

// Renderiza lista
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

// Submete form
form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = new FormData();
  data.append('nome', form.nomeProd.value.trim());

  // Garante valor numérico correto
  const precoNum = parseBRL(form.precoProd.value);
  data.append('preco', precoNum);

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

// Editar produto
window.editar = async id => {
  const produtos = await fetchProdutos();
  const p = produtos.find(x => x.id === id);
  form.nomeProd.value  = p.nome;
  form.precoProd.value = formatBRL(p.preco);
  form.qtdProd.value   = p.qtd;
  editId = id;
  btn.textContent = 'Atualizar';
};

// Deletar produto
window.deletar = async id => {
  if (confirm('Confirma exclusão?')) {
    await apiRequest(`produtos/${id}`, 'DELETE');
    render();
  }
};

document.addEventListener('DOMContentLoaded', render);
