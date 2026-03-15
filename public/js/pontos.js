// pontos.js — carrega e exibe pontos de coleta com filtro

const TIPO_LABELS = {
  recyclable: 'Reciclável',
  electronic: 'Eletrônico',
  oil: 'Óleo',
  battery: 'Bateria',
  organic: 'Orgânico',
  medication: 'Medicamento',
};

async function carregarPontos() {
  const tipo = document.getElementById('filtro-tipo').value;
  const bairro = document.getElementById('filtro-bairro').value.trim();

  let url = '/api/collection-points';
  if (tipo) url += `?type=${encodeURIComponent(tipo)}`;
  else if (bairro) url += `?neighborhood=${encodeURIComponent(bairro)}`;

  const res = await apiGet(url);
  const pontos = await res.json();
  renderPontos(pontos);
}

function renderPontos(pontos) {
  const lista = document.getElementById('lista-pontos');

  if (pontos.length === 0) {
    lista.innerHTML = '<p class="empty-state">Nenhum ponto de coleta encontrado para este filtro.</p>';
    return;
  }

  lista.innerHTML = pontos.map(p => `
    <div class="card" style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem">
        <strong style="font-size:1rem">${p.name}</strong>
        <span class="badge badge-${p.type}">${TIPO_LABELS[p.type] || p.type}</span>
      </div>
      <p style="font-size:0.9rem;color:var(--text-secondary)">${p.address}</p>
      ${p.neighborhood ? `<p style="font-size:0.85rem;color:var(--text-secondary)">${p.neighborhood} — ${p.city}/${p.state}</p>` : ''}
      ${p.description ? `<p style="font-size:0.85rem;margin-top:0.5rem">${p.description}</p>` : ''}
    </div>
  `).join('');
}

// Evento de filtro — tipo e bairro são mutuamente exclusivos
document.getElementById('filtro-tipo').addEventListener('change', () => {
  if (document.getElementById('filtro-tipo').value) {
    document.getElementById('filtro-bairro').value = '';
  }
  carregarPontos();
});

document.getElementById('btn-filtrar').addEventListener('click', () => {
  if (document.getElementById('filtro-bairro').value) {
    document.getElementById('filtro-tipo').value = '';
  }
  carregarPontos();
});

// Carrega tudo ao abrir a página
carregarPontos();
