// home-map.js — mapa de pontos de coleta na home

const TIPO_CORES = {
  recyclable: '#3a7d44',
  electronic: '#2a4365',
  oil:        '#744210',
  battery:    '#742a2a',
  organic:    '#7b341e',
  medication: '#44337a',
};

const TIPO_LABELS = {
  recyclable: 'Reciclável',
  electronic: 'Eletrônico',
  oil:        'Óleo',
  battery:    'Bateria',
  organic:    'Orgânico',
  medication: 'Medicamento',
};

async function iniciarMapaHome() {
  const mapa = L.map('mapa-home').setView([-26.3044, -48.8487], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(mapa);

  try {
    const res = await fetch('/api/collection-points');
    const pontos = await res.json();

    if (pontos.length === 0) return;

    pontos.forEach(p => {
      const cor = TIPO_CORES[p.type] || '#555';
      const icone = L.divIcon({
        className: '',
        html: `<div style="background:${cor};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([p.latitude, p.longitude], { icon: icone }).addTo(mapa);
      marker.bindPopup(`
        <strong>${p.name}</strong><br>
        <span style="color:#555;font-size:0.85em">${TIPO_LABELS[p.type] || p.type}</span><br>
        <span style="font-size:0.85em">${p.address}</span>
        ${p.neighborhood ? `<br><span style="font-size:0.82em;color:#777">${p.neighborhood}</span>` : ''}
      `);
    });

    // Ajusta o zoom para mostrar todos os pontos
    if (pontos.length > 0) {
      const grupo = L.featureGroup(
        pontos.map(p => L.marker([p.latitude, p.longitude]))
      );
      mapa.fitBounds(grupo.getBounds().pad(0.15));
    }
  } catch (e) {
    console.warn('Não foi possível carregar pontos de coleta no mapa:', e);
  }
}

iniciarMapaHome();
