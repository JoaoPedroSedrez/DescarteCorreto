// auth.js — gerencia estado de autenticação e atualiza a navbar
// Deve ser carregado em TODAS as páginas, após api.js

let currentUser = null;

async function loadAuth() {
  const res = await apiGet('/api/users/me');
  if (res.ok) {
    currentUser = await res.json();
  }
  updateNavbar();
}

function updateNavbar() {
  const authArea = document.getElementById('nav-auth');
  if (!authArea) return;

  if (currentUser) {
    authArea.innerHTML = `
      <span style="color:rgba(255,255,255,0.85);font-size:0.9rem">Olá, ${currentUser.name.split(' ')[0]}</span>
      <a href="/pages/minhas-acoes.html" class="btn-nav">Minhas Ações</a>
      <button onclick="logout()" class="btn-nav" style="cursor:pointer;border:none;font-family:inherit;font-size:0.95rem">Sair</button>
    `;
  } else {
    authArea.innerHTML = `<a href="/pages/login.html" class="btn-nav">Entrar</a>`;
  }
}

async function logout() {
  await apiPost('/api/users/logout', {});
  window.location.href = '/';
}

// requireAuth(): redireciona para login se não estiver autenticado
// Chamar no início do JS de páginas protegidas
async function requireAuth() {
  const res = await apiGet('/api/users/me');
  if (!res.ok) {
    window.location.href = '/pages/login.html';
    return false;
  }
  currentUser = await res.json();
  updateNavbar();
  return true;
}

// Hamburger menu toggle
function toggleNavMenu() {
  const links = document.querySelector('.navbar-links');
  if (links) links.classList.toggle('open');
}

// Fecha o menu ao clicar em qualquer link/botão dentro da navbar
document.addEventListener('click', function(e) {
  if (e.target.closest('.navbar-links a, .navbar-links button')) {
    const links = document.querySelector('.navbar-links');
    if (links) links.classList.remove('open');
  }
});

// Carrega auth automaticamente ao incluir o script
loadAuth();
