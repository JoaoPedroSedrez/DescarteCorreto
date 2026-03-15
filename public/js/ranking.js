// ranking.js — carrega e exibe o ranking de usuários com paginação

const MEDALHAS = ['🥇', '🥈', '🥉'];
const POR_PAGINA = 10;

let todosUsuarios = [];
let paginaAtual = 1;

async function carregarRanking() {
  const res = await apiGet('/api/users/ranking');
  todosUsuarios = await res.json();
  renderPagina(1);
}

function renderPagina(pagina) {
  paginaAtual = pagina;
  const inicio = (pagina - 1) * POR_PAGINA;
  const usuarios = todosUsuarios.slice(inicio, inicio + POR_PAGINA);
  renderRanking(usuarios, inicio);
  renderPaginacao();
}

function renderRanking(usuarios, offset) {
  const tbody = document.getElementById('ranking-body');

  if (todosUsuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Nenhum usuário no ranking ainda.</td></tr>';
    return;
  }

  tbody.innerHTML = usuarios.map((u, i) => {
    const pos = offset + i;
    return `
      <tr style="${pos < 3 ? 'font-weight:600;background:var(--green-light)' : ''}">
        <td style="padding:0.75rem 1rem;text-align:center">${MEDALHAS[pos] || pos + 1}</td>
        <td style="padding:0.75rem 1rem">${u.name}</td>
        <td style="padding:0.75rem 1rem;text-align:center">${u.report_count}</td>
        <td style="padding:0.75rem 1rem;text-align:center">${u.collection_count}</td>
        <td style="padding:0.75rem 1rem;text-align:center;color:var(--green);font-weight:700">${u.total}</td>
      </tr>
    `;
  }).join('');
}

function renderPaginacao() {
  const totalPaginas = Math.ceil(todosUsuarios.length / POR_PAGINA);
  const container = document.getElementById('paginacao');

  if (totalPaginas <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  if (paginaAtual > 1) {
    html += `<button class="btn btn-outline" onclick="renderPagina(${paginaAtual - 1})">← Anterior</button>`;
  }

  html += `<span style="color:var(--text-secondary);font-size:0.9rem">Página ${paginaAtual} de ${totalPaginas}</span>`;

  if (paginaAtual < totalPaginas) {
    html += `<button class="btn btn-outline" onclick="renderPagina(${paginaAtual + 1})">Próxima →</button>`;
  }

  container.innerHTML = html;
}

carregarRanking();
