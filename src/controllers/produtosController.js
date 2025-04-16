const { produtos } = require('../models/produtos');

const listarProdutos = async (db, req, res) => {
  try {
    const lista = await db.select().from(produtos);
    res.json(lista);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

const adicionarProduto = async (db, req, res) => {
  const { nome, preco, qtd } = req.body;
  const foto = req.file ? 'uploads/' + req.file.filename : null;

  try {
    await db.insert(produtos).values({
      nome,
      preco: parseFloat(preco),
      qtd: parseInt(qtd),
      foto
    });
    res.status(201).json({ message: 'Produto adicionado!' });
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    res.status(500).json({ error: 'Erro ao adicionar produto' });
  }
};

const atualizarProduto = async (db, req, res) => {
  const { id } = req.params;
  const { nome, preco, qtd } = req.body;
  const foto = req.file ? 'uploads/' + req.file.filename : null;

  try {
    const updateData = {
      nome,
      preco: parseFloat(preco),
      qtd: parseInt(qtd)
    };
    if (foto) updateData.foto = foto;

    await db.update(produtos).set(updateData).where(produtos.id.eq(Number(id)));
    res.json({ message: 'Produto atualizado!' });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

const deletarProduto = async (db, req, res) => {
  const { id } = req.params;
  try {
    await db.delete(produtos).where(produtos.id.eq(Number(id)));
    res.json({ message: 'Produto deletado!' });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};

module.exports = {
  listarProdutos,
  adicionarProduto,
  atualizarProduto,
  deletarProduto
};
