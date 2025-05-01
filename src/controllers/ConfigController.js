// src/controllers/ConfigController.js
import { db } from "../config/database.js";
import { and, eq, gte, lt } from "drizzle-orm";
import { format } from "date-fns";

import { clientes }     from "../models/clientes.js";
import { produtos }     from "../models/produtos.js";
import { vendas }       from "../models/vendas.js";
import { comprovantes } from "../models/comprovantes.js";
// import { users }      from "../models/users.js"; // opcional

export class ConfigController {
  // GET /api/config/backup
  static async backup(req, res, next) {
    try {
      const [allClientes, allProdutos, allVendas, allComprovantes] = await Promise.all([
        db.select().from(clientes),
        db.select().from(produtos),
        db.select().from(vendas),
        db.select().from(comprovantes),
      ]);

      const backup = {
        timestamp: new Date().toISOString(),
        clientes: allClientes,
        produtos: allProdutos,
        vendas: allVendas,
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
      const month = (parseInt(req.query.month, 10) - 1) || new Date().getMonth();
      const start = new Date(year, month, 1);
      const end   = new Date(year, month + 1, 1);

      // vendas no mês
      const vendasMes = await db
        .select()
        .from(vendas)
        .where(and(
          gte(vendas.createdAt, start),
          lt(vendas.createdAt, end)
        ));

      // comprovantes no mês (pagamentos enviados)
      const compsMes = await db
        .select()
        .from(comprovantes)
        .where(and(
          gte(comprovantes.createdAt, start),
          lt(comprovantes.createdAt, end)
        ));

      const totalVendas    = vendasMes.length;
      const somaVendas     = vendasMes.reduce((sum, v) => sum + Number(v.total), 0);
      const totalComps     = compsMes.length;
      const somaCompsValor = compsMes.reduce((sum, c) => sum + Number(c.valor), 0);

      res.json({
        period: format(start, "yyyy-MM"),
        totalVendas,
        somaVendas,
        totalComprovantes: totalComps,
        somaComprovantes: somaCompsValor,
        vendas: vendasMes,
        comprovantes: compsMes,
      });
    } catch (err) {
      next(err);
    }
  }
}
