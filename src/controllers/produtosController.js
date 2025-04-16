// src/controllers/produtosController.js
import { produtos } from '../models/produtos.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function listarProdutos(db, req, res) {
  try {
    const list = await db.select().from(produtos);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
}

export async function adicionarProduto(db, req, res) {
  const { nome, preco, qtd } = req.body;
  const foto = req.file?.filename ?? null;
  try {
    await db.insert(produtos).values({
      nome,
      preco: parseFloat(preco),
      qtd: parseInt(qtd, 10),
      foto
    });
    res.status(201).json({ message: 'Produto adicionado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar produto' });
  }
}

export async function atualizarProduto(db, req, res) {
  const { id } = req.params;
  const { nome, preco, qtd } = req.body;
  try {
    const updateData = {
      nome,
      preco: parseFloat(preco),
      qtd: parseInt(qtd, 10)
    };
    if (req.file) {
      const [old] = await db.select().from(produtos).where(eq(produtos.id, Number(id)));
      if (old?.foto) fs.unlink(path.join('public/uploads', old.foto), () => {});
      updateData.foto = req.file.filename;
    }
    await db.update(produtos).set(updateData).where(eq(produtos.id, Number(id)));
    res.json({ message: 'Produto atualizado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

export async function deletarProduto(db, req, res) {
  const { id } = req.params;
  try {
    const [old] = await db.select().from(produtos).where(eq(produtos.id, Number(id)));
    if (old?.foto) fs.unlink(path.join('public/uploads', old.foto), () => {});
    await db.delete(produtos).where(eq(produtos.id, Number(id)));
    res.json({ message: 'Produto deletado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
}
