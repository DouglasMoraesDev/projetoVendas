// src/controllers/vendasController.js

const { vendas } = require('../models/vendas');
const { produtos } = require('../models/produtos');
const { format } = require('date-fns');
const { eq } = require('drizzle-orm');

const listarVendas = async (db, req, res) => {
  try {
    const allVendas = await db.select().from(vendas);
    res.json(allVendas);
  } catch (err) {
    console.error('Erro ao listar vendas:', err);
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
};

const adicionarVenda = async (db, req, res) => {
  const { cliente_id, produto_id, qtd, entrada, parcelas, due_day, obs } = req.body;

  try {
    // Verifica se há estoque suficiente para a venda
    const [produto] = await db
      .select()
      .from(produtos)
      .where(eq(produtos.id, Number(produto_id)));

    if (!produto || produto.qtd < qtd) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    // Atualiza o estoque do produto
    await db
      .update(produtos)
      .set({ qtd: produto.qtd - qtd })
      .where(eq(produtos.id, Number(produto_id)));

    // Registra a venda com a data atual
    const dataVenda = format(new Date(), 'yyyy-MM-dd');
    const result = await db
      .insert(vendas)
      .values({
        cliente_id,
        produto_id,
        qtd,
        entrada,
        parcelas,
        due_day,
        paid_installments: 0,
        obs,
        data: dataVenda
      });

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao registrar venda:', err);
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
};

const atualizarVenda = async (db, req, res) => {
  const { id } = req.params;
  const { cliente_id, produto_id, qtd, entrada, parcelas, due_day, obs } = req.body;

  try {
    // Se necessário, implemente aqui a lógica para ajustar o estoque conforme a alteração da venda.
    // Neste exemplo, vamos apenas atualizar os dados da venda.
    await db
      .update(vendas)
      .set({
        cliente_id,
        produto_id,
        qtd,
        entrada,
        parcelas,
        due_day,
        obs
      })
      .where(eq(vendas.id, Number(id)));
    res.json({ message: 'Venda atualizada!' });
  } catch (err) {
    console.error('Erro ao atualizar venda:', err);
    res.status(500).json({ error: 'Erro ao atualizar venda' });
  }
};

const deletarVenda = async (db, req, res) => {
  const { id } = req.params;
  try {
    await db
      .delete(vendas)
      .where(eq(vendas.id, Number(id)));
    res.json({ message: 'Venda removida!' });
  } catch (err) {
    console.error('Erro ao deletar venda:', err);
    res.status(500).json({ error: 'Erro ao deletar venda' });
  }
};

module.exports = {
  listarVendas,
  adicionarVenda,
  atualizarVenda,
  deletarVenda
};
