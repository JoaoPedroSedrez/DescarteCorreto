// api.js — helpers para chamadas à API
// Todas as requisições usam credentials: 'include' para enviar o cookie de sessão

async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
  });
  return res;
}

async function apiGet(path) {
  return apiFetch(path);
}

async function apiPost(path, body) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// Para formulários com upload de arquivo (multipart/form-data)
// Não setar Content-Type manualmente — o browser define com o boundary correto
async function apiPostForm(path, formData) {
  return apiFetch(path, {
    method: 'POST',
    body: formData,
  });
}

async function apiPatch(path) {
  return apiFetch(path, { method: 'PATCH' });
}
