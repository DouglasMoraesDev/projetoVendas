// js/vendas.js

// Seleção dos elementos do formulário e da listagem
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
const obsVenda = document.getElementById('obsVenda');
const btnSubmitVenda = document.getElementById('btnSubmitVenda');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const vendasList = document.getElementById('listaVendas');

let clientesV = [];
let produtosV = [];
let vendasData = [];
let editVendaId = null;

// Função para buscar clientes via API
async function fetchClientes() {
  try {
    return await window.apiRequest('clientes', 'GET');
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

// Função para buscar produtos via API
async function fetchProdutos() {
  try {
    return await window.apiRequest('produtos', 'GET');
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

// Função para buscar vendas via API
async function fetchVendas() {
  try {
    return await window.apiRequest('vendas', 'GET');
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return [];
  }
}

/**
 * Preenche os selects de clientes e produtos
 */
async function populateSelects() {
  try {
    clientesV = await fetchClientes();
    produtosV = await fetchProdutos();
    selectCliente.innerHTML = '<option value="">Selecione o Cliente</option>';
    clientesV.forEach(c => {
      selectCliente.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
    });
    selectProduto.innerHTML = '<option value="">Selecione o Produto</option>';
    produtosV.forEach(p => {
      selectProduto.innerHTML += `<option value="${p.id}">${p.nome} (Qtd: ${p.qtd})</option>`;
    });
  } catch (error) {
    console.error('Erro ao popular selects:', error);
  }
}

/**
 * Atualiza os valores de preço, total e valor da parcela
 */
function updateTotals() {
  const prod = produtosV.find(p => p.id == selectProduto.value);
  const precoNum = prod ? parseFloat(prod.preco) : 0;
  precoVenda.value = precoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const qtd = parseInt(qtdVenda.value, 10) || 1;
  const total = precoNum * qtd;
  totalVenda.value = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const entradaNum = parseFloat(entradaVenda.value.replace(/\./g, '').replace(',', '.')) || 0;
  const restante = total - entradaNum;
  const parcelas = parseInt(parcelasVenda.value, 10) || 1;
  valorParcela.value = parcelas > 0 ? (restante / parcelas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
}

selectProduto.addEventListener('change', updateTotals);
[qtdVenda, entradaVenda, parcelasVenda].forEach(el => el.addEventListener('input', updateTotals));

/**
 * Renderiza a lista de vendas com botões de editar e deletar
 */
async function renderVendas() {
  try {
    vendasData = await fetchVendas();
    vendasList.innerHTML = '';
    vendasData.forEach(v => {
      const li = document.createElement('li');
      li.innerHTML = `
        Cliente: ${v.cliente_id} | Produto: ${v.produto_id} | Qtd: ${v.qtd} | Entrada: ${parseFloat(v.entrada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} | Parcelas: ${v.parcelas} | Dia: ${v.due_day} | Obs: ${v.obs || ''}
        <button onclick="editarVenda(${v.id})">Editar</button>
        <button onclick="deletarVenda(${v.id})">Excluir</button>
      `;
      vendasList.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao renderizar vendas:', error);
  }
}

/**
 * Prepara o formulário para edição da venda
 */
function editarVenda(id) {
  const venda = vendasData.find(v => v.id === id);
  if (!venda) return;
  editVendaId = venda.id;
  selectCliente.value = venda.cliente_id;
  selectProduto.value = venda.produto_id;
  qtdVenda.value = venda.qtd;
  updateTotals();
  entradaVenda.value = venda.entrada;
  parcelasVenda.value = venda.parcelas;
  dueDayInput.value = venda.due_day;
  obsVenda.value = venda.obs || '';
  btnSubmitVenda.textContent = 'Atualizar Venda';
  btnCancelEdit.style.display = 'inline-block';
}

/**
 * Cancela o modo de edição e limpa o formulário
 */
function cancelarEdicao() {
  editVendaId = null;
  formVenda.reset();
  btnSubmitVenda.textContent = 'Registrar Venda';
  btnCancelEdit.style.display = 'none';
  updateTotals();
}

/**
 * Trata o envio do formulário (nova venda ou atualização)
 */
formVenda.addEventListener('submit', async e => {
  e.preventDefault();

  const cid = selectCliente.value;
  const pid = selectProduto.value;
  const qtd = parseInt(qtdVenda.value, 10);
  const entrada = parseFloat(entradaVenda.value.replace(/\./g, '').replace(',', '.')) || 0;
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
      await window.apiRequest('vendas', 'POST', vendaData);
    } else {
      await window.apiRequest(`vendas/${editVendaId}`, 'PUT', vendaData);
    }
    cancelarEdicao();
    formVenda.reset();
    updateTotals();
    populateSelects();
    renderVendas();
  } catch (error) {
    console.error('Erro ao salvar venda:', error);
  }
});

/**
 * Deleta uma venda
 */
async function deletarVenda(id) {
  if (confirm('Tem certeza que deseja deletar esta venda?')) {
    try {
      await window.apiRequest(`vendas/${id}`, 'DELETE');
      renderVendas();
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
    }
  }
}

btnCancelEdit.addEventListener('click', cancelarEdicao);

// Inicializa os selects e a listagem de vendas após o carregamento do DOM
document.addEventListener('DOMContentLoaded', async () => {
  await populateSelects();
  renderVendas();
});
