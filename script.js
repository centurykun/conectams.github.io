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
const submitBtn = form.querySelector('button[type="submit"]');

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

  // Estado de carregamento
  submitBtn.disabled = true;
  submitBtn.classList.add('btn-loading');
  submitBtn.dataset.originalText = submitBtn.textContent;
  submitBtn.innerHTML = '<span class="btn-spinner"></span> Enviando...';

  try {
    const resposta = await fetch('https://formspree.io/f/meednlpb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ nome, email, area, descricao })
    });

    if (resposta.ok) {
      form.reset();
      mostrarPopupSucesso();
    } else {
      alert('Erro ao enviar. Tente novamente.');
    }
  } catch (err) {
    alert('Erro de conexão. Verifique sua internet e tente novamente.');
  } finally {
    // Restaura o botão independente do resultado
    submitBtn.disabled = false;
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = submitBtn.dataset.originalText || 'Enviar cadastro';
  }
});

// ---------- POPUP DE SUCESSO ----------
function mostrarPopupSucesso() {
  // Cria o overlay do popup se ainda não existir
  let overlay = document.getElementById('popup-sucesso-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'popup-sucesso-overlay';
    overlay.innerHTML = `
      <div class="popup-sucesso-box" role="dialog" aria-modal="true" aria-labelledby="popup-titulo">
        <div class="popup-icone">✅</div>
        <h3 id="popup-titulo">Cadastro enviado!</h3>
        <p>Recebemos sua solicitação com sucesso.<br>Entraremos em contato em breve.</p>
        <button class="btn-primary popup-fechar">Fechar</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Fecha ao clicar no fundo escuro
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharPopupSucesso();
    });

    // Fecha ao clicar no botão
    overlay.querySelector('.popup-fechar').addEventListener('click', fecharPopupSucesso);
  }

  // Dois frames encadeados: o 1º deixa o browser pintar o estado inicial
  // (visibility:hidden + opacity:0), o 2º adiciona a classe que dispara a transição.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('popup-ativo');
      setTimeout(fecharPopupSucesso, 6000);
    });
  });

  // Foca o botão de fechar para acessibilidade
  setTimeout(() => overlay.querySelector('.popup-fechar').focus(), 80);
}

function fecharPopupSucesso() {
  const overlay = document.getElementById('popup-sucesso-overlay');
  if (!overlay) return;
  overlay.classList.remove('popup-ativo');
}

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