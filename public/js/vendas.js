// public/js/vendas.js
import { apiRequest } from './api.js';

const form = document.getElementById('formVenda');
const selCli = document.getElementById('selectCliente');
const selProd = document.getElementById('selectProduto');
const qtdEl = document.getElementById('qtdVenda');
const precoEl = document.getElementById('precoVenda');
const totalEl = document.getElementById('totalVenda');
const entradaEl = document.getElementById('entradaVenda');
const parcEl = document.getElementById('parcelasVenda');
const dueEl = document.getElementById('dueDay');
const valParEl = document.getElementById('valorParcela');
const obsEl = document.getElementById('obsVenda');
const btnSubmit = document.getElementById('btnSubmitVenda');
const btnCancel = document.getElementById('btnCancelEdit');
const list = document.getElementById('listaVendas');

let clientes = [], produtos = [], vendas = [], editId = null;

// Busca dados iniciais
async function init() {
  clientes = await apiRequest('clientes');
  produtos = await apiRequest('produtos');
  preencherSelects();
  renderVendas();
}

function preencherSelects() {
  selCli.innerHTML = '<option value="">Selecione</option>' +
    clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
  selProd.innerHTML = '<option value="">Selecione</option>' +
    produtos.map(p => `<option value="${p.id}">${p.nome} (Qtd: ${p.qtd})</option>`).join('');
}

function atualizaTotais() {
  const p = produtos.find(x => x.id == selProd.value);
  const preco = p ? parseFloat(p.preco) : 0;
  const qtd = parseInt(qtdEl.value) || 1;
  const total = preco * qtd;
  precoEl.value = total ? total / qtd : '';
  totalEl.value = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const entrada = parseFloat(entradaEl.value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
  const restante = total - entrada;
  const parc = parseInt(parcEl.value) || 1;
  valParEl.value = parc > 0
    ? (restante / parc).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '';
}

async function renderVendas() {
  vendas = await apiRequest('vendas');
  list.innerHTML = vendas.map(v => {
    const cli = clientes.find(c => c.id === v.cliente_id)?.nome || '';
    const prod = produtos.find(p => p.id === v.produto_id);
    const total = prod ? (prod.preco * v.qtd).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) : '';
    const entrada = parseFloat(v.entrada).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
    return `
      <li>
        ${cli} — ${prod?.nome} — Qtd: ${v.qtd} — Entrada: ${entrada} — Parcelas: ${v.parcelas}
        <button onclick="editar(${v.id})">✏️</button>
        <button onclick="deletar(${v.id})">❌</button>
      </li>
    `;
  }).join('');
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    cliente_id: selCli.value,
    produto_id: selProd.value,
    qtd: parseInt(qtdEl.value, 10),
    entrada: parseFloat(entradaEl.value.replace(/[^0-9,]/g, '').replace(',', '.')),
    parcelas: parseInt(parcEl.value, 10),
    due_day: parseInt(dueEl.value, 10),
    obs: obsEl.value.trim()
  };
  if (editId) {
    await apiRequest(`vendas/${editId}`, 'PUT', payload);
    editId = null;
    btnSubmit.textContent = 'Registrar Venda';
    btnCancel.style.display = 'none';
  } else {
    await apiRequest('vendas', 'POST', payload);
  }
  form.reset(); atualizaTotais(); renderVendas();
});

window.editar = id => {
  const v = vendas.find(x => x.id === id);
  selCli.value = v.cliente_id;
  selProd.value = v.produto_id;
  qtdEl.value = v.qtd;
  entradaEl.value = v.entrada;
  parcEl.value = v.parcelas;
  dueEl.value = v.due_day;
  obsEl.value = v.obs || '';
  editId = id;
  btnSubmit.textContent = 'Atualizar Venda';
  btnCancel.style.display = 'inline';
  atualizaTotais();
};

btnCancel.addEventListener('click', () => {
  editId = null;
  form.reset();
  btnSubmit.textContent = 'Registrar Venda';
  btnCancel.style.display = 'none';
  atualizaTotais();
});

[selProd, qtdEl, entradaEl, parcEl].forEach(el => el.addEventListener('input', atualizaTotais));
document.addEventListener('DOMContentLoaded', init);
