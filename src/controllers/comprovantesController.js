// src/controllers/comprovantesController.js
import { comprovantes } from '../models/comprovantes.js';
import { vendas } from '../models/vendas.js';
import { eq } from 'drizzle-orm';

export async function adicionarComprovante(db, req, res) {
  const { venda_id } = req.body;
  const imagem = req.file?.path ?? req.body.imagem;
  try {
    const result = await db.insert(comprovantes).values({ venda_id, imagem });
    const [sale] = await db
      .select()
      .from(vendas)
      .where(eq(vendas.id, Number(venda_id)));
    if (sale && sale.paid_installments < sale.parcelas) {
      await db
        .update(vendas)
        .set({ paid_installments: sale.paid_installments + 1 })
        .where(eq(vendas.id, Number(venda_id)));
    }
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao adicionar comprovante:', err);
    res.status(500).json({ error: 'Erro ao adicionar comprovante' });
  }
}

export async function listarComprovantes(db, req, res) {
  const vendaId = req.params.venda_id;
  try {
    let q = db.select().from(comprovantes);
    if (vendaId) q = q.where(eq(comprovantes.venda_id, Number(vendaId)));
    const all = await q;
    res.json(all);
  } catch (err) {
    console.error('Erro ao listar comprovantes:', err);
    res.status(500).json({ error: 'Erro ao listar comprovantes' });
  }
}
