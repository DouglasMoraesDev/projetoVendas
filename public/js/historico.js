// js/historico.js

async function fetchVendas() {
    try {
      return await window.apiRequest('vendas', 'GET');
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  async function fetchClientes() {
    try {
      return await window.apiRequest('clientes', 'GET');
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  async function fetchProdutos() {
    try {
      return await window.apiRequest('produtos', 'GET');
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  async function renderHistorico() {
    try {
      const vendas = await fetchVendas();
      const clientes = await fetchClientes();
      const produtos = await fetchProdutos();
      const histDiv = document.getElementById('listaHistorico');
      histDiv.innerHTML = '';
      
      vendas.forEach(v => {
        const cli = clientes.find(c => c.id === v.cliente_id);
        const prod = produtos.find(p => p.id === v.produto_id);
        if (!cli || !prod) return;
        
        const total = parseFloat(prod.preco) * v.qtd;
        const totalStr = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const entradaStr = parseFloat(v.entrada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const parcelaVal = ((total - parseFloat(v.entrada)) / v.parcelas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${cli.nome}</h3>
          <p><strong>Produto:</strong> ${prod.nome}</p>
          <img src="${prod.foto || 'https://via.placeholder.com/100'}" class="produto">
          <p><strong>Qtd:</strong> ${v.qtd}</p>
          <p><strong>Total:</strong> ${totalStr}</p>
          <p><strong>Entrada:</strong> ${entradaStr}</p>
          <p><strong>Parcelas:</strong> ${v.parcelas}</p>
          <p><strong>Valor Parcela:</strong> ${parcelaVal}</p>
          <p><strong>Data:</strong> ${v.data}</p>
          <p><strong>Obs:</strong> ${v.obs || '-'}</p>
          <button onclick="window.location.href='vendas.html?editId=${v.id}'">✏️ Editar</button>
          <button onclick="deleteVenda(${v.id})">❌ Deletar</button>
        `;
        histDiv.appendChild(card);
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  renderHistorico();
  
  // Função para deletar venda (deve ser implementada no endpoint)
  async function deleteVenda(id) {
    try {
      await window.apiRequest(`vendas/${id}`, 'DELETE');
      renderHistorico();
    } catch (error) {
      console.error(error);
    }
  }
  