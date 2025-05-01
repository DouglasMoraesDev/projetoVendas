// src/controllers/ConfigController.js
import { db } from "../config/database.js";
import { and, gte, lt } from "drizzle-orm";
import { format } from "date-fns";

import { clientes }     from "../models/clientes.js";
import { produtos }     from "../models/produtos.js";
import { vendas }       from "../models/vendas.js";
import { comprovantes } from "../models/comprovantes.js";

export class ConfigController {
  // GET /api/config/auditoria?year=YYYY&month=MM
  static async auditoria(req, res, next) {
    try {
      // Parâmetros
      const year  = parseInt(req.query.year, 10)  || new Date().getFullYear();
      const month = (parseInt(req.query.month, 10) - 1) || new Date().getMonth();
      const start = new Date(year, month, 1);
      const end   = new Date(year, month + 1, 1);

      // Atenção aqui: use o nome de coluna real para data de criação
      // Exemplo comum: created_at em vez de createdAt
      const vendaDateCol = vendas.created_at || vendas.createdAt;
      const compDateCol  = comprovantes.created_at || comprovantes.createdAt;

      // Vendas no mês
      const vendasMes = await db
        .select()
        .from(vendas)
        .where(and(
          gte(vendaDateCol, start),
          lt(vendaDateCol, end)
        ));

      // Comprovantes no mês
      const compsMes = await db
        .select()
        .from(comprovantes)
        .where(and(
          gte(compDateCol, start),
          lt(compDateCol, end)
        ));

      // Resumos
      const totalVendas      = vendasMes.length;
      const somaVendas       = vendasMes.reduce((sum, v) => sum + Number(v.total), 0);
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
