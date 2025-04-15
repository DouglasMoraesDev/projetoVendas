// src/controllers/clientesController.js

const { clientes } = require('../models/clientes');
const { eq } = require('drizzle-orm');

const listarClientes = async (db, req, res) => {
  try {
    const allClientes = await db.select().from(clientes);
    res.json(allClientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
};

const adicionarCliente = async (db, req, res) => {
  const { nome, cpf, endereco, contato } = req.body;
  try {
    const result = await db
      .insert(clientes)
      .values({ nome, cpf, endereco, contato });
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar cliente' });
  }
};

const atualizarCliente = async (db, req, res) => {
  const { id } = req.params;
  const { nome, cpf, endereco, contato } = req.body;
  try {
    await db
      .update(clientes)
      .set({ nome, cpf, endereco, contato })
      .where(eq(clientes.id, Number(id)));
    res.json({ message: 'Cliente atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

const deletarCliente = async (db, req, res) => {
  const { id } = req.params;
  try {
    await db
      .delete(clientes)
      .where(eq(clientes.id, Number(id)));
    res.json({ message: 'Cliente removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
};

module.exports = {
  listarClientes,
  adicionarCliente,
  atualizarCliente,
  deletarCliente
};
