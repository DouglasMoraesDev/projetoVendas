// js/vendas.js

const formVenda = document.getElementById('formVenda');
const selectCliente = document.getElementById('selectCliente');
const selectProduto = document.getElementById('selectProduto');
const precoVenda = document.getElementById('precoVenda');
const qtdVenda = document.getElementById('qtdVenda');
const totalVenda = document.getElementById('totalVenda');
const entradaVenda = document.getElementById('entradaVenda');
const parcelasVenda = document.getElementById('parcelasVenda');
const dueDayInput = document.getElementById('dueDay');
const valorParcela = document.getElementById('valorParcela');
const tituloVenda = document.getElementById('tituloVenda');
const obsVenda = document.getElementById('obsVenda');
const btnSubmitVenda = document.getElementById('btnSubmitVenda');

let clientesV = [];
let produtosV = [];
let editVendaId = null;

async function fetchClientes() {
  try {
    return await window.apiRequest('clientes', 'GET');
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchProdutos() {
  try {
    return await window.apiRequest('produtos', 'GET');
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Preenche os selects com clientes e produtos
 */
async function populateSelects() {
  try {
    clientesV = await fetchClientes();
    produtosV = await fetchProdutos();
    selectCliente.innerHTML = '<option value="">Selecione o Cliente</option>';
    clientesV.forEach(c => {
      selectCliente.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
    });
    selectProduto.innerHTML = '<option value="">Selecione a mercadoria</option>';
    produtosV.forEach(p => {
      selectProduto.innerHTML += `<option value="${p.id}">${p.nome} (Qtd: ${p.qtd})</option>`;
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Atualiza os totais (valor unitário, total, valor da parcela) conforme seleção e inputs
 */
function updateTotals() {
  const prod = produtosV.find(p => p.id == selectProduto.value);
  const precoNum = prod ? parseFloat(prod.preco) : 0;
  precoVenda.value = precoNum.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });

  const qtd = parseInt(qtdVenda.value, 10) || 1;
  const total = precoNum * qtd;
  totalVenda.value = total.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });

  const entradaNum = parseFloat(entradaVenda.value.replace(/\./g,'').replace(',','.')) || 0;
  const restante = total - entradaNum;
  const parcelas = parseInt(parcelasVenda.value, 10) || 1;
  valorParcela.value = parcelas > 0 ? (restante / parcelas).toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) : '';
}

selectProduto.addEventListener('change', updateTotals);
[qtdVenda, entradaVenda, parcelasVenda].forEach(el => el.addEventListener('input', updateTotals));

formVenda.addEventListener('submit', async e => {
  e.preventDefault();
  const cid = selectCliente.value;
  const pid = selectProduto.value;
  const qtd = parseInt(qtdVenda.value, 10);
  const entrada = parseFloat(entradaVenda.value.replace(/\./g,'').replace(',','.')) || 0;
  const parcelas = parseInt(parcelasVenda.value, 10) || 1;
  const dueDay = parseInt(dueDayInput.value, 10) || 1;
  const obs = obsVenda.value.trim();

  if (!cid || !pid || qtd < 1 || dueDay < 1 || dueDay > 28) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const vendaData = { cliente_id: cid, produto_id: pid, qtd, entrada, parcelas, due_day: dueDay, obs };

  try {
    if (!editVendaId) {
      // Registra a nova venda
      await window.apiRequest('vendas', 'POST', vendaData);
    } else {
      // Se necessário, implementar endpoint PUT para editar a venda
      alert('Edição de venda ainda não implementada');
      return;
    }
    formVenda.reset();
    updateTotals();
    populateSelects();
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener('DOMContentLoaded', populateSelects);
