const formCliente = document.getElementById('formCliente');
const listaClientes = document.getElementById('listaClientes');
const btnSalvarCliente = document.getElementById('btnSalvarCliente');
let editClienteId = null;

async function fetchClientes() {
  try {
    return await window.apiRequest('clientes', 'GET');
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function renderClientes() {
  try {
    const clientes = await fetchClientes();
    listaClientes.innerHTML = '';
    clientes.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${c.nome}</strong></span> -
        <span>CPF: ${c.cpf}</span> -
        <span>Endereço: ${c.endereco}</span> -
        <span>Contato: ${c.contato}</span>
        <button onclick="editCliente(${c.id})">✏️</button>
        <button onclick="deleteCliente(${c.id})">❌</button>
      `;
      listaClientes.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

formCliente.addEventListener('submit', async e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const contato = document.getElementById('contato').value.trim();

  try {
    if (editClienteId) {
      await window.apiRequest(`clientes/${editClienteId}`, 'PUT', { nome, cpf, endereco, contato });
      editClienteId = null;
      btnSalvarCliente.textContent = 'Adicionar Cliente';
    } else {
      await window.apiRequest('clientes', 'POST', { nome, cpf, endereco, contato });
    }
    formCliente.reset();
    renderClientes();
  } catch (error) {
    console.error(error);
  }
});

window.editCliente = async function(id) {
  try {
    const clientes = await fetchClientes();
    const c = clientes.find(cliente => cliente.id === id);
    if (!c) return;
    document.getElementById('nome').value = c.nome;
    document.getElementById('cpf').value = c.cpf;
    document.getElementById('endereco').value = c.endereco;
    document.getElementById('contato').value = c.contato;
    editClienteId = id;
    btnSalvarCliente.textContent = 'Atualizar Cliente';
  } catch (error) {
    console.error(error);
  }
};

window.deleteCliente = async function(id) {
  try {
    await window.apiRequest(`clientes/${id}`, 'DELETE');
    renderClientes();
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', renderClientes);