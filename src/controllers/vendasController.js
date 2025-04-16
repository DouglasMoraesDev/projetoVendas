// src/controllers/vendasController.js
import { vendas } from '../models/vendas.js';
import { produtos } from '../models/produtos.js';
import { clientes } from '../models/clientes.js';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';

export async function listarVendas(db, req, res) {
  try {
    const all = await db.select().from(vendas);
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
}

export async function adicionarVenda(db, req, res) {
  const { cliente_id, produto_id, qtd, entrada, parcelas, due_day, obs } = req.body;
  try {
    const [prod] = await db.select().from(produtos).where(eq(produtos.id, Number(produto_id)));
    if (!prod || prod.qtd < qtd) return res.status(400).json({ error: 'Estoque insuficiente' });

    const [cli] = await db.select().from(clientes).where(eq(clientes.id, Number(cliente_id)));
    await db.update(produtos).set({ qtd: prod.qtd - qtd }).where(eq(produtos.id, Number(produto_id)));

    const dataVenda = format(new Date(), 'yyyy-MM-dd');
    const result = await db.insert(vendas).values({
      cliente_id,
      produto_id,
      cliente_name: cli.nome,
      produto_name: prod.nome,
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
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
}

export async function gerarRecibo(db, req, res) {
  try {
    const { id } = req.params;
    const [v] = await db.select().from(vendas).where(eq(vendas.id, Number(id)));
    if (!v) return res.status(404).json({ error: 'Venda não encontrada' });

    const [prod] = await db.select().from(produtos).where(eq(produtos.id, v.produto_id));
    const valorTotal = (prod.preco || 0) * v.qtd;
    const valorParcela = (valorTotal - v.entrada) / v.parcelas;
    const numParcela = v.paid_installments + 1;

    res.json({
      cliente: v.cliente_name,
      cpf: cli?.cpf ?? '—',
      valor_parcela: valorParcela,
      num_parcela: numParcela,
      produto: v.produto_name,
      data_venda: v.data,
      valor_entrada: v.entrada,
      valor_total: valorTotal,
      observacoes: v.obs,
      local: 'Campos do Jordão',
      data_emissao: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar recibo' });
  }
}

export async function atualizarVenda(db, req, res) {
  const { id } = req.params;
  const { cliente_id, produto_id, qtd, entrada, parcelas, due_day, obs } = req.body;
  try {
    await db
      .update(vendas)
      .set({ cliente_id, produto_id, qtd, entrada, parcelas, due_day, obs })
      .where(eq(vendas.id, Number(id)));
    res.json({ message: 'Venda atualizada!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar venda' });
  }
}

export async function deletarVenda(db, req, res) {
  const { id } = req.params;
  try {
    await db.delete(vendas).where(eq(vendas.id, Number(id)));
    res.json({ message: 'Venda removida!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar venda' });
  }
}
