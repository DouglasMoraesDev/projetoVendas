// src/controllers/comprovantesController.js

const { comprovantes } = require('../models/comprovantes');
const { vendas } = require('../models/vendas'); // Para atualizar a venda
const { eq } = require('drizzle-orm');

const adicionarComprovante = async (db, req, res) => {
  // Se o middleware Multer estiver ativo, req.file conterá as informações do arquivo.
  const { venda_id } = req.body;
  // Usa o caminho salvo pelo Multer ou, se não houver upload, usa o que vier no body.
  const imagem = req.file ? req.file.path : req.body.imagem;
  
  try {
    const result = await db
      .insert(comprovantes)
      .values({ venda_id, imagem });
    
    // Atualiza o campo de parcelas pagas na venda correspondente.
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
};

const listarComprovantes = async (db, req, res) => {
  // Se desejar filtrar por venda, passe venda_id como parâmetro opcional
  const { venda_id } = req.params;
  try {
    let query = db.select().from(comprovantes);
    if (venda_id) {
      query = query.where(eq(comprovantes.venda_id, Number(venda_id)));
    }
    const allComprovantes = await query;
    res.json(allComprovantes);
  } catch (err) {
    console.error('Erro ao listar comprovantes:', err);
    res.status(500).json({ error: 'Erro ao listar comprovantes' });
  }
};

module.exports = {
  adicionarComprovante,
  listarComprovantes
};
