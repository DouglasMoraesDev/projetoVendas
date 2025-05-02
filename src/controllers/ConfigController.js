// src/controllers/ConfigController.js
import ejs from "ejs";
import path from "path";
import puppeteer from "puppeteer";
// … outros imports (db, drizzle, models, format) …

export class ConfigController {
  // … backup e auditoria JSON …

  // GET /api/config/auditoria/pdf?year=YYYY&month=MM
  static async auditoriaPdf(req, res, next) {
    try {
      // 1) Montar dados igual ao método auditoria()
      const year  = parseInt(req.query.year, 10)  || new Date().getFullYear();
      const month = (parseInt(req.query.month, 10) - 1) || new Date().getMonth();
      const start = new Date(year, month, 1);
      const end   = new Date(year, month + 1, 1);

      const vendasMes = await db
        .select().from(vendas)
        .where(and(gte(vendas.data, start), lt(vendas.data, end)));

      const compsMes = await db
        .select().from(comprovantes)
        .where(and(gte(comprovantes.created_at, start), lt(comprovantes.created_at, end)));

      const totalVendas       = vendasMes.length;
      const somaVendas        = vendasMes.reduce((sum, v) => sum + Number(v.valor_total), 0);
      const totalComprovantes = compsMes.length;
      const somaComprovantes  = compsMes.reduce((sum, c) => sum + Number(c.valor), 0);

      const period = format(start, "yyyy-MM");

      // 2) Renderizar HTML via EJS
      const templatePath = path.resolve("./src/views/auditoria.ejs");
      const html = await ejs.renderFile(templatePath, {
        period,
        totalVendas,
        somaVendas,
        totalComprovantes,
        somaComprovantes,
        vendas: vendasMes,
        comprovantes: compsMes,
      });

      // 3) Gerar PDF com Puppeteer
      const browser = await puppeteer.launch({
        args: ["--no-sandbox","--disable-setuid-sandbox"]
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20px", bottom: "20px" } });
      await browser.close();

      // 4) Enviar para o cliente
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=auditoria_${period}.pdf`);
      return res.send(pdfBuffer);
    } catch (err) {
      console.error("Erro ao gerar PDF de auditoria:", err);
      return res.status(500).json({ error: "Falha ao gerar PDF de auditoria" });
    }
  }
}
