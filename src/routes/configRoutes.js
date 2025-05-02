// src/controllers/ConfigController.js
import { db } from "../config/database.js";
import { and, gte, lt } from "drizzle-orm";
import { format } from "date-fns";

import { clientes }     from "../models/clientes.js";
import { produtos }     from "../models/produtos.js";
import { vendas }       from "../models/vendas.js";
import { comprovantes } from "../models/comprovantes.js";

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

      const backupData = {
        timestamp: new Date().toISOString(),
        clientes: allClientes,
        produtos: allProdutos,
        vendas: allVendas,
        comprovantes: allComprovantes,
      };

      const filename = `backup_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.json`;
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/json");
      return res.send(JSON.stringify(backupData, null, 2));
    } catch (err) {
      console.error("Erro no backup:", err);
      return next(err);
    }
  }

  // GET /api/config/auditoria?year=YYYY&month=MM
  static async auditoria(req, res, next) {
    try {
      // Parseia parâmetros
      const year  = parseInt(req.query.year, 10)  || new Date().getFullYear();
      const month = (parseInt(req.query.month, 10) - 1) || new Date().getMonth();
      const start = new Date(year, month, 1);
      const end   = new Date(year, month + 1, 1);

      // Filtra vendas do mês
      const vendasMes = await db
        .select()
        .from(vendas)
        .where(and(
          gte(vendas.createdAt, start),
          lt(vendas.createdAt, end)
        ));

      // Filtra comprovantes do mês
      const compsMes = await db
        .select()
        .from(comprovantes)
        .where(and(
          gte(comprovantes.createdAt, start),
          lt(comprovantes.createdAt, end)
        ));

      // Gera resumos numéricos
      const totalVendas       = vendasMes.length;
      const somaVendas        = vendasMes.reduce((sum, v) => sum + Number(v.total), 0);
      const totalComprovantes = compsMes.length;
      const somaComprovantes  = compsMes.reduce((sum, c) => sum + Number(c.valor), 0);

      return res.json({
        period: format(start, "yyyy-MM"),
        totalVendas,
        somaVendas,
        totalComprovantes,
        somaComprovantes,
        vendas: vendasMes,
        comprovantes: compsMes,
      });
    } catch (err) {
      console.error("Erro na auditoria:", err);
      return res.status(500).json({ error: "Falha ao gerar relatório de auditoria" });
    }
  }
}
