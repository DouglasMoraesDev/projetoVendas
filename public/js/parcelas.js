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
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async e => {
    const file = e.target.files[0]
    if (!file) return

    // 1) envia multipart/form-data para /api/upload
    const fm = new FormData()
    fm.append('file', file)
    const uploadRes = await fetch(`${location.origin}/api/upload?type=comprovante`, {
      method: 'POST',
      body: fm
    })
    if (!uploadRes.ok) {
      console.error('Falha no upload do comprovante')
      return
    }
    const { filename } = await uploadRes.json()

    // 2) registra no banco
    await apiRequest('comprovantes', 'POST', {
      venda_id: id,
      imagem: filename    // só o nome do arquivo
    })

    // 3) recarrega a lista
    carregar()
  }
  input.click()
}

async function gerar(id) {
  const res = await fetch(`/api/vendas/${id}/recibo-pdf`, {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `recibo_${id}.pdf`;
  link.click();
}

search.addEventListener('input', carregar);
document.addEventListener('DOMContentLoaded', carregar);
