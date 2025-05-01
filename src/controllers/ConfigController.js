import { db } from "../config/database.js";
import { vendas, parcelas, clientes, produtos, comprovantes } from "../models/";
import { and, eq, gte, lt } from "drizzle-orm";
import { format } from "date-fns";

export class ConfigController {
  // GET /api/config/backup
  static async backup(req, res, next) {
    try {
      // carrega todas as tabelas
      const [allClientes, allProdutos, allVendas, allParcelas, allComprovantes] = await Promise.all([
        db.select().from(clientes),
        db.select().from(produtos),
        db.select().from(vendas),
        db.select().from(parcelas),
        db.select().from(comprovantes),
      ]);

      const backup = {
        timestamp: new Date().toISOString(),
        clientes: allClientes,
        produtos: allProdutos,
        vendas: allVendas,
        parcelas: allParcelas,
        comprovantes: allComprovantes,
      };

      const filename = `backup_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.json`;

      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(backup, null, 2));
    } catch (err) {
      next(err);
    }
  }

  // GET /api/config/auditoria?year=YYYY&month=MM
  static async auditoria(req, res, next) {
    try {
      const year = parseInt(req.query.year, 10) || new Date().getFullYear();
      const month = parseInt(req.query.month, 10) - 1 || new Date().getMonth();
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);

      // vendas no mês
      const vendasMes = await db
        .select()
        .from(vendas)
        .where(and(
          gte(vendas.createdAt, start),
          lt(vendas.createdAt, end)
        ));

      // parcelas no mês
      const parcelasMes = await db
        .select()
        .from(parcelas)
        .where(and(
          gte(parcelas.dueDate, start),
          lt(parcelas.dueDate, end)
        ));

      // resumo numérico
      const totalVendas = vendasMes.length;
      const somaVendas = vendasMes.reduce((sum, v) => sum + Number(v.total), 0);

      const totalParcelas = parcelasMes.length;
      const somaParcelas = parcelasMes.reduce((sum, p) => sum + Number(p.valor), 0);

      res.json({
        period: format(start, "yyyy-MM"),
        totalVendas,
        somaVendas,
        totalParcelas,
        somaParcelas,
        vendas: vendasMes,
        parcelas: parcelasMes,
      });
    } catch (err) {
      next(err);
    }
  }
}
