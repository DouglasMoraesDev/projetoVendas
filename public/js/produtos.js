// public/js/produtos.js

const formProduto = document.getElementById('formProduto');
const nomeInput = document.getElementById('nomeProd');
const precoInput = document.getElementById('precoProd');
const qtdInput = document.getElementById('qtdProd');
const fotoInput = document.getElementById('fotoProd');
const btnSalvar = document.getElementById('btnSalvarProduto');
const listaProdutos = document.getElementById('listaProdutos');
let editProdutoId = null;

// Formatador BRL
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Ao sair do input de preço, formata em BRL
precoInput.addEventListener('blur', (e) => {
  let v = e.target.value.replace(/[R$\.\s]/g, '').replace(/,/g, '.');
  const num = parseFloat(v);
  e.target.value = isNaN(num) ? '' : formatter.format(num);
});

// Ao focar, remove formatação
precoInput.addEventListener('focus', (e) => {
  let v = e.target.value.replace(/[R$\.\s]/g, '').replace(/,/g, '.');
  e.target.value = v;
});

// Converte string BRL para number
function parseBRL(v) {
  const num = parseFloat(v.replace(/[R$\.\s]/g, '').replace(/,/g, '.'));
  return isNaN(num) ? 0 : num;
}

async function fetchProdutos() {
  try {
    return await window.apiRequest('produtos', 'GET');
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function renderProdutos() {
  const produtos = await fetchProdutos();
  listaProdutos.innerHTML = '';

  produtos.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${p.foto || 'https://via.placeholder.com/50'}" class="produto">
      <span>${p.nome}</span>
      <span>${formatter.format(p.preco)}</span>
      <span>Qtd: ${p.qtd}</span>
      <button onclick="editProduto(${p.id})">✏️</button>
      <button onclick="deleteProduto(${p.id})">❌</button>
    `;
    listaProdutos.appendChild(li);
  });
}

formProduto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = nomeInput.value.trim();
  const preco = parseBRL(precoInput.value);
  const qtd = parseInt(qtdInput.value, 10) || 0;
  const file = fotoInput.files[0];

  const processData = async (fotoData) => {
    try {
      const payload = { nome, preco, qtd, foto: fotoData };
      if (editProdutoId) {
        await window.apiRequest(`produtos/${editProdutoId}`, 'PUT', payload);
        editProdutoId = null;
        btnSalvar.textContent = 'Cadastrar';
      } else {
        await window.apiRequest('produtos', 'POST', payload);
      }
      formProduto.reset();
      renderProdutos();
    } catch (err) {
      console.error(err);
    }
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => processData(reader.result);
    reader.readAsDataURL(file);
  } else {
    await processData(null);
  }
});

window.editProduto = async (id) => {
  const produtos = await fetchProdutos();
  const p = produtos.find(x => x.id === id);
  if (!p) return;
  nomeInput.value = p.nome;
  precoInput.value = formatter.format(p.preco);
  qtdInput.value = p.qtd;
  editProdutoId = id;
  btnSalvar.textContent = 'Atualizar';
};

window.deleteProduto = async (id) => {
  try {
    await window.apiRequest(`produtos/${id}`, 'DELETE');
    renderProdutos();
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener('DOMContentLoaded', renderProdutos);