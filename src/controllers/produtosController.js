// src/controllers/produtosController.js
import { produtos } from '../models/produtos.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'produtos');

export async function listarProdutos(db, req, res) {
  try {
    const list = await db.select().from(produtos);
    // inclui a URL completa de cada foto
    const formatted = list.map(p => ({
      ...p,
      fotoUrl: p.foto
        ? `/uploads/produtos/${p.foto}`
        : null
    }));
    res.json(formatted);
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
      // apaga a foto antiga, se existir
      const [old] = await db
        .select()
        .from(produtos)
        .where(eq(produtos.id, Number(id)));
      if (old?.foto) {
        const oldPath = path.join(UPLOADS_DIR, old.foto);
        fs.unlink(oldPath, err => err && console.warn('erro ao apagar foto antiga:', err));
      }
      updateData.foto = req.file.filename;
    }

    await db
      .update(produtos)
      .set(updateData)
      .where(eq(produtos.id, Number(id)));

    res.json({ message: 'Produto atualizado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

export async function deletarProduto(db, req, res) {
  const { id } = req.params;
  try {
    const [old] = await db
      .select()
      .from(produtos)
      .where(eq(produtos.id, Number(id)));

    if (old?.foto) {
      const oldPath = path.join(UPLOADS_DIR, old.foto);
      fs.unlink(oldPath, err => err && console.warn('erro ao apagar foto:', err));
    }

    await db
      .delete(produtos)
      .where(eq(produtos.id, Number(id)));

    res.json({ message: 'Produto deletado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
}
