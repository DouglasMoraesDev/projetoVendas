// src/controllers/produtosController.js

const { produtos } = require('../models/produtos');
const { eq } = require('drizzle-orm');

const listarProdutos = async (db, req, res) => {
  try {
    const all = await db.select().from(produtos);
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

const adicionarProduto = async (db, req, res) => {
  const { nome, preco, qtd, foto } = req.body;
  try {
    await db.insert(produtos).values({ nome, preco, qtd, foto });
    res.status(201).json({ message: 'Produto criado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar produto' });
  }
};

const atualizarProduto = async (db, req, res) => {
  const { id } = req.params;
  const { nome, preco, qtd, foto } = req.body;
  try {
    await db
      .update(produtos)
      .set({ nome, preco, qtd, foto })
      .where(eq(produtos.id, Number(id)));
    res.json({ message: 'Produto atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

const deletarProduto = async (db, req, res) => {
  const { id } = req.params;
  try {
    await db.delete(produtos).where(eq(produtos.id, Number(id)));
    res.json({ message: 'Produto removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};

module.exports = {
  listarProdutos,
  adicionarProduto,
  atualizarProduto,
  deletarProduto
};