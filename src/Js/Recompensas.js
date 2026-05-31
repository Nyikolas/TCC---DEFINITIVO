// =====================================================================
//  Recompensas.js — Sistema de Molduras e Paletas do UniRead
//  Responsável por:
//    1. Definir todas as recompensas disponíveis (molduras + paletas)
//    2. Verificar quais estão desbloqueadas via localStorage
//    3. Renderizar o card de seleção na página de perfil
//    4. Aplicar o tema e a moldura escolhidos globalmente
// =====================================================================

// ─────────────────────────────────────────────
//  CATÁLOGO DE RECOMPENSAS
//  Para adicionar uma nova: copie um objeto e
//  ajuste os campos. O resto é automático.
// ─────────────────────────────────────────────
const RECOMPENSAS = {

  molduras: [
    {
      id:        'nenhuma',
      nome:      'Nenhuma',
      arquivo:   null,                          // null = sem imagem
      conquista: null,                          // null = sempre desbloqueada
      desbloqueadaPadrao: true,
    },
    {
      id:        'medieval',
      nome:      'Medieval',
      arquivo:   'src/imagens/Moldura_Medieval.png',
      conquista: 'conquista-avido',
      desbloqueadaPadrao: false,
    },
    {
      id:        'terror',
      nome:      'Terror',
      arquivo:   'src/imagens/Moldura_Terror.png',
      conquista: 'conquista-terror',
      desbloqueadaPadrao: false,
    },
    {
      id:        'romance',
      nome:      'Romance',
      arquivo:   'src/imagens/Moldura_Romance.png',
      conquista: 'conquista-otaku',
      desbloqueadaPadrao: false,
    },
  ],

  paletas: [
    {
      id:        'padrao',
      nome:      'Padrão',
      desc:      'Roxo & escuro',
      corFundo:  '#0d0d15',
      corBotao:  '#a855f7',
      conquista: null,
      desbloqueadaPadrao: true,
    },
    {
      id:        'oceano',
      nome:      'Oceano',
      desc:      'Azul & profundo',
      corFundo:  '#07131f',
      corBotao:  '#0ea5e9',
      conquista: null,
      desbloqueadaPadrao: true,
    },
    {
      id:        'halloween',
      nome:      'Halloween',
      desc:      'Laranja & preto',
      corFundo:  '#0a0a00',
      corBotao:  '#f97316',
      conquista: null,
      desbloqueadaPadrao: true,
    },
    {
      id:        'sangue',
      nome:      'Sangue',
      desc:      'Vermelho & escuro',
      corFundo:  '#1a0000',
      corBotao:  '#ef4444',
      conquista: 'conquista-terror',
      desbloqueadaPadrao: false,
    },
    {
      id:        'floresta',
      nome:      'Floresta',
      desc:      'Verde & noturno',
      corFundo:  '#001a05',
      corBotao:  '#10b981',
      conquista: 'conquista-avido',
      desbloqueadaPadrao: false,
    },
    {
      id:        'romance',
      nome:      'Romance',
      desc:      'Rosa & escuro',
      corFundo:  '#1a0010',
      corBotao:  '#ec4899',
      conquista: 'conquista-otaku',
      desbloqueadaPadrao: false,
    },
    {
      id:        'suspense',
      nome:      'Suspense',
      desc:      'Índigo & sombrio',
      corFundo:  '#0a0a12',
      corBotao:  '#6366f1',
      conquista: 'conquista-heroi',
      desbloqueadaPadrao: false,
    },
  ],
};

// ─────────────────────────────────────────────
//  HELPERS DE PERSISTÊNCIA
// ─────────────────────────────────────────────

function getMolduraAtiva() {
  return localStorage.getItem('molduraAtiva') || 'nenhuma';
}

function getPaletaAtiva() {
  const idSalvo = localStorage.getItem('paletaAtiva') || 'padrao';
  return RECOMPENSAS.paletas.some(p => p.id === idSalvo) ? idSalvo : 'padrao';
}

function getConquistasDesbloqueadas() {
  return JSON.parse(localStorage.getItem('conquistasDesbloqueadas') || '[]');
}

function isMolduraDesbloqueada(moldura) {
  if (moldura.desbloqueadaPadrao) return true;
  return getConquistasDesbloqueadas().includes(moldura.conquista);
}

function isPaletaDesbloqueada(paleta) {
  if (paleta.desbloqueadaPadrao) return true;
  return getConquistasDesbloqueadas().includes(paleta.conquista);
}

// ─────────────────────────────────────────────
//  APLICAR TEMA GLOBALMENTE
//  Chamada em TODA página ao carregar
// ─────────────────────────────────────────────

