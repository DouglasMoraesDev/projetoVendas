// public/js/clientes.js
import { apiRequest } from './api.js';

const form = document.getElementById('formCliente');
const lista = document.getElementById('listaClientes');
let editId = null;

async function fetchClientes() {
  return await apiRequest('clientes');
}

async function renderClientes() {
  const clientes = await fetchClientes();
  lista.innerHTML = clientes.map(c => `
    <li>
      <strong>${c.nome}</strong> —
      CPF: ${c.cpf} — Endereço: ${c.endereco} — Contato: ${c.contato}
      <button onclick="editar(${c.id})">✏️</button>
      <button onclick="deletar(${c.id})">❌</button>
    </li>
  `).join('');
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    nome: form.nome.value.trim(),
    cpf: form.cpf.value.trim(),
    endereco: form.endereco.value.trim(),
    contato: form.contato.value.trim(),
  };
  if (editId) {
    await apiRequest(`clientes/${editId}`, 'PUT', data);
    editId = null;
    form.querySelector('button').textContent = 'Adicionar Cliente';
  } else {
    await apiRequest('clientes', 'POST', data);
  }
  form.reset();
  renderClientes();
});

window.editar = async id => {
  const clientes = await fetchClientes();
  const c = clientes.find(x => x.id === id);
  form.nome.value = c.nome;
  form.cpf.value = c.cpf;
  form.endereco.value = c.endereco;
  form.contato.value = c.contato;
  editId = id;
  form.querySelector('button').textContent = 'Atualizar Cliente';
};

window.deletar = async id => {
  await apiRequest(`clientes/${id}`, 'DELETE');
  renderClientes();
};

document.addEventListener('DOMContentLoaded', renderClientes);
