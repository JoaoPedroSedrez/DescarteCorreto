// minhas-acoes.js — lista denúncias e coletas do usuário logado

const POR_PAGINA = 10;

let todasDenuncias = [];
let paginaDenuncias = 1;

let todasColetas = [];
let paginaColetas = 1;

(async () => {
  const ok = await requireAuth();
  if (!ok) return;
  await Promise.all([carregarDenuncias(), carregarColetas()]);
})();

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

async function carregarDenuncias() {
  const res = await apiGet('/api/reports/mine');
  todasDenuncias = await res.json();

  if (todasDenuncias.length === 0) {
    document.getElementById('lista-denuncias').innerHTML = '<p class="empty-state">Você ainda não fez nenhuma denúncia.</p>';
    document.getElementById('paginacao-denuncias').innerHTML = '';
    return;
  }

  renderPaginaDenuncias(1);
}

function renderPaginaDenuncias(pagina) {
  paginaDenuncias = pagina;
  const inicio = (pagina - 1) * POR_PAGINA;
  const itens = todasDenuncias.slice(inicio, inicio + POR_PAGINA);

  const lista = document.getElementById('lista-denuncias');
  lista.innerHTML = itens.map(d => `
    <div class="card" style="margin-bottom:1rem">
      <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:0.4rem">${formatarData(d.created_at)}</p>
      <p style="margin-bottom:0.4rem">${d.description}</p>
      <p style="font-size:0.85rem;color:var(--text-secondary)">${d.address}${d.city ? `, ${d.city}/${d.state}` : ''}</p>
    </div>
  `).join('');

  renderPaginacaoDenuncias();
}

function renderPaginacaoDenuncias() {
  const totalPaginas = Math.ceil(todasDenuncias.length / POR_PAGINA);
  const container = document.getElementById('paginacao-denuncias');
  if (totalPaginas <= 1) { container.innerHTML = ''; return; }
  let html = '';
  if (paginaDenuncias > 1) html += `<button class="btn btn-outline" onclick="renderPaginaDenuncias(${paginaDenuncias - 1})">← Anterior</button>`;
  html += `<span style="color:var(--text-secondary);font-size:0.9rem">Página ${paginaDenuncias} de ${totalPaginas}</span>`;
  if (paginaDenuncias < totalPaginas) html += `<button class="btn btn-outline" onclick="renderPaginaDenuncias(${paginaDenuncias + 1})">Próxima →</button>`;
  container.innerHTML = html;
}

async function carregarColetas() {
  const res = await apiGet('/api/collections/mine');
  todasColetas = await res.json();

  if (todasColetas.length === 0) {
    document.getElementById('lista-coletas').innerHTML = '<p class="empty-state">Você ainda não solicitou nenhuma coleta.</p>';
    document.getElementById('paginacao-coletas').innerHTML = '';
    return;
  }

  renderPaginaColetas(1);
}

function renderPaginaColetas(pagina) {
  paginaColetas = pagina;
  const inicio = (pagina - 1) * POR_PAGINA;
  const itens = todasColetas.slice(inicio, inicio + POR_PAGINA);

  const lista = document.getElementById('lista-coletas');
  lista.innerHTML = itens.map(c => `
    <div class="card" style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
        <strong>${traduzirMaterial(c.material_type)}</strong>
        <span class="badge badge-${c.status}">${traduzirStatus(c.status)}</span>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary)">
        Agendado para: ${formatarData(c.scheduled_date)}
      </p>
      <p style="font-size:0.85rem;color:var(--text-secondary)">${c.address}, ${c.city}/${c.state}</p>
      ${['pending', 'under_review'].includes(c.status) ? `
        <button class="btn btn-danger mt-2" onclick="cancelarColeta(${c.id})">Cancelar</button>
      ` : ''}
    </div>
  `).join('');

  renderPaginacaoColetas();
}

function renderPaginacaoColetas() {
  const totalPaginas = Math.ceil(todasColetas.length / POR_PAGINA);
  const container = document.getElementById('paginacao-coletas');
  if (totalPaginas <= 1) { container.innerHTML = ''; return; }
  let html = '';
  if (paginaColetas > 1) html += `<button class="btn btn-outline" onclick="renderPaginaColetas(${paginaColetas - 1})">← Anterior</button>`;
  html += `<span style="color:var(--text-secondary);font-size:0.9rem">Página ${paginaColetas} de ${totalPaginas}</span>`;
  if (paginaColetas < totalPaginas) html += `<button class="btn btn-outline" onclick="renderPaginaColetas(${paginaColetas + 1})">Próxima →</button>`;
  container.innerHTML = html;
}

function traduzirStatus(status) {
  const map = {
    pending: 'Pendente',
    under_review: 'Em análise',
    completed: 'Concluída',
    cancelled: 'Cancelada',
  };
  return map[status] || status;
}

function traduzirMaterial(material) {
  const map = {
    plastic: 'Plástico',
    paper: 'Papel',
    glass: 'Vidro',
    metal: 'Metal',
  };
  return map[material] || material;
}

async function cancelarColeta(id) {
  if (!confirm('Tem certeza que deseja cancelar esta coleta?')) return;

  const res = await apiPatch(`/api/collections/${id}/cancel`);
  const data = await res.json();

  if (res.ok) {
    const paginaAnterior = paginaColetas;
    const resColetas = await apiGet('/api/collections/mine');
    todasColetas = await resColetas.json();
    const totalPaginas = Math.ceil(todasColetas.length / POR_PAGINA);
    renderPaginaColetas(Math.min(paginaAnterior, totalPaginas || 1));
  } else {
    alert(data.error || 'Erro ao cancelar coleta.');
  }
}
