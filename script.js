    // Seletores principais
const form = document.getElementById('formTreino');
const tabelaBody = document.querySelector('#tabela tbody');
const graficoEl = document.getElementById('grafico');

// Carregar treinos salvos
let treinos = JSON.parse(localStorage.getItem('calistenia_treinos') || '[]');

// Função para salvar no localStorage
function salvarLocal() {
  localStorage.setItem('calistenia_treinos', JSON.stringify(treinos));
}

// Função para renderizar a tabela
function renderTabela() {
  tabelaBody.innerHTML = '';

  if (!treinos.length) {
    tabelaBody.innerHTML = `<tr><td colspan="4">Nenhum treino registrado ainda.</td></tr>`;
    return;
  }

  // Exibir os treinos mais recentes primeiro
  treinos.slice().reverse().forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.nome}</td>
      <td>${t.exercicio}</td>
      <td>${t.reps}</td>
      <td>${t.data}</td>
    `;
    tabelaBody.appendChild(tr);
  });
}

// Função para gerar gráfico de repetições por exercício
function gerarGrafico() {
  if (window.chartInstance) window.chartInstance.destroy();

  // Contabiliza total de repetições por tipo de exercício
  const contador = {};
  treinos.forEach(t => {
    const ex = t.exercicio || 'Desconhecido';
    const reps = Number(t.reps) || 0;
    contador[ex] = (contador[ex] || 0) + reps;
  });

  const labels = Object.keys(contador);
  const valores = Object.values(contador);

  if (!labels.length) return; // se não houver dados, não mostra gráfico

  window.chartInstance = new Chart(graficoEl, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total de Repetições por Exercício',
        data: valores,
        backgroundColor: 'rgba(139,0,0,0.6)',
        borderColor: '#ff0000',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Exercício' } },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Total de Reps' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Evento de envio do formulário
form.addEventListener('submit', e => {
  e.preventDefault();

  const novo = {
    nome: form.nome.value.trim() || 'Anônimo',
    idade: form.idade.value ? Number(form.idade.value) : null,
    exercicio: form.exercicio.value,
    reps: form.reps.value,
    data: form.data.value
  };

  // Adiciona novo treino
  treinos.push(novo);

  // Salva e atualiza tela
  salvarLocal();
  renderTabela();
  gerarGrafico();

  // Limpa o formulário
  form.reset();
});

// Inicialização da página
renderTabela();
if (treinos.length) gerarGrafico();
