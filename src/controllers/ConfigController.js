// src/controllers/ConfigController.js
import ejs from "ejs";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import puppeteer from "puppeteer";
import { db } from "../config/database.js";
import { and, gte, lt } from "drizzle-orm";
import { format } from "date-fns";
import { clientes } from "../models/clientes.js";
import { produtos } from "../models/produtos.js";
import { vendas } from "../models/vendas.js";
import { comprovantes } from "../models/comprovantes.js";

// Configurações para localizar corretamente o __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

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
      const year  = parseInt(req.query.year, 10)  || new Date().getFullYear();
      const month = (parseInt(req.query.month, 10) - 1) || new Date().getMonth();
      const start = new Date(year, month, 1);
      const end   = new Date(year, month + 1, 1);

      const vendasMes = await db
        .select()
        .from(vendas)
        .where(and(
          gte(vendas.data, start),
          lt(vendas.data, end)
        ));

      const compsMes = await db
        .select()
        .from(comprovantes)
        .where(and(
          gte(comprovantes.created_at, start),
          lt(comprovantes.created_at, end)
        ));

      const totalVendas       = vendasMes.length;
      const somaVendas        = vendasMes.reduce((sum, v) => sum + Number(v.valor_total), 0);
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

  // GET /api/config/auditoria/pdf?year=YYYY&month=MM
  static async auditoriaPdf(req, res, next) {
    try {
      const year  = parseInt(req.query.year, 10)  || new Date().getFullYear();
      const month = (parseInt(req.query.month, 10) - 1) || new Date().getMonth();
      const start = new Date(year, month, 1);
      const end   = new Date(year, month + 1, 1);

      const vendasMes = await db
        .select()
        .from(vendas)
        .where(and(
          gte(vendas.data, start),
          lt(vendas.data, end)
        ));

      const compsMes = await db
        .select()
        .from(comprovantes)
        .where(and(
          gte(comprovantes.created_at, start),
          lt(comprovantes.created_at, end)
        ));

      const totalVendas       = vendasMes.length;
      const somaVendas        = vendasMes.reduce((sum, v) => sum + Number(v.valor_total), 0);
      const totalComprovantes = compsMes.length;
      const somaComprovantes  = compsMes.reduce((sum, c) => sum + Number(c.valor), 0);
      const period = format(start, "yyyy-MM");

      const templatePath = path.join(__dirname, "../views/auditoria.ejs");
      if (!fs.existsSync(templatePath)) {
        console.error("Template EJS não encontrado em:", templatePath);
        throw new Error("Template de auditoria não localizado");
      }

      const html = await ejs.renderFile(templatePath, {
        period,
        totalVendas,
        somaVendas,
        totalComprovantes,
        somaComprovantes,
        vendas: vendasMes,
        comprovantes: compsMes,
      });

      if (typeof html !== "string" || html.trim().length === 0) {
        console.error("HTML gerado vazio. Template:", templatePath);
        throw new Error("Falha ao renderizar template de auditoria");
      }
      console.log("HTML de auditoria gerado com", html.length, "caracteres");

      const browser = await puppeteer.launch({ args: ["--no-sandbox","--disable-setuid-sandbox"] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20px", bottom: "20px" } });
      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="auditoria_${period}.pdf"`);
      return res.send(pdfBuffer);
    } catch (err) {
      console.error("Erro ao gerar PDF de auditoria:", err);
      return res.status(500).json({ error: err.message || "Falha ao gerar PDF de auditoria" });
    }
  }
}
