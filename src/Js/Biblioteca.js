// =====================================================================
//  Biblioteca.js
//  Responsável por:
//    1. Filtros por categoria (Tudo, Mangás, Livros, HQs)
//    2. Busca em tempo real nos cards fixos
//    3. Busca na API MangaDex quando o usuário pesquisa
//    4. Ordenação por relevância, nota e título
//    5. Contador de resultados
// =====================================================================

// ─────────────────────────────────────────────
//  REFERÊNCIAS
// ─────────────────────────────────────────────
const gridBiblioteca  = document.getElementById('grid-biblioteca');
const campoPesquisa   = document.getElementById('campo-pesquisa');
const btnBuscar       = document.getElementById('btn-buscar');
const gridVazio       = document.getElementById('gridVazio');
const gridLoading     = document.getElementById('gridLoading');
const resultadosCount = document.getElementById('resultadosCount');
const selectOrdem     = document.getElementById('selectOrdem');
const termoVazioEl    = document.getElementById('termoVazio');

// ─────────────────────────────────────────────
//  ESTADO
// ─────────────────────────────────────────────
let categoriaAtiva = 'Tudo';  // filtro atual
let cardsFixos     = [];       // NodeList dos cards do HTML (salvos antes da API)
let modoAPI        = false;    // true quando exibindo resultados da API

// ─────────────────────────────────────────────
//  SALVA REFERÊNCIA DOS CARDS FIXOS
// ─────────────────────────────────────────────
function salvarCardsFixos() {
    cardsFixos = Array.from(gridBiblioteca.querySelectorAll('.card'));
}

// ─────────────────────────────────────────────
//  FILTRO POR CATEGORIA
//  Funciona tanto nos cards fixos quanto nos da API
// ─────────────────────────────────────────────
function filter(categoria) {
    categoriaAtiva = categoria;

    // Atualiza botões de filtro
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('ativo'));
    const tagAtiva = Array.from(document.querySelectorAll('.tag'))
        .find(t => t.textContent.trim().includes(categoria === 'Tudo' ? 'Tudo'
                                                : categoria === 'Mangás' ? 'Mangás'
                                                : categoria === 'Livros' ? 'Livros'
                                                : 'HQs'));
    if (tagAtiva) tagAtiva.classList.add('ativo');

    // Filtra os cards visíveis
    const todos = Array.from(gridBiblioteca.querySelectorAll('.card'));
    let visiveis = 0;

    todos.forEach(card => {
        const cat = card.dataset.categoria || card.querySelector('.card-categoria')?.textContent.trim();
        let mostrar = false;

        if (categoria === 'Tudo')   mostrar = true;
        else if (categoria === 'Mangás' && cat === 'Mangá') mostrar = true;
        else if (categoria === 'Livros' && cat === 'Livro') mostrar = true;
        else if (categoria === 'HQs'   && cat === 'HQ')    mostrar = true;

        card.style.display = mostrar ? '' : 'none';
        if (mostrar) visiveis++;
    });

    atualizarCount(visiveis);
    mostrarVazio(visiveis === 0, campoPesquisa.value.trim());
}

// ─────────────────────────────────────────────
//  BUSCA NOS CARDS FIXOS (tempo real)
// ─────────────────────────────────────────────
function buscarFixos(termo) {
    const t = termo.toLowerCase();
    let visiveis = 0;

    cardsFixos.forEach(card => {
        const titulo = card.querySelector('.card-titulo')?.textContent.toLowerCase() || '';
        const autor  = card.dataset.autor?.toLowerCase() || '';
        const cat    = card.dataset.categoria || '';

        const matchTexto    = titulo.includes(t) || autor.includes(t);
        const matchCategoria = categoriaAtiva === 'Tudo'
            || (categoriaAtiva === 'Mangás' && cat === 'Mangá')
            || (categoriaAtiva === 'Livros' && cat === 'Livro')
            || (categoriaAtiva === 'HQs'   && cat === 'HQ');

        const mostrar = matchTexto && matchCategoria;
        card.style.display = mostrar ? '' : 'none';
        if (mostrar) visiveis++;
    });

    atualizarCount(visiveis);
    mostrarVazio(visiveis === 0, termo);
}

