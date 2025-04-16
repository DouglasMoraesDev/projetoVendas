// src/controllers/clientesController.js
import { clientes } from '../models/clientes.js';
import { eq } from 'drizzle-orm';

export async function listarClientes(db, req, res) {
  try {
    const all = await db.select().from(clientes);
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
}

export async function adicionarCliente(db, req, res) {
  const { nome, cpf, endereco, contato } = req.body;
  try {
    const result = await db.insert(clientes).values({ nome, cpf, endereco, contato });
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar cliente' });
  }
}

export async function atualizarCliente(db, req, res) {
  const { id } = req.params;
  const { nome, cpf, endereco, contato } = req.body;
  try {
    await db
      .update(clientes)
      .set({ nome, cpf, endereco, contato })
      .where(eq(clientes.id, Number(id)));
    res.json({ message: 'Cliente atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
}

export async function deletarCliente(db, req, res) {
  const { id } = req.params;
  try {
    await db.delete(clientes).where(eq(clientes.id, Number(id)));
    res.json({ message: 'Cliente removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
}
