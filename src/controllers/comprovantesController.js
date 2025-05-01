// src/controllers/comprovantesController.js
import { comprovantes } from '../models/comprovantes.js';
import { vendas } from '../models/vendas.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'comprovantes');

export async function adicionarComprovante(db, req, res) {
  const { venda_id } = req.body;
  // ou filename vindo de req.body.comprovante em caso de JSON
  const imagem = req.file?.filename ?? req.body.comprovante;

  try {
    const result = await db.insert(comprovantes).values({
      venda_id: Number(venda_id),
      imagem
    });

    // atualiza installments
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

    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao adicionar comprovante:', err);
    return res.status(500).json({ error: 'Erro ao adicionar comprovante' });
  }
}

export async function listarComprovantes(db, req, res) {
  const vendaId = req.params.venda_id || req.query.venda_id;
  try {
    let q = db.select().from(comprovantes);
    if (vendaId) {
      q = q.where(eq(comprovantes.venda_id, Number(vendaId)));
    }
    const all = await q;

    const formatted = all.map(c => ({
      id: c.id,
      venda_id: c.venda_id,
      imagem: c.imagem,
      // URL já incluindo subpasta
      url: `/uploads/comprovantes/${c.imagem}`,
      created_at: c.created_at
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('Erro ao listar comprovantes:', err);
    return res.status(500).json({ error: 'Erro ao listar comprovantes' });
  }
}