// ─────────────────────────────────────────────
//  BUSCA NA API MANGADEX
// ─────────────────────────────────────────────
async function buscarNaAPI(termo) {
    mostrarLoading(true);
    modoAPI = true;

    // Remove cards fixos temporariamente
    cardsFixos.forEach(c => c.remove());

    const query = termo
        ? `title=${encodeURIComponent(termo)}`
        : 'order[followedCount]=desc';

    const url = `https://api.mangadex.org/manga?${query}&limit=24&includes[]=author&includes[]=cover_art&contentRating[]=safe`;

    try {
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        mostrarLoading(false);
        exibirCardsAPI(data.data, termo);
    } catch (err) {
        mostrarLoading(false);
        gridBiblioteca.innerHTML = `
            <div class="grid-vazio" style="display:flex;flex-direction:column;align-items:center;gap:12px">
                <span>⚠️</span>
                <p>Não foi possível conectar à API.</p>
                <small>${err.message}</small>
            </div>
        `;
        atualizarCount(0);
    }
}

function exibirCardsAPI(mangas, termo) {
    // Remove cards antigos da API
    gridBiblioteca.querySelectorAll('.card.api-card').forEach(c => c.remove());

    if (!mangas || mangas.length === 0) {
        mostrarVazio(true, termo);
        atualizarCount(0);
        return;
    }

    mangas.forEach(manga => {
        const id     = manga.id;
        const titulo = manga.attributes.title;
        const nome   = titulo.en || titulo['ja-ro'] || titulo[Object.keys(titulo)[0]] || 'Sem título';

        const autorObj = manga.relationships.find(r => r.type === 'author');
        const autor    = autorObj?.attributes?.name || 'Autor desconhecido';

        const capaObj  = manga.relationships.find(r => r.type === 'cover_art');
        const arquivo  = capaObj?.attributes?.fileName;
        const capa     = arquivo
            ? `https://uploads.mangadex.org/covers/${id}/${arquivo}.256.jpg`
            : 'https://via.placeholder.com/256x380?text=Sem+Capa';

        // Nota aleatória entre 3.5 e 5.0 (API não fornece nota pública)
        const nota = (3.5 + Math.random() * 1.5).toFixed(1);

        const card = document.createElement('div');
        card.className    = 'card api-card';
        card.dataset.categoria = 'Mangá';
        card.dataset.autor     = autor.toLowerCase();
        card.dataset.nota      = nota;

        card.innerHTML = `
            <div class="card-img-wrap">
                <img src="${capa}" alt="${nome}"
                     onerror="this.src='https://via.placeholder.com/256x380?text=Sem+Capa'">
                <div class="card-overlay">
                    <button class="overlay-btn">▶ Ler agora</button>
                </div>
            </div>
            <div class="card-info">
                <span class="card-categoria">Mangá</span>
                <h4 class="card-titulo">${nome}</h4>
                <p class="card-autor">${autor}</p>
                <div class="card-avaliacao">
                    ${gerarEstrelas(parseFloat(nota))}
                    <span class="nota">${nota}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `Descrição.html?title=${encodeURIComponent(nome)}`;
        });

        gridBiblioteca.appendChild(card);
    });

    // Aplica filtro de categoria sobre os novos cards
    filter(categoriaAtiva);
}

// Gera HTML das estrelas com base na nota (0-5)
function gerarEstrelas(nota) {
    const cheia  = Math.floor(nota);
    const meia   = nota % 1 >= 0.3 && nota % 1 < 0.8;
    const vazia  = 5 - cheia - (meia ? 1 : 0);

    let html = '<div class="estrelas">';
    for (let i = 0; i < cheia; i++)
        html += '<i class="fa-solid fa-star"></i>';
    if (meia)
        html += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = 0; i < vazia; i++)
        html += '<i class="fa-regular fa-star"></i>';
    html += '</div>';
    return html;
}

// ─────────────────────────────────────────────
//  RESTAURAR CARDS FIXOS
// ─────────────────────────────────────────────
function restaurarCardsFixos() {
    // Remove cards da API
    gridBiblioteca.querySelectorAll('.card.api-card').forEach(c => c.remove());

    // Reinsere cards fixos
    cardsFixos.forEach(c => {
        c.style.display = '';
        gridBiblioteca.appendChild(c);
    });

    modoAPI = false;
    filter(categoriaAtiva);
}

// ─────────────────────────────────────────────
//  ORDENAÇÃO
// ─────────────────────────────────────────────
function ordenar(criterio) {
    const cards = Array.from(gridBiblioteca.querySelectorAll('.card'));

    cards.sort((a, b) => {
        if (criterio === 'nota') {
            return parseFloat(b.dataset.nota || 0) - parseFloat(a.dataset.nota || 0);
        }
        if (criterio === 'titulo') {
            const ta = a.querySelector('.card-titulo')?.textContent || '';
            const tb = b.querySelector('.card-titulo')?.textContent || '';
            return ta.localeCompare(tb, 'pt-BR');
        }
        return 0; // relevância: mantém ordem original
    });

    cards.forEach(c => gridBiblioteca.appendChild(c));
}

// ─────────────────────────────────────────────
//  UTILITÁRIOS DE UI
// ─────────────────────────────────────────────
function atualizarCount(n) {
    if (resultadosCount) {
        resultadosCount.textContent = `${n} obra${n !== 1 ? 's' : ''} encontrada${n !== 1 ? 's' : ''}`;
    }
}

function mostrarVazio(sim, termo) {
    if (!gridVazio) return;
    gridVazio.style.display = sim ? 'block' : 'none';
    if (termoVazioEl) termoVazioEl.textContent = termo || '';
}

function mostrarLoading(sim) {
    if (gridLoading) gridLoading.style.display = sim ? 'flex' : 'none';
}

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Salva os cards fixos antes de qualquer coisa
    salvarCardsFixos();
    atualizarCount(cardsFixos.length);

    // Sincroniza foto do perfil na navbar
    const fotoNav = document.getElementById('fotoPerfilNav');
    const fotoSalva = localStorage.getItem('userAvatar');
    if (fotoNav && fotoSalva) fotoNav.src = fotoSalva;

    // ── Busca ──
    btnBuscar.addEventListener('click', () => {
        const termo = campoPesquisa.value.trim();
        if (!termo) {
            // Sem termo: volta para cards fixos
            restaurarCardsFixos();
            return;
        }
        // Tenta buscar localmente primeiro
        const matchLocal = cardsFixos.filter(c => {
            const titulo = c.querySelector('.card-titulo')?.textContent.toLowerCase() || '';
            const autor  = c.dataset.autor?.toLowerCase() || '';
            return titulo.includes(termo.toLowerCase()) || autor.includes(termo.toLowerCase());
        });

        if (matchLocal.length > 0) {
            // Encontrou nos fixos — filtra localmente
            if (modoAPI) restaurarCardsFixos();
            buscarFixos(termo);
        } else {
            // Não encontrou — vai para a API
            buscarNaAPI(termo);
        }
    });

    // Busca em tempo real (só nos cards fixos)
    campoPesquisa.addEventListener('input', () => {
        const termo = campoPesquisa.value.trim();
        if (modoAPI && !termo) {
            restaurarCardsFixos();
            return;
        }
        if (!modoAPI) {
            if (termo) buscarFixos(termo);
            else {
                cardsFixos.forEach(c => c.style.display = '');
                filter(categoriaAtiva);
            }
        }
    });

    // Enter na barra de busca
    campoPesquisa.addEventListener('keydown', e => {
        if (e.key === 'Enter') btnBuscar.click();
    });

    // Ordenação
    if (selectOrdem) {
        selectOrdem.addEventListener('change', () => ordenar(selectOrdem.value));
    }
});