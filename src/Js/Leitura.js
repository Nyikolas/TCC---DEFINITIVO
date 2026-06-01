const API_BASE = getApiBase();

function getApiBase() {
  if (window.UNIREAD_API_BASE) return window.UNIREAD_API_BASE;
  const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (window.location.protocol === 'file:' || (local && window.location.port !== '3000')) {
    return 'http://localhost:3000/api';
  }
  return '/api';
}

let currentMangaId = null;
let currentTitle = 'Obra';
let currentChapters = [];
let currentChapterIndex = 0;
let currentPageIndex = 0;
let currentPages = [];
let sidebarAberta = true;
let favoritado = false;
let leituraUltimoTick = null;
let modoLeitura = 'paginas'; // 'paginas' | 'scroll'

async function initializeReader() {
  const params = new URLSearchParams(window.location.search);
  let mangaId = params.get('mangaId');
  const title = params.get('title') || 'Obra';

  currentTitle = title;
  currentMangaId = mangaId;
  document.getElementById('tituloManga').textContent = title;
  document.title = `Lendo: ${title} - UniRead`;

  mostrarLoading(true);

  if (!mangaId) {
    try {
      const manga = await buscarMangaPorTitulo(title);
      mangaId = manga?.id || null;
      currentMangaId = mangaId;

      if (manga?.titulo) {
        currentTitle = manga.titulo;
        document.getElementById('tituloManga').textContent = manga.titulo;
        document.title = `Lendo: ${manga.titulo} - UniRead`;
      }
    } catch (err) {
      console.error('[buscar manga por titulo]', err);
      mostrarErro(`Backend ou MangaDex indisponivel: ${escapeHtml(err.message)}`);
      mostrarLoading(false);
      return;
    }
  }

  if (!mangaId) {
    mostrarErro('Nenhuma obra do MangaDex foi encontrada para este titulo.');
    mostrarLoading(false);
    return;
  }

  try {
    await carregarCapitulos(mangaId);

    if (currentChapters.length === 0) {
      mostrarErro('Nenhum capitulo com paginas foi encontrado no MangaDex.');
      return;
    }

    renderSidebar();
    atualizarSelect();
    await carregarCapitulo(Number(params.get('capitulo') || 0));
  } catch (err) {
    console.error('[leitura]', err);
    mostrarErro(`Erro ao carregar a obra: ${escapeHtml(err.message)}`);
  } finally {
    mostrarLoading(false);
  }
}

async function buscarMangaPorTitulo(title) {
  const json = await fetchJson(`${API_BASE}/manga/buscar?titulo=${encodeURIComponent(title)}`);
  return json.mangas?.[0] || null;
}

async function carregarCapitulos(mangaId) {
  const json = await fetchJson(`${API_BASE}/manga/${mangaId}/capitulos`);
  currentChapters = json.capitulos || [];
}

async function buscarPaginas(chapterId) {
  const json = await fetchJson(`${API_BASE}/capitulo/${chapterId}/paginas`);
  return json.paginas || [];
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(json.detalhe || json.erro || json.error || `HTTP ${res.status}`);
  }

  return json;
}

