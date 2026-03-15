// login.js — lógica de abas + submit de login e cadastro

// Troca de abas
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `msg show msg-${type}`;
}

// Login
document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const res = await apiPost('/api/users/login', { email, password });
  const data = await res.json();

  if (res.ok) {
    window.location.href = '/';
  } else {
    showMsg('login-msg', data.error || 'Erro ao fazer login.', 'error');
  }
});

// Cadastro
document.getElementById('form-register').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  const res = await apiPost('/api/users/register', { name, email, password });
  const data = await res.json();

  if (res.ok) {
    window.location.href = '/';
  } else {
    showMsg('reg-msg', data.error || 'Erro ao criar conta.', 'error');
  }
});
