// public/js/parcelas.js
import { apiRequest } from './api.js';

const lista = document.getElementById('listaParcelas');
const search = document.getElementById('searchCliente');

async function carregar() {
  let vendas = await apiRequest('vendas');
  const clientes = await apiRequest('clientes');
  const produtos = await apiRequest('produtos');

  // Filtra pendentes
  let pend = vendas.filter(v => v.parcelas > 1 && v.paid_installments < v.parcelas);
  const termo = search.value.toLowerCase();
  if (termo) {
    pend = pend.filter(v => {
      const c = clientes.find(c => c.id === v.cliente_id);
      return c?.nome.toLowerCase().includes(termo);
    });
  }

  lista.innerHTML = pend.map(v => {
    const c = clientes.find(x => x.id === v.cliente_id);
    const p = produtos.find(x => x.id === v.produto_id);
    const total = p.preco * v.qtd;
    const parcelaVal = ((total - v.entrada) / v.parcelas)
      .toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
    const restantes = v.parcelas - v.paid_installments;
    return `
      <div class="card">
        <h3>${c.nome}</h3>
        <p><strong>Produto:</strong> ${p.nome}</p>
        <p><strong>Valor Parcela:</strong> ${parcelaVal}</p>
        <p><strong>Restam:</strong> ${restantes} de ${v.parcelas}</p>
        <button class="btn-pagar" data-id="${v.id}">Registrar Pagamento</button>
        <button class="btn-pdf" data-id="${v.id}">Gerar Recibo</button>
      </div>
    `;
  }).join('') || '<p>Sem parcelas pendentes.</p>';

  // Eventos
  document.querySelectorAll('.btn-pagar').forEach(btn => {
    btn.onclick = () => pagar(btn.dataset.id);
  });
  document.querySelectorAll('.btn-pdf').forEach(btn => {
    btn.onclick = () => gerar(btn.dataset.id);
  });
}

async function pagar(id) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      await apiRequest('comprovantes', 'POST', {
        venda_id: id,
        imagem: reader.result
      });
      carregar();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

async function gerar(id) {
  const data = await apiRequest(`vendas/${id}/recibo`);
  const html = `
    <html><body>
      <h1>Recibo</h1>
      <p>${data.cliente} (CPF: ${data.cpf}) — R$ ${data.valor_parcela.toFixed(2)}</p>
      <p>Parcela ${data.num_parcela} / ${data.parcelas}</p>
      <p>Produto: ${data.produto}</p>
      <p>Venda: ${new Date(data.data_venda).toLocaleDateString()}</p>
      <p>Entrada: R$ ${data.valor_entrada.toFixed(2)}</p>
      <p>Total: R$ ${data.valor_total.toFixed(2)}</p>
      <p>Obs: ${data.observacoes}</p>
      <p>${data.local}, ${new Date(data.data_emissao).toLocaleString()}</p>
    </body></html>`;
  const w = window.open(); w.document.write(html); w.document.close();
}

search.addEventListener('input', carregar);
document.addEventListener('DOMContentLoaded', carregar);