function aplicarTemaGlobal() {
  const idPaleta = getPaletaAtiva();
  const paleta   = RECOMPENSAS.paletas.find(p => p.id === idPaleta) || RECOMPENSAS.paletas[0];

  const r = document.documentElement;
  r.style.setProperty('--cor-fundo',       paleta.corFundo);
  r.style.setProperty('--cor-principal',   paleta.corBotao);
  r.style.setProperty('--cor-principal-clara', ajustarBrilho(paleta.corBotao, 28));

  // Cores derivadas calculadas automaticamente
  r.style.setProperty('--cor-card',        ajustarBrilho(paleta.corFundo, 12));
  r.style.setProperty('--cor-navbar',      hexParaRgba(paleta.corFundo, 0.95));
  r.style.setProperty('--cor-borda',       hexParaRgba(paleta.corBotao, 0.2));
  r.style.setProperty('--cor-borda-hover', hexParaRgba(paleta.corBotao, 0.55));
  r.style.setProperty('--cor-destaque',    hexParaRgba(paleta.corBotao, 0.12));
}

function aplicarMolduraGlobal() {
  // Sincroniza a foto da navbar em todas as páginas
  const fotoSalva = localStorage.getItem('userAvatar');
  const navImg = document.getElementById('fotoPerfilNav');
  if (navImg && fotoSalva) navImg.src = fotoSalva;
}

// ─────────────────────────────────────────────
//  UTILITÁRIOS DE COR
// ─────────────────────────────────────────────

function hexParaRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function ajustarBrilho(hex, delta) {
  let r = Math.max(0, Math.min(255, parseInt(hex.slice(1,3), 16) + delta));
  let g = Math.max(0, Math.min(255, parseInt(hex.slice(3,5), 16) + delta));
  let b = Math.max(0, Math.min(255, parseInt(hex.slice(5,7), 16) + delta));
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

// ─────────────────────────────────────────────
//  RENDERIZAR CARD DE RECOMPENSAS (só no perfil)
// ─────────────────────────────────────────────

function renderizarCardRecompensas() {
  const container = document.getElementById('card-recompensas');
  if (!container) return; // não está na página de perfil

  const molduraAtiva = getMolduraAtiva();
  const paletaAtiva  = getPaletaAtiva();
  const fotoSrc      = localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150';

  container.innerHTML = `
    <div class="recompensas-secao">
      <h4 class="recomp-subtitulo">🖼️ Molduras</h4>
      <div class="recomp-grid" id="grid-molduras">
        ${RECOMPENSAS.molduras.map(m => renderMolduraSlot(m, molduraAtiva, fotoSrc)).join('')}
      </div>
    </div>

    <div class="recompensas-secao">
      <h4 class="recomp-subtitulo">🎨 Paletas de Cores</h4>
      <p class="recomp-aviso">As cores mudam o visual em todo o site</p>
      <div class="recomp-grid paletas" id="grid-paletas">
        ${RECOMPENSAS.paletas.map(p => renderPaletaSlot(p, paletaAtiva)).join('')}
      </div>

      <div class="preview-paleta" id="preview-paleta">
        <span class="preview-rotulo">Preview:</span>
        <div class="preview-box" id="previewBox">
          <span class="preview-site-nome">UniRead</span>
          <button class="preview-btn" id="previewBtn">Ler agora</button>
        </div>
      </div>

      <button class="btn-salvar-tema" id="btn-salvar-tema">✅ Aplicar ao Site</button>
    </div>
  `;

  // Preview inicial
  atualizarPreview(getPaletaAtiva());

  // Eventos das molduras
  document.querySelectorAll('.moldura-slot[data-desbloqueada="true"]').forEach(slot => {
    slot.addEventListener('click', () => {
      const id = slot.dataset.id;
      selecionarMoldura(id);
    });
  });

  // Eventos das paletas
  document.querySelectorAll('.paleta-slot[data-desbloqueada="true"]').forEach(slot => {
    slot.addEventListener('click', () => {
      const id = slot.dataset.id;
      selecionarPaletaPreview(id);
    });
  });

  // Botão salvar
  document.getElementById('btn-salvar-tema').addEventListener('click', salvarPaleta);
}

function renderMolduraSlot(moldura, molduraAtiva, fotoSrc) {
  const desbloqueada = isMolduraDesbloqueada(moldura);
  const ativa        = moldura.id === molduraAtiva;

  const classeSlot = [
    'moldura-slot',
    ativa         ? 'ativa'        : '',
    !desbloqueada ? 'bloqueada'    : '',
  ].join(' ').trim();

  const imgMoldura = (desbloqueada && moldura.arquivo)
    ? `<img class="moldura-img-preview" src="${moldura.arquivo}" alt="${moldura.nome}">`
    : '';

  const cadeado = !desbloqueada
    ? `<div class="slot-cadeado">🔒</div>`
    : '';

  const tooltipTexto = !desbloqueada
    ? `Desbloqueie com a conquista "${moldura.conquista}"`
    : `Clique para usar`;

  return `
    <div class="${classeSlot}"
         data-id="${moldura.id}"
         data-desbloqueada="${desbloqueada}"
         title="${tooltipTexto}">
      <div class="slot-avatar-wrap">
        <img class="slot-foto" src="${fotoSrc}" alt="foto">
        ${imgMoldura}
        ${cadeado}
      </div>
      <span class="slot-nome ${desbloqueada ? 'desbloqueada' : ''}">${moldura.nome}</span>
    </div>
  `;
}

function renderPaletaSlot(paleta, paletaAtiva) {
  const desbloqueada = isPaletaDesbloqueada(paleta);
  const ativa        = paleta.id === paletaAtiva;

  const classeSlot = [
    'paleta-slot',
    ativa         ? 'ativa'     : '',
    !desbloqueada ? 'bloqueada' : '',
  ].join(' ').trim();

  const descTexto = !desbloqueada
    ? `🔒 Conquista necessária`
    : paleta.desc;

  return `
    <div class="${classeSlot}"
         data-id="${paleta.id}"
         data-fundo="${paleta.corFundo}"
         data-botao="${paleta.corBotao}"
         data-desbloqueada="${desbloqueada}"
         title="${!desbloqueada ? 'Conquista: ' + paleta.conquista : 'Clique para pré-visualizar'}">
      <div class="paleta-circulo">
        <div class="paleta-metade" style="background:${paleta.corFundo}"></div>
        <div class="paleta-metade" style="background:${paleta.corBotao}"></div>
      </div>
      <span class="paleta-nome">${paleta.nome}</span>
      <span class="paleta-desc">${descTexto}</span>
    </div>
  `;
}

// ─────────────────────────────────────────────
//  AÇÕES DE SELEÇÃO
// ─────────────────────────────────────────────

let paletaPreviewAtual = getPaletaAtiva(); // controla o preview sem salvar ainda

function selecionarMoldura(id) {
  // Salva imediatamente (moldura não precisa de "aplicar")
  localStorage.setItem('molduraAtiva', id);

  // Atualiza visual dos slots
  document.querySelectorAll('.moldura-slot').forEach(s => s.classList.remove('ativa'));
  const slotAtivo = document.querySelector(`.moldura-slot[data-id="${id}"]`);
  if (slotAtivo) slotAtivo.classList.add('ativa');

  // Atualiza o avatar real na página
  atualizarAvatarPagina(id);

  mostrarToastRecomp('🖼️ Moldura aplicada!');
}

function selecionarPaletaPreview(id) {
  paletaPreviewAtual = id;

  // Atualiza visual dos slots
  document.querySelectorAll('.paleta-slot').forEach(s => s.classList.remove('ativa'));
  const slotAtivo = document.querySelector(`.paleta-slot[data-id="${id}"]`);
  if (slotAtivo) slotAtivo.classList.add('ativa');

  atualizarPreview(id);
}

function salvarPaleta() {
  localStorage.setItem('paletaAtiva', paletaPreviewAtual);
  aplicarTemaGlobal(); // aplica imediatamente na página atual

  const btn = document.getElementById('btn-salvar-tema');
  if (btn) {
    btn.textContent = '✅ Aplicado!';
    setTimeout(() => btn.textContent = '✅ Aplicar ao Site', 2000);
  }

  mostrarToastRecomp('🎨 Tema aplicado ao site!');
}

function atualizarPreview(idPaleta) {
  const paleta = RECOMPENSAS.paletas.find(p => p.id === idPaleta) || RECOMPENSAS.paletas[0];
  const previewBox = document.getElementById('previewBox');
  const previewBtn = document.getElementById('previewBtn');
  if (previewBox) previewBox.style.background = paleta.corFundo;
  if (previewBtn) previewBtn.style.background  = paleta.corBotao;
}

function atualizarAvatarPagina(idMoldura) {
  const moldura    = RECOMPENSAS.molduras.find(m => m.id === idMoldura);
  const molduraImg = document.getElementById('molduraConquista');
  if (!molduraImg) return;

  if (!moldura || !moldura.arquivo) {
    molduraImg.classList.remove('ativa');
  } else {
    molduraImg.src = moldura.arquivo;
    molduraImg.classList.add('ativa');
  }
}

// ─────────────────────────────────────────────
//  TOAST DE NOTIFICAÇÃO
// ─────────────────────────────────────────────

function mostrarToastRecomp(mensagem) {
  let toast = document.getElementById('toast-recomp');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-recomp';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: var(--cor-principal, #a855f7);
      color: #fff;
      padding: 13px 28px;
      border-radius: 30px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      z-index: 9999;
      opacity: 0;
      transition: all 0.4s ease;
      white-space: nowrap;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = mensagem;
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(80px)';
  }, 3200);
}

// ─────────────────────────────────────────────
//  INICIALIZAÇÃO — roda em toda página
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  aplicarTemaGlobal();    // aplica paleta salva
  aplicarMolduraGlobal(); // sincroniza foto da navbar
  renderizarCardRecompensas(); // renderiza card (só funciona na página de perfil)

  // Restaura a moldura ativa no avatar do perfil
  const molduraAtiva = getMolduraAtiva();
  if (molduraAtiva !== 'nenhuma') {
    atualizarAvatarPagina(molduraAtiva);
  }
});
