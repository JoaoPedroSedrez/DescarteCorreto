// contribua.js — formulários de denúncia e solicitação de coleta
// Requer autenticação — redireciona para login se não logado

(async () => {
  const ok = await requireAuth();
  if (!ok) return; // requireAuth já redirecionou
})();

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `msg show msg-${type}`;
}

// Máscara automática para o campo de data (DD/MM/AAAA)
document.getElementById('coleta-data').addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 8);
  if (v.length >= 5) v = v.slice(0,2) + '/' + v.slice(2,4) + '/' + v.slice(4);
  else if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
  e.target.value = v;
});

// Máscara automática para o campo de hora (HH:MM)
document.getElementById('coleta-hora').addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0,2) + ':' + v.slice(2);
  e.target.value = v;
});

// Formulário de denúncia
document.getElementById('form-denuncia').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const res = await apiPostForm('/api/reports', formData);
  const data = await res.json();

  if (res.ok) {
    showMsg('denuncia-msg', 'Denúncia enviada com sucesso!', 'success');
    form.reset();
  } else {
    const erros = data.errors ? Object.values(data.errors).flat().join(', ') : data.error;
    showMsg('denuncia-msg', erros || 'Erro ao enviar denúncia.', 'error');
  }
});

// Formulário de coleta
document.getElementById('form-coleta').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const dateRaw = document.getElementById('coleta-data').value; // DD/MM/AAAA
  const time    = document.getElementById('coleta-hora').value;  // HH:MM

  if (!dateRaw || !time) {
    showMsg('coleta-msg', 'Informe a data e a hora da coleta.', 'error');
    return;
  }

  // Converte DD/MM/AAAA → AAAA-MM-DD para montar o Date
  const [day, month, year] = dateRaw.split('/');
  if (!day || !month || !year || year.length !== 4) {
    showMsg('coleta-msg', 'Data inválida. Use o formato DD/MM/AAAA.', 'error');
    return;
  }

  const localDateTime = new Date(`${year}-${month}-${day}T${time}:00`);
  if (isNaN(localDateTime.getTime())) {
    showMsg('coleta-msg', 'Data ou hora inválida.', 'error');
    return;
  }

  // Envia como ISO UTC para o backend calcular as 48h corretamente
  formData.set('scheduled_date', localDateTime.toISOString());

  const res = await apiPostForm('/api/collections', formData);
  const data = await res.json();

  if (res.ok) {
    showMsg('coleta-msg', 'Solicitação de coleta enviada com sucesso!', 'success');
    form.reset();
  } else {
    const erros = data.errors ? Object.values(data.errors).flat().join(', ') : data.error;
    showMsg('coleta-msg', erros || 'Erro ao solicitar coleta.', 'error');
  }
});

// Exibe a data mínima (48h) como placeholder informativo
const dataMin = new Date(Date.now() + 48 * 60 * 60 * 1000);
const pad = n => String(n).padStart(2, '0');
document.getElementById('coleta-data').placeholder =
  `a partir de ${pad(dataMin.getDate())}/${pad(dataMin.getMonth()+1)}/${dataMin.getFullYear()}`;
