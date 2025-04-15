// src/controllers/comprovantesController.js

const { comprovantes } = require('../models/comprovantes');
const { eq } = require('drizzle-orm');

const adicionarComprovante = async (db, req, res) => {
  // Se o middleware Multer estiver ativo, req.file conterá as informações do arquivo
  const { venda_id } = req.body;
  // Usa o caminho salvo pelo Multer, ou, se não houver upload, tenta usar o que vier no body
  const imagem = req.file ? req.file.path : req.body.imagem;
  
  try {
    const result = await db
      .insert(comprovantes)
      .values({ venda_id, imagem });
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar comprovante' });
  }
};

const listarComprovantes = async (db, req, res) => {
  const { venda_id } = req.params;
  try {
    let query = db.select().from(comprovantes);
    if (venda_id) {
      query = query.where(eq(comprovantes.venda_id, Number(venda_id)));
    }
    const allComprovantes = await query;
    res.json(allComprovantes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar comprovantes' });
  }
};

module.exports = {
  adicionarComprovante,
  listarComprovantes
};
