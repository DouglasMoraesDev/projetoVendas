// src/js/dashboard.js

  
  // Função para exibir o histórico de parcelas no dashboard
  function renderParcelas(parcelas) {
    const parcelasSection = document.getElementById('parcelas');
    parcelasSection.innerHTML = '<h2>Parcelas</h2>';
  
    parcelas.forEach(parcela => {
      const p = document.createElement('p');
      p.textContent = `Parcela ID: ${parcela.id}, Valor: ${parcela.valor}`;
      parcelasSection.appendChild(p);
    });
  }
  
  // Chama as funções para buscar informações do usuário, comprovantes e parcelas
  document.addEventListener('DOMContentLoaded', () => {

  });
  