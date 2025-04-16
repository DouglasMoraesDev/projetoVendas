// public/js/parcelas.js
import { apiRequest } from './api.js';

const listaParcelasDiv = document.getElementById('listaParcelas');
const searchInput = document.getElementById('searchCliente');

async function carregarParcelas() {
  try {
    const vendas = await apiRequest('vendas');
    const clientes = await apiRequest('clientes');
    const produtos = await apiRequest('produtos');

    let pendentes = vendas.filter(v =>
      v.parcelas > 1 && v.paid_installments < v.parcelas
    );

    const termo = searchInput.value.toLowerCase();
    if (termo) {
      pendentes = pendentes.filter(v => {
        const cli = clientes.find(c => c.id === v.cliente_id);
        return cli && cli.nome.toLowerCase().includes(termo);
      });
    }

    listaParcelasDiv.innerHTML = '';
    pendentes.forEach(v => {
      const cli = clientes.find(c => c.id === v.cliente_id);
      const prod = produtos.find(p => p.id === v.produto_id);
      if (!cli || !prod) return;

      const valorParcelaNum = ((prod.preco * v.qtd) - v.entrada) / v.parcelas;
      const valorParcelaStr = valorParcelaNum.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      const restantes = v.parcelas - v.paid_installments;

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${cli.nome}</h3>
        <p><strong>Produto:</strong> ${prod.nome}</p>
        <p><strong>Valor Parcela:</strong> ${valorParcelaStr}</p>
        <p><strong>Restam:</strong> ${restantes} / ${v.parcelas}</p>
        <button class="btn-pagar">Registrar Pagamento</button>
        <button class="btn-pdf">Gerar Recibo</button>
      `;

      // Registrar pagamento (upload comprovante)
      card.querySelector('.btn-pagar').onclick = () => {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.onchange = async e => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              await apiRequest('comprovantes', 'POST', {
                venda_id: v.id,
                imagem: reader.result
              });
              carregarParcelas();
            } catch (err) {
              console.error('Erro ao registrar pagamento:', err);
            }
          };
          reader.readAsDataURL(file);
        };
        inp.click();
      };

      // Gerar recibo
      card.querySelector('.btn-pdf').onclick = async () => {
        try {
          const data = await apiRequest(`vendas/${v.id}/recibo`);
          const html = `
            <html><head><title>Recibo</title></head><body>
              <h1>Recibo de Pagamento</h1>
              <p>Recebi de ${data.cliente} (CPF: ${data.cpf}) a quantia de R$ ${data.valor_parcela.toFixed(2)}</p>
              <p>Referente à parcela ${data.num_parcela} do produto ${data.produto}</p>
              <p>Venda realizada em ${new Date(data.data_venda).toLocaleDateString()}</p>
              <p>Entrada: R$ ${data.valor_entrada.toFixed(2)} / Total: R$ ${data.valor_total.toFixed(2)}</p>
              <p>Observações: ${data.observacoes}</p>
              <p>Local e Data: ${data.local}, ${new Date(data.data_emissao).toLocaleString()}</p>
            </body></html>`;
          const w = window.open('', '_blank');
          w.document.write(html);
          w.document.close();
        } catch (err) {
          console.error('Erro ao gerar recibo:', err);
        }
      };

      listaParcelasDiv.appendChild(card);
    });
  } catch (err) {
    console.error('Erro ao carregar parcelas:', err);
  }
}

searchInput.addEventListener('input', carregarParcelas);
document.addEventListener('DOMContentLoaded', carregarParcelas);
