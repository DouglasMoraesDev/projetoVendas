// produtos.js

const formProduto = document.getElementById('formProduto');
const nomeInput = document.getElementById('nomeProd');
const precoInput = document.getElementById('precoProd');
const qtdInput = document.getElementById('qtdProd');
const fotoInput = document.getElementById('fotoProd');
const btnSalvar = document.getElementById('btnSalvarProduto');
const listaProdutos = document.getElementById('listaProdutos');
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

// Requisição genérica
async function apiRequest(url, method, data, isFormData = false) {
  const options = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data)
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('Erro na requisição');
    return await res.json();
  } catch (error) {
    console.error('Erro na API:', error.message);
    alert('Houve um erro na requisição. Tente novamente mais tarde.');
    throw error;
  }
}

// Buscar produtos
async function fetchProdutos() {
  try {
    return await apiRequest('/api/produtos', 'GET');
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Renderizar lista de produtos
async function renderProdutos() {
  const produtos = await fetchProdutos();
  listaProdutos.innerHTML = '';

  if (produtos.length === 0) {
    listaProdutos.innerHTML = '<li>Nenhum produto encontrado.</li>';
    return;
  }

  produtos.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${p.foto ? '/uploads/' + p.foto : 'https://via.placeholder.com/50'}" class="produto" style="width:50px;height:50px">
      <span>${p.nome}</span>
      <span>${formatter.format(p.preco)}</span>
      <span>Qtd: ${p.qtd}</span>
      <button onclick="editProduto(${p.id})">✏️</button>
      <button onclick="deleteProduto(${p.id})">❌</button>
    `;
    listaProdutos.appendChild(li);
  });
}

// Submissão do formulário
formProduto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = nomeInput.value.trim();
  const preco = parseBRL(precoInput.value);
  const qtd = parseInt(qtdInput.value, 10) || 0;
  const file = fotoInput.files[0];

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('preco', preco);
  formData.append('qtd', qtd);
  if (file) {
    formData.append('image', file);
  }

  let url = '/api/produtos';
  let method = 'POST';
  if (editProdutoId) {
    url = `/api/produtos/${editProdutoId}`;
    method = 'PUT';
  }

  try {
    await apiRequest(url, method, formData, true);
    formProduto.reset();
    editProdutoId = null;
    btnSalvar.textContent = 'Cadastrar';
    renderProdutos();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar produto!');
  }
});

// Editar produto
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

// Deletar produto
window.deleteProduto = async (id) => {
  try {
    await apiRequest(`/api/produtos/${id}`, 'DELETE');
    renderProdutos();
  } catch (err) {
    console.error(err);
    alert('Erro ao excluir produto!');
  }
};

// Chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', renderProdutos);
