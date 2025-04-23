// src/controllers/vendasController.js
// CRUD para vendas, ajuste de estoque e geração de recibo

import { vendas } from '../models/vendas.js';
import { produtos } from '../models/produtos.js';
import { clientes } from '../models/clientes.js';
import { format } from 'date-fns';   // usado apenas na formatação de datas para o recibo
import { eq } from 'drizzle-orm';     // import único de eq
import PDFDocument from 'pdfkit';

// 1) Lista todas as vendas
export async function listarVendas(db, req, res) {
  try {
    const all = await db.select().from(vendas);
    return res.json(all);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar vendas' });
  }
}

// 2) Retorna uma venda específica por id
export async function obterVenda(db, req, res) {
  try {
    const id = Number(req.params.id);
    const [sale] = await db
      .select()
      .from(vendas)
      .where(eq(vendas.id, id));

    if (!sale) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }
    return res.json(sale);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao obter venda' });
  }
}

// 3) Adiciona nova venda
export async function adicionarVenda(db, req, res) {
  const {
    cliente_id: clienteRaw,
    produto_id: produtoRaw,
    qtd: qtdRaw,
    entrada: entradaRaw,
    parcelas: parcelasRaw,
    due_day: dueDayRaw,
    obs = ''
  } = req.body;

  const cliente_id  = Number(clienteRaw);
  const produto_id  = Number(produtoRaw);
  const qtd         = Number(qtdRaw);
  const entrada     = Number(entradaRaw);
  const parcelas    = Number(parcelasRaw);
  const due_day     = Number(dueDayRaw);
  const observacoes = obs.trim();

  try {
    // Verifica estoque
    const [prod] = await db
      .select()
      .from(produtos)
      .where(eq(produtos.id, produto_id));

    if (!prod || prod.qtd < qtd) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    // Busca cliente
    const [cli] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, cliente_id));

    // Atualiza estoque
    await db
      .update(produtos)
      .set({ qtd: prod.qtd - qtd })
      .where(eq(produtos.id, produto_id));

    // Insere venda
    const dataVenda  = new Date();
    const valorTotal = (prod.preco || 0) * qtd;

    const result = await db.insert(vendas).values({
      cliente_id,
      produto_id,
      cliente_name: cli.nome,
      produto_name: prod.nome,
      qtd,
      entrada,
      valor_total: valorTotal,
      parcelas,
      due_day,
      paid_installments: 0,
      obs: observacoes,
      data: dataVenda
    });

    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao registrar venda' });
  }
}

// 4) Gera JSON de recibo
export async function gerarRecibo(db, req, res) {
  try {
    const id = Number(req.params.id);
    const [v] = await db
      .select()
      .from(vendas)
      .where(eq(vendas.id, id));

    if (!v) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }

    const [prod] = await db
      .select()
      .from(produtos)
      .where(eq(produtos.id, v.produto_id));

    const [cli] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, v.cliente_id));

    const valorTotal   = (prod.preco || 0) * v.qtd;
    const valorParcela = (valorTotal - v.entrada) / v.parcelas;
    const numParcela   = v.paid_installments + 1;

    return res.json({
      cliente:        v.cliente_name,
      cpf:            cli?.cpf ?? '—',
      produto:        v.produto_name,
      data_venda:     format(new Date(v.data), 'yyyy-MM-dd'),
      valor_entrada:  v.entrada,
      valor_parcela:  valorParcela,
      num_parcela:    numParcela,
      parcelas:       v.parcelas,
      valor_total:    valorTotal,
      observacoes:    v.obs,
      local:          'Campos do Jordão',
      data_emissao:   format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao gerar recibo' });
  }
}

// 5) Atualiza uma venda existente
export async function atualizarVenda(db, req, res) {
  const { id } = req.params;
  const {
    cliente_id: clienteRaw,
    produto_id: produtoRaw,
    qtd: qtdRaw,
    entrada: entradaRaw,
    parcelas: parcelasRaw,
    due_day: dueDayRaw,
    obs = ''
  } = req.body;

  try {
    await db
      .update(vendas)
      .set({
        cliente_id:  Number(clienteRaw),
        produto_id:  Number(produtoRaw),
        qtd:         Number(qtdRaw),
        entrada:     Number(entradaRaw),
        parcelas:    Number(parcelasRaw),
        due_day:     Number(dueDayRaw),
        obs:         obs.trim(),
      })
      .where(eq(vendas.id, Number(id)));

    return res.json({ message: 'Venda atualizada!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar venda' });
  }
}

// 6) Deleta uma venda
export async function deletarVenda(db, req, res) {
  const { id } = req.params;
  try {
    await db.delete(vendas).where(eq(vendas.id, Number(id)));
    return res.json({ message: 'Venda removida!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao deletar venda' });
  }
}



export async function gerarReciboPdf(db, req, res) {
  let doc;
  try {
    const id = Number(req.params.id);

    // 1) Busca dados
    const [v] = await db.select().from(vendas).where(eq(vendas.id, id));
    if (!v) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }
    const [cli]  = await db.select().from(clientes).where(eq(clientes.id, v.cliente_id));
    const [prod] = await db.select().from(produtos).where(eq(produtos.id, v.produto_id));

    // 2) Converte tudo para Number antes de gerar PDF
    const qtd            = Number(v.qtd);
    const entrada        = Number(v.entrada);
    const parcelas       = Number(v.parcelas);
    const paidInstall    = Number(v.paid_installments);
    const precoUnitario  = Number(prod.preco);
    const valorTotal     = precoUnitario * qtd;
    const valorParcela   = (valorTotal - entrada) / parcelas;
    const numeroParcela  = paidInstall + 1;

    // 3) Cabeçalhos para PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=recibo_${id}.pdf`);

    // 4) Cria o documento e começa o pipe
    doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    // 5) Layout do recibo
    doc
      .fontSize(20)
      .text('RECIBO DE PAGAMENTO', { align: 'center' })
      .moveDown(1.5);

    doc.fontSize(12)
      
      .text(`Data: ${new Date(v.data).toLocaleDateString('pt-BR')}`)
      .moveDown();

    doc
      .text(`Recebemos de: ${cli.nome} (CPF: ${cli.cpf || '—'})`)
      .text(`Produto: ${prod.nome}`)
      .moveDown();

    doc
      .text(`Valor total: R$ ${valorTotal.toFixed(2)}`)
      .text(`Entrada: R$ ${entrada.toFixed(2)}`)
      .text(`Parcela ${numeroParcela} de ${parcelas}: R$ ${valorParcela.toFixed(2)}`)
      .moveDown(1.5);

    if (v.obs) {
      doc.text(`Observações: ${v.obs}`).moveDown(1);
    }

    doc
      .text('Diego de Moraes Abilio', { align: 'right' })
      .text('Campos do Jordão - São Paulo', { align: 'right' });

    // 6) Finaliza o PDF
    doc.end();

  } catch (err) {
    console.error('Erro ao gerar PDF:', err);

    // Se já começou a enviar PDF, apenas encerre o stream
    if (doc && res.headersSent) {
      return res.end();
    }
    // Senão, envie erro JSON normalmente
    return res.status(500).json({ error: 'Erro ao gerar PDF do recibo' });
  }
}

