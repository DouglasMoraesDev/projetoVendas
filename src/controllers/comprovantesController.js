import { comprovantes } from '../models/comprovantes.js'
import { vendas } from '../models/vendas.js'
import { eq } from 'drizzle-orm'

export async function adicionarComprovante(db, req, res) {
  const { venda_id, imagem } = req.body   // recebe só o nome do arquivo
  try {
    // insere no banco
    const result = await db.insert(comprovantes).values({
      venda_id: Number(venda_id),
      imagem
    })

    // atualiza parcelas pagas na venda
    const [sale] = await db
      .select()
      .from(vendas)
      .where(eq(vendas.id, Number(venda_id)))

    if (sale && sale.paid_installments < sale.parcelas) {
      await db
        .update(vendas)
        .set({ paid_installments: sale.paid_installments + 1 })
        .where(eq(vendas.id, Number(venda_id)))
    }

    res.status(201).json({ id: result.insertId })
  } catch (err) {
    console.error('Erro ao adicionar comprovante:', err)
    res.status(500).json({ error: 'Erro ao adicionar comprovante' })
  }
}

export async function listarComprovantes(db, req, res) {
  const vendaId = req.params.venda_id || req.query.venda_id
  try {
    let q = db.select().from(comprovantes)
    if (vendaId) {
      q = q.where(eq(comprovantes.venda_id, Number(vendaId)))
    }
    const all = await q

    const formatted = all.map(c => ({
      id: c.id,
      venda_id: c.venda_id,
      imagem: c.imagem,
      url: `/uploads/comprovantes/${c.imagem}`,
      created_at: c.created_at
    }))

    res.json(formatted)
  } catch (err) {
    console.error('Erro ao listar comprovantes:', err)
    res.status(500).json({ error: 'Erro ao listar comprovantes' })
  }
}
