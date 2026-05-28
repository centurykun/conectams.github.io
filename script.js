// ============================================
// CONECTAMS – script.js
// ============================================

// ---------- MENU MOBILE (hamburguer) ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fecha o menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});


// ---------- HEADER: sombra ao rolar ----------
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


// ---------- ANIMAÇÃO DE ENTRADA AO ROLAR ----------
// Seleciona todos os elementos que devem aparecer com animação
// .hero-media adicionado para a coluna de fotos do hero entrar com fade
const elementosAnimados = document.querySelectorAll(
  'h2, .section-subtitle, .step, .card, .form-info, .form, .badge, #hero h1, .hero-desc, .hero-buttons, .form-benefits, .hero-media'
);

// Adiciona a classe inicial (invisível + deslocado para baixo)
elementosAnimados.forEach(el => {
  el.classList.add('fade-hidden');
});

// Cria o observador: dispara quando o elemento entra na tela
const observador = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-visible');
      // Para de observar depois que o elemento já apareceu
      observador.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12  // Elemento precisa estar ~12% visível para disparar
});

// Registra cada elemento para ser observado
elementosAnimados.forEach(el => observador.observe(el));


// ---------- FORMULÁRIO DE CADASTRO ----------
const form      = document.getElementById('form-cadastro');
const sucesso   = document.getElementById('form-sucesso');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome      = document.getElementById('nome').value.trim();
  const email     = document.getElementById('email').value.trim();
  const area      = document.getElementById('area').value;
  const descricao = document.getElementById('descricao').value.trim();

  if (!nome || !email || !area || !descricao) {
    alert('Por favor, preencha todos os campos antes de enviar.');
    return;
  }

  const resposta = await fetch('https://formspree.io/f/meednlpb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, area, descricao })
  });

  if (resposta.ok) {
    form.reset();
    sucesso.classList.remove('hidden');
    setTimeout(() => sucesso.classList.add('hidden'), 5000);
  } else {
    alert('Erro ao enviar. Tente novamente.');
  }
});

// ---------- MODAIS DE PROJETO ----------

/**
 * Abre o overlay com o id especificado.
 */
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.classList.add('modal-open');
  // Foca o botão de fechar para acessibilidade por teclado
  const closeBtn = overlay.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

/**
 * Fecha o overlay com o id especificado.
 */
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Botões nas cards que abrem o modal correspondente
document.querySelectorAll('.modal-trigger').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(btn.dataset.modal);
  });
});

// Botões de fechar (×) dentro de cada modal
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.close;
    closeModal(id);
  });
});

// Fecha ao clicar no overlay escuro (fora do box)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });
});

// Fecha com a tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
      overlay.classList.remove('active');
    });
    document.body.classList.remove('modal-open');
  }
});
