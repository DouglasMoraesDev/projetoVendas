// Endpoint para estatísticas do dashboard
import { clientes } from '../models/clientes.js';
import { produtos } from '../models/produtos.js';
import { vendas } from '../models/vendas.js';
import { getDate } from 'date-fns';

export async function getDashboard(db, req, res) {
  try {
    const allClientes = await db.select().from(clientes);
    const allProdutos = await db.select().from(produtos);
    const allVendas = await db.select().from(vendas);

    const today = getDate(new Date());
    const notifications = allVendas
      .filter(v => v.due_day === today && v.paid_installments < v.parcelas)
      .map(v => `Parcela pendente da venda ${v.id} para ${v.cliente_name}`);

    res.json({
      welcome: `Bem‑vindo, ${req.user.username}!`,
      clientes: allClientes.length,
      produtos: allProdutos.length,
      vendas: allVendas.length,
      notifications
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
}
