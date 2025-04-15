const { produtos } = require('../models/produtos'); // ajuste o caminho se necessário

const listarProdutos = async (db, req, res) => {
  try {
    const todos = await db.select().from(produtos);
    res.json(todos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

const adicionarProduto = async (db, req, res) => {
  const { nome, preco, qtd } = req.body;
  const foto = req.file ? req.file.path.replace('public\\', '') : null;

  try {
    await db.insert(produtos).values({
      nome,
      preco: parseFloat(preco),
      qtd: parseInt(qtd),
      foto
    });
    res.status(201).json({ message: 'Produto adicionado com sucesso!' });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    res.status(500).json({ error: 'Erro ao adicionar produto' });
  }
};

const atualizarProduto = async (db, req, res) => {
  const { id } = req.params;
  const { nome, preco, qtd } = req.body;
  const foto = req.file ? req.file.path.replace('public\\', '') : null;

  try {
    const data = {
      nome,
      preco: parseFloat(preco),
      qtd: parseInt(qtd)
    };
    if (foto) data.foto = foto;

    await db.update(produtos).set(data).where(produtos.id.eq(Number(id)));
    res.json({ message: 'Produto atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

const deletarProduto = async (db, req, res) => {
  const { id } = req.params;

  try {
    await db.delete(produtos).where(produtos.id.eq(Number(id)));
    res.json({ message: 'Produto deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};

module.exports = {
  listarProdutos,
  adicionarProduto,
  atualizarProduto,
  deletarProduto
};