async function salvarProgressoSupabase(mangaId, chapterId, pagina) {
  try {
    await fetch(`${API_BASE}/progresso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mangaId, chapterId, pagina }),
    });
  } catch (err) {
    console.warn('[progresso]', err);
  }
}

function renderSidebar() {
  const lista = document.getElementById('sidebarLista');
  lista.innerHTML = '';

  currentChapters.forEach((chapter, index) => {
    const titulo = getTituloCapitulo(chapter);
    const meta = [
      chapter.idioma || '',
      chapter.data || '',
      chapter.paginas ? `${chapter.paginas} pags` : '',
    ].filter(Boolean).join(' • ');

    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'capitulo-item';
    item.dataset.index = String(index);
    item.innerHTML = `
      <span class="cap-num">${escapeHtml(String(chapter.numero).padStart(2, '0'))}</span>
      <span class="cap-info">
        <span class="cap-titulo">${escapeHtml(titulo)}</span>
        <span class="cap-meta">${escapeHtml(meta)}</span>
      </span>
      <span class="cap-paginas">${chapter.paginas || '-'}p</span>
    `;
    item.onclick = async () => {
      await carregarCapitulo(index);
      if (window.innerWidth <= 768) toggleSidebar(false);
    };
    lista.appendChild(item);
  });
}

function atualizarSidebar() {
  document.querySelectorAll('.capitulo-item').forEach((item, index) => {
    item.classList.toggle('ativo', index === currentChapterIndex);
    item.classList.toggle('lido', index < currentChapterIndex);
  });
}

function atualizarSelect() {
  const select = document.getElementById('selectCapitulo');
  select.innerHTML = '';

  currentChapters.forEach((chapter, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `Cap. ${chapter.numero} - ${getTituloCapitulo(chapter)}`;
    select.appendChild(option);
  });

  select.onchange = async () => {
    await carregarCapitulo(Number(select.value));
  };
}

async function carregarCapitulo(index) {
  const safeIndex = Math.min(Math.max(index, 0), currentChapters.length - 1);
  const chapter = currentChapters[safeIndex];
  if (!chapter) return;

  mostrarLoading(true);
  currentChapterIndex = safeIndex;
  currentPageIndex = 0;

  document.getElementById('capituloAtual').textContent = `Capitulo ${chapter.numero}`;
  document.getElementById('selectCapitulo').value = String(currentChapterIndex);
  atualizarSidebar();

  try {
    currentPages = await buscarPaginas(chapter.id);

    if (currentPages.length === 0) {
      mostrarErro('Este capitulo nao tem paginas disponiveis.');
      return;
    }

    // Carrega no modo correto conforme o modo ativo
    if (modoLeitura === 'scroll') {
      renderScrollMode();
    } else {
      carregarPagina(0);
    }

    document.dispatchEvent(new CustomEvent('leitura:capituloAlterado'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('[capitulo]', err);
    mostrarErro('Erro ao carregar paginas do capitulo.');
  } finally {
    mostrarLoading(false);
  }
}

function carregarPagina(index) {
  const pageIndex = Math.min(Math.max(index, 0), currentPages.length - 1);
  const src = currentPages[pageIndex];
  if (!src) return;

  currentPageIndex = pageIndex;
  const img = document.getElementById('paginaManga');
  const erro = document.getElementById('imagemErro');
  if (erro) erro.hidden = true;

  img.classList.add('carregando');
  img.dataset.fallbackTried = '0';
  img.onload = () => img.classList.remove('carregando');
  img.onerror = () => {
    if (img.dataset.fallbackTried === '0') {
      img.dataset.fallbackTried = '1';
      img.src = src;
      return;
    }

    img.classList.remove('carregando');
    if (erro) erro.hidden = false;
  };
  img.src = proxificarImagem(src);

  atualizarProgresso();

  const chapter = currentChapters[currentChapterIndex];
  if (chapter) salvarProgressoSupabase(currentMangaId, chapter.id, currentPageIndex + 1);
}

function atualizarProgresso() {
  const total = currentPages.length;
  const atual = total === 0 ? 0 : currentPageIndex + 1;
  const pct = total > 0 ? Math.round((atual / total) * 100) : 0;

  document.getElementById('contagemPaginas').textContent = `Pagina ${atual} / ${total}`;
  document.getElementById('progressoFeita').style.width = `${pct}%`;

  document.getElementById('btnAnterior').disabled = currentPageIndex === 0 && currentChapterIndex === 0;
  document.getElementById('btnProximo').disabled =
    currentPageIndex === currentPages.length - 1 &&
    currentChapterIndex === currentChapters.length - 1;

  renderDots();
}

function renderDots() {
  const dots = document.getElementById('paginasDots');
  dots.innerHTML = '';

  if (currentPages.length > 30) return;

  currentPages.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'pagina-dot';
    dot.classList.toggle('ativo', index === currentPageIndex);
    dot.title = `Pagina ${index + 1}`;
    dot.onclick = () => carregarPagina(index);
    dots.appendChild(dot);
  });
}

async function proximaPagina() {
  if (currentPageIndex < currentPages.length - 1) {
    carregarPagina(currentPageIndex + 1);
    return;
  }

  if (currentChapterIndex < currentChapters.length - 1) {
    await carregarCapitulo(currentChapterIndex + 1);
  }
}

async function paginaAnterior() {
  if (currentPageIndex > 0) {
    carregarPagina(currentPageIndex - 1);
    return;
  }

  if (currentChapterIndex > 0) {
    await carregarCapitulo(currentChapterIndex - 1);
    carregarPagina(currentPages.length - 1);
  }
}

function toggleSidebar(forcarAberta) {
  sidebarAberta = typeof forcarAberta === 'boolean' ? forcarAberta : !sidebarAberta;
  document.getElementById('sidebarCapitulos').classList.toggle('fechada', !sidebarAberta);
}

function toggleFavorito() {
  favoritado = !favoritado;
  const btn = document.getElementById('btnFavorito');
  btn.classList.toggle('ativo', favoritado);
  const path = btn.querySelector('svg path');
  if (path) path.setAttribute('fill', favoritado ? 'currentColor' : 'none');
}

function proxificarImagem(src) {
  return `${API_BASE}/imagem?url=${encodeURIComponent(src)}`;
}

function getTituloCapitulo(chapter) {
  const titulo = String(chapter.titulo || '').trim();
  return titulo || `Capitulo ${chapter.numero}`;
}

function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function carregarPerfilHeader() {
  const fotoPerfilNav = document.getElementById('fotoPerfilNav');
  if (!fotoPerfilNav) return;

  fotoPerfilNav.src = localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/40';
}

function mostrarLoading(ativo) {
  let el = document.getElementById('loadingOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loadingOverlay';
    el.style.cssText = `
      position:fixed;inset:0;z-index:500;
      display:flex;align-items:center;justify-content:center;
      background:rgba(6,6,8,0.7);backdrop-filter:blur(4px);
    `;
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;">
        <div style="
          width:36px;height:36px;border-radius:50%;
          border:2px solid rgba(139,92,246,0.2);
          border-top-color:#8b5cf6;
          animation:spin 0.7s linear infinite;
        "></div>
        <span style="font-size:13px;color:#9090a8;">Carregando...</span>
      </div>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    `;
    document.body.appendChild(el);
  }

  el.style.display = ativo ? 'flex' : 'none';
}

function mostrarErro(msg) {
  const area = document.getElementById('areaImagem');
  area.innerHTML = `
    <div class="reader-error">
      <p>${msg}</p>
      <a href="index.html">Voltar para Home</a>
    </div>
  `;
  document.getElementById('contagemPaginas').textContent = 'Pagina 0 / 0';
  document.getElementById('progressoFeita').style.width = '0%';
}

function salvarTempoLeitura() {
  if (document.hidden || !leituraUltimoTick) return;

  const agora = Date.now();
  const segundos = Math.floor((agora - leituraUltimoTick) / 1000);
  if (segundos <= 0) return;

  const atual = Number(localStorage.getItem('tempoLeituraSegundos') || '0');
  localStorage.setItem('tempoLeituraSegundos', String(atual + segundos));
  leituraUltimoTick = agora;
}

function iniciarContadorLeitura() {
  leituraUltimoTick = Date.now();
  setInterval(salvarTempoLeitura, 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      salvarTempoLeitura();
      leituraUltimoTick = null;
    } else {
      leituraUltimoTick = Date.now();
    }
  });
  window.addEventListener('beforeunload', salvarTempoLeitura);
}

