// public/js/historico.js
import { apiRequest } from './api.js';

async function render() {
  const vendas = await apiRequest('vendas');
  const clientes = await apiRequest('clientes');
  const produtos = await apiRequest('produtos');
  const container = document.getElementById('listaHistorico');

  container.innerHTML = vendas.map(v => {
    const c = clientes.find(x => x.id === v.cliente_id);
    const p = produtos.find(x => x.id === v.produto_id);
    const total = (p.preco * v.qtd).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
    const entrada = parseFloat(v.entrada).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
    return `
      <div class="card">
        <h3>${c.nome}</h3>
        <p>Produto: ${p.nome}</p>
        <img src="${p.foto ? '/uploads/'+p.foto : 'https://via.placeholder.com/100'}" class="produto"/>
        <p>Qtd: ${v.qtd}</p>
        <p>Total: ${total}</p>
        <p>Entrada: ${entrada}</p>
        <p>Parcelas: ${v.parcelas}</p>
        <p>Valor Parcela: ${((p.preco*v.qtd - v.entrada)/v.parcelas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p>
        <p>Data: ${new Date(v.data).toLocaleDateString()}</p>
        <p>Obs: ${v.obs || '-'}</p>
      </div>
    `;
  }).join('') || '<p>Sem histórico.</p>';
}

document.addEventListener('DOMContentLoaded', render);
