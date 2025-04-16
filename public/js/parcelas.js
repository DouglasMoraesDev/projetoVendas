// js/parcelas.js

const listaParcelasDiv = document.getElementById('listaParcelas');
const searchInput = document.getElementById('searchCliente');

async function fetchVendas() {
  try {
    return await window.apiRequest('vendas', 'GET');
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return [];
  }
}

async function fetchClientes() {
  try {
    return await window.apiRequest('clientes', 'GET');
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

async function fetchProdutos() {
  try {
    return await window.apiRequest('produtos', 'GET');
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

/**
 * Carrega as vendas que possuem parcelas pendentes
 */
async function carregarParcelas() {
  try {
    const vendas = await fetchVendas();
    const clientes = await fetchClientes();
    const produtos = await fetchProdutos();
    
    // Filtra as vendas com parcelas > 1 e que ainda não foram quitadas
    let pendentes = vendas.filter(v => v.parcelas > 1 && v.paid_installments < v.parcelas);

    // Filtra por nome do cliente se houver termo na busca
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

      // Calcula o valor da parcela: (preço * quantidade - entrada) / total de parcelas
      const valorParcelaNum = (parseFloat(prod.preco) * v.qtd - parseFloat(v.entrada)) / v.parcelas;
      const valorParcelaStr = valorParcelaNum.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
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
      
      // Ao clicar em "Registrar Pagamento" cria um input para selecionar arquivo e envia o comprovante.
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
              // Chama o endpoint de comprovantes (POST) enviando o data URL da imagem
              await window.apiRequest('comprovantes', 'POST', { venda_id: v.id, imagem: reader.result });
              // Após registro, recarrega as parcelas para atualizar o número de parcelas pagas
              carregarParcelas();
            } catch (error) {
              console.error('Erro ao registrar pagamento:', error);
            }
          };
          reader.readAsDataURL(file);
        };
        inp.click();
      };

      // Ao clicar em "Gerar Recibo", emite um alerta (ou implementa o PDF usando, por exemplo, jsPDF)
      card.querySelector('.btn-pdf').onclick = () => {
        alert('Funcionalidade de gerar PDF (recibo) não foi implementada nesta versão.');
      };

      listaParcelasDiv.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao carregar parcelas:', error);
  }
}

searchInput.addEventListener('input', carregarParcelas);
document.addEventListener('DOMContentLoaded', carregarParcelas);