// ── Modo de leitura ──────────────────────────────────────────────────────────

function setModoLeitura(modo) {
  modoLeitura = modo;
  const leitor = document.getElementById('leitorContainer');
  const btnPaginas = document.getElementById('btnModoPaginas');
  const btnScroll  = document.getElementById('btnModoScroll');

  if (modo === 'scroll') {
    leitor.classList.add('modo-scroll');
    btnScroll?.classList.add('ativo');
    btnPaginas?.classList.remove('ativo');
    renderScrollMode();
  } else {
    leitor.classList.remove('modo-scroll');
    btnPaginas?.classList.add('ativo');
    btnScroll?.classList.remove('ativo');
    // Restaura a imagem original e a navegação
    const area = document.getElementById('areaImagem');
    area.innerHTML = `
      <img src="" alt="Página do Mangá" class="pagina-manga" id="paginaManga">
      <div class="imagem-erro" id="imagemErro" hidden>
        <strong>Imagem indisponivel</strong>
        <span>Use Proximo ou tente recarregar o capitulo.</span>
      </div>
    `;
    carregarPagina(currentPageIndex);
  }
}

function renderScrollMode() {
  const area = document.getElementById('areaImagem');
  area.innerHTML = '';

  currentPages.forEach((src, i) => {
    const img = document.createElement('img');
    img.className = 'pagina-manga';
    img.alt = `Página ${i + 1}`;
    img.loading = 'lazy';
    img.src = proxificarImagem(src);
    area.appendChild(img);
  });
}

// ────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  carregarPerfilHeader();
  initializeReader();
  iniciarContadorLeitura();

  document.getElementById('btnSidebar')?.addEventListener('click', () => toggleSidebar());
  document.getElementById('btnCloseSidebar')?.addEventListener('click', () => toggleSidebar(false));
  document.getElementById('btnAnterior')?.addEventListener('click', paginaAnterior);
  document.getElementById('btnProximo')?.addEventListener('click', proximaPagina);
  document.getElementById('btnFavorito')?.addEventListener('click', toggleFavorito);

  // Botões de modo de leitura
  document.getElementById('btnModoPaginas')?.addEventListener('click', () => setModoLeitura('paginas'));
  document.getElementById('btnModoScroll')?.addEventListener('click', () => setModoLeitura('scroll'));

  // Ativa o modo padrão (páginas) visualmente
  document.getElementById('btnModoPaginas')?.classList.add('ativo');

  const input = document.getElementById('inputComentario');
  const counter = document.getElementById('charAtual');
  input?.addEventListener('input', () => {
    counter.textContent = input.value.length;
  });

  document.addEventListener('keydown', (event) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') proximaPagina();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') paginaAnterior();
    if (event.key === 'Escape' && sidebarAberta) toggleSidebar(false);
  });
});
