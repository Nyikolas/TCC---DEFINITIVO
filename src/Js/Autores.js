/* =====================================================
   AUTORES2.JS — UniRead
   Dados e lógica da página de Autores
   Obras: apenas as que estão na Biblioteca.html
   ===================================================== */

/* =====================================================
   BASE DE DADOS
   — Autores e suas obras presentes na Biblioteca
   ===================================================== */
const autores = [
    {
        id: 1,
        nome: 'Eiichiro Oda',
        iniciais: 'EO',
        pais: 'Japonês',
        bandeira: '🇯🇵',
        tipos: ['manga'],
        cor: '#a855f7',
        corFundo: 'linear-gradient(135deg, #1a0a2e, #2d0a6e)',
        notaMedia: 4.9,
        bio: 'Eiichiro Oda é o criador de One Piece, a série de mangá mais vendida da história com mais de 500 milhões de cópias distribuídas. Nascido em 1975 em Kumamoto, Japão, estreou na Shonen Jump em 1997 e desde então mantém a série em publicação contínua, sendo um dos autores mais influentes da cultura pop mundial.',
        obras: [
            {
                titulo: 'One Piece',
                tipo: 'manga',
                nota: 4.9,
                detalhe: 'Mangá • 108 volumes • Em publicação',
                icone: '📖',
                capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_mfpdoof6nd6ej6n2dlhtgsg660/-S897-FWEBP'
            }
        ]
    },
    {
        id: 2,
        nome: 'Kentaro Miura',
        iniciais: 'KM',
        pais: 'Japonês',
        bandeira: '🇯🇵',
        tipos: ['manga'],
        cor: '#f97316',
        corFundo: 'linear-gradient(135deg, #1a0800, #3d1400)',
        notaMedia: 4.9,
        bio: 'Kentaro Miura foi o criador de Berserk, considerado um dos maiores mangás da história. Com um traço extraordinariamente detalhado e uma narrativa épica e visceral, ele influenciou inúmeras obras e criadores nas décadas seguintes. Faleceu em maio de 2021, deixando um legado imortal para a cultura pop.',
        obras: [
            {
                titulo: 'Berserk',
                tipo: 'manga',
                nota: 4.9,
                detalhe: 'Mangá • 41+ volumes • Legado',
                icone: '⚔️',
                capa: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Berserk_vol01.png'
            }
        ]
    },
    {
        id: 3,
        nome: 'Chu-Gong',
        iniciais: 'CG',
        pais: 'Sul-coreano',
        bandeira: '🇰🇷',
        tipos: ['manga'],
        cor: '#3b82f6',
        corFundo: 'linear-gradient(135deg, #020d1f, #04235c)',
        notaMedia: 4.6,
        bio: 'Chu-Gong é o autor do web novel Solo Leveling (나 혼자만 레벨업), publicado originalmente na plataforma coreana KakaoPage. A história de Sung Jin-Woo se tornou um fenômeno global, sendo adaptada para manhwa (quadrinho coreano) e posteriormente para anime, solidificando Chu-Gong como um dos nomes mais relevantes do entretenimento asiático.',
        obras: [
            {
                titulo: 'Solo Leveling',
                tipo: 'manga',
                nota: 4.6,
                detalhe: 'Manhwa • 179 capítulos • Completo',
                icone: '⚡',
                capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_dapavu4fhd04bcjagc4v0sge0a/-S897-FWEBP'
            }
        ]
    },
    {
        id: 4,
        nome: 'J.R.R. Tolkien',
        iniciais: 'JT',
        pais: 'Britânico',
        bandeira: '🇬🇧',
        tipos: ['livro'],
        cor: '#22c55e',
        corFundo: 'linear-gradient(135deg, #011505, #023510)',
        notaMedia: 4.8,
        bio: 'J.R.R. Tolkien foi professor de Oxford e linguista que se tornou o pai da fantasia épica moderna. Criou mundos com idiomas, mitologias e histórias completas. O Senhor dos Anéis é amplamente considerado o livro mais importante do século XX no gênero fantasia, influenciando décadas de escritores, cineastas e designers de jogos.',
        obras: [
            {
                titulo: 'Senhor Dos Anéis',
                tipo: 'livro',
                nota: 4.8,
                detalhe: 'Livro • 3 volumes • Clássico',
                icone: '💍',
                capa: 'https://m.media-amazon.com/images/I/51lkAKXgK4L._SY445_SX342_QL70_ML2_.jpg'
            }
        ]
    },
    {
        id: 5,
        nome: 'George R.R. Martin',
        iniciais: 'GM',
        pais: 'Americano',
        bandeira: '🇺🇸',
        tipos: ['livro'],
        cor: '#ef4444',
        corFundo: 'linear-gradient(135deg, #1a0000, #400000)',
        notaMedia: 4.5,
        bio: 'George R.R. Martin é o autor da série As Crônicas de Gelo e Fogo, da qual Game of Thrones é o primeiro volume. Conhecido por suas narrativas moralmente complexas, personagens multidimensionais e pela disposição de surpreender os leitores. A adaptação da HBO se tornou uma das séries de TV mais assistidas da história.',
        obras: [
            {
                titulo: 'Game of Thrones',
                tipo: 'livro',
                nota: 4.5,
                detalhe: 'Livro • As Crônicas de Gelo e Fogo',
                icone: '👑',
                capa: 'https://i2.wp.com/m.media-amazon.com/images/I/518dGmVCDfL.jpg?w=150&resize=150,200&ssl=1'
            }
        ]
    },
    {
        id: 6,
        nome: 'Vários Autores',
        iniciais: 'VA',
        pais: 'Internacional',
        bandeira: '🌍',
        tipos: ['Livro', 'HQ', 'Mangá'],
        cor: '#f59e0b',
        corFundo: 'linear-gradient(135deg, #1a1000, #3d2800)',
        notaMedia: 4.7,
        bio: 'Batman: Absolute é uma edição especial que reúne algumas das histórias mais icônicas do Batman, escritas e desenhadas por diferentes duplas criativas ao longo das décadas. A coletânea representa o melhor do Cavaleiro das Trevas e é uma referência obrigatória para fãs de HQs.',
        obras: [
            {
                titulo: 'Batman: Absolute',
                tipo: 'hq',
                nota: 4.7,
                detalhe: 'HQ • Edição especial • Coletânea',
                icone: '🦇',
                capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_mose922j392el6h2q2c1nv8g7l/-S897-FWEBP'
            }
        ]
    },
    {
        id: 7,
        nome: 'Inio Asano',
        iniciais: 'IA',
        pais: 'Japonês',
        bandeira: '🇯🇵',
        tipos: ['manga'],
        cor: '#ec4899',
        corFundo: 'linear-gradient(135deg, #1a0010, #3d0030)',
        notaMedia: 4.8,
        bio: 'Inio Asano é um mangaká japonês conhecido por obras de cunho psicológico e introspectivo, com forte realismo e crítica social. Boa Noite Punpun é sua obra mais aclamada, acompanhando o crescimento de Onodera Punpun desde a infância até a idade adulta em uma jornada emocionalmente intensa e perturbadora. Asano é reconhecido por seu estilo único que mistura personagens estilizados com cenários fotorrealistas.',
        obras: [
            {
                titulo: 'Boa Noite Punpun',
                tipo: 'manga',
                nota: 4.8,
                detalhe: 'Mangá • 13 volumes • Completo',
                icone: '🐦',
                capa: 'https://m.media-amazon.com/images/I/51EQ5jMPsHL._SY425_.jpg'
            }
        ]
    },
    {
        id: 8,
        nome: 'Stephen King',
        iniciais: 'SK',
        pais: 'Americano',
        bandeira: '🇺🇸',
        tipos: ['livro'],
        cor: '#dc2626',
        corFundo: 'linear-gradient(135deg, #120000, #2e0000)',
        notaMedia: 4.7,
        bio: 'Stephen King é o mestre do horror moderno, com mais de 70 romances publicados e mais de 350 milhões de cópias vendidas em todo o mundo. O Iluminado, publicado em 1977, é um de seus livros mais icônicos, acompanhando Jack Torrance e sua família no isolado Hotel Overlook. King é considerado um dos autores mais influentes da literatura contemporânea.',
        obras: [
            {
                titulo: 'O Iluminado',
                tipo: 'livro',
                nota: 4.7,
                detalhe: 'Livro • Terror • Clássico',
                icone: '🪓',
                capa: 'https://m.media-amazon.com/images/I/81Q+pJi4NjL._SY466_.jpg'
            }
        ]
    },
    {
        id: 9,
        nome: ' Megan Devine',
        iniciais: 'MD',
        pais: 'Americana',
        bandeira: '🇰🇷',
        tipos: ['Livro'],
        cor: '#06b6d4',
        corFundo: 'linear-gradient(135deg, #001a1f, #00353d)',
        notaMedia: 4.6,
        bio: ' Megan Devine é o autor de "Tudo bem não estar tudo bem", um webtoon coreano de enorme sucesso que explora temas de saúde mental, traumas de infância e relações humanas de forma sensível e poética. A obra foi adaptada para uma popular série de drama coreano transmitida pela Netflix, atingindo audiências globais e abrindo um diálogo importante sobre bem-estar emocional.',
        obras: [
            {
                titulo: 'Tudo bem não estar tudo bem',
                tipo: 'Livro',
                nota: 4.6,
                detalhe: 'Webtoon • Saúde mental • Drama',
                icone: '🦋',
                capa: 'https://m.media-amazon.com/images/I/41VxKlcyCbL._SY445_SX342_ML2_.jpg'
            }
        ]
    },
    {
        id: 10,
        nome: 'C.J. Tudor',
        iniciais: 'CT',
        pais: 'Britânica',
        bandeira: '🇬🇧',
        tipos: ['livro'],
        cor: '#84cc16',
        corFundo: 'linear-gradient(135deg, #0a1200, #1a2800)',
        notaMedia: 4.5,
        bio: 'C.J. Tudor é uma escritora britânica de suspense e terror, aclamada como a "Rainha do Thriller". O Homem de Giz foi seu romance de estreia, publicado em 2018, e se tornou um best-seller internacional. A história, narrada em dois tempos, mistura memórias de infância sombrias com um presente perturbador, estabelecendo Tudor como uma das vozes mais frescas do thriller contemporâneo.',
        obras: [
            {
                titulo: 'O Homem de Giz',
                tipo: 'livro',
                nota: 4.5,
                detalhe: 'Livro • Thriller • Suspense',
                icone: '🖍️',
                capa: 'https://m.media-amazon.com/images/I/71oxE2vkZmL._SY466_.jpg'
            }
        ]
    }
];

/* =====================================================
   ESTADO DA PÁGINA
   ===================================================== */
let filtroAtivo = 'tudo';
let termoBusca  = '';
let ordenacao   = 'nome';

/* =====================================================
   UTILITÁRIOS
   ===================================================== */
function getTipoLabel(tipo) {
    const mapa = { manga: 'Mangá', hq: 'HQ', livro: 'Livro' };
    return mapa[tipo] || tipo;
}

function getBadgeClasse(tipos) {
    return tipos.length > 1 ? 'multiplo' : tipos[0];
}

function getBadgeLabel(tipos) {
    return tipos.length > 1 ? 'Múltiplo' : getTipoLabel(tipos[0]);
}

function getCorObra(tipo) {
    const mapa = {
        manga: { bg: 'rgba(168,85,247,0.12)',  cor: '#c084fc' },
        hq:    { bg: 'rgba(59,130,246,0.12)',   cor: '#60a5fa' },
        livro: { bg: 'rgba(34,197,94,0.10)',    cor: '#4ade80' }
    };
    return mapa[tipo] || mapa.manga;
}

/* =====================================================
   FILTRAGEM E ORDENAÇÃO
   ===================================================== */
function getListaFiltrada() {
    let lista = [...autores];

    // Filtro por tipo
    if (filtroAtivo !== 'tudo') {
        lista = lista.filter(a => a.tipos.includes(filtroAtivo));
    }

    // Filtro por busca
    if (termoBusca) {
        lista = lista.filter(a =>
            a.nome.toLowerCase().includes(termoBusca) ||
            a.pais.toLowerCase().includes(termoBusca) ||
            a.obras.some(o => o.titulo.toLowerCase().includes(termoBusca))
        );
    }

    // Ordenação
    if (ordenacao === 'nome')  lista.sort((a, b) => a.nome.localeCompare(b.nome));
    if (ordenacao === 'obras') lista.sort((a, b) => b.obras.length - a.obras.length);
    if (ordenacao === 'nota')  lista.sort((a, b) => b.notaMedia - a.notaMedia);

    return lista;
}

/* =====================================================
   RENDERIZAÇÃO DOS CARDS
   ===================================================== */
function renderCards(lista) {
    const grid   = document.getElementById('grid-autores');
    const vazio  = document.getElementById('grid-vazio');
    const countEl = document.getElementById('count-exibindo');

    grid.innerHTML   = '';
    countEl.textContent = lista.length;

    if (!lista.length) {
        vazio.style.display = 'block';
        return;
    }
    vazio.style.display = 'none';

    lista.forEach((autor, i) => {
        const tagsHtml = autor.tipos
            .map(t => `<span class="autor-tag ${t}">${getTipoLabel(t)}</span>`)
            .join('');

        const card = document.createElement('div');
        card.className = 'card-autor';
        card.style.animationDelay = `${i * 0.07}s`;

        card.innerHTML = `
            <div class="card-topo">
                <div class="card-topo-bg" style="background: ${autor.corFundo};"></div>
                <div class="card-topo-pattern"></div>
                <span class="badge-tipo ${getBadgeClasse(autor.tipos)}">${getBadgeLabel(autor.tipos)}</span>
                <div class="autor-avatar-wrap">
                    <div class="autor-avatar" style="
                        background: ${autor.cor}20;
                        border: 2px solid ${autor.cor}55;
                        color: ${autor.cor};
                    ">${autor.iniciais}</div>
                </div>
            </div>
            <div class="card-corpo">
                <div class="autor-nome" title="${autor.nome}">${autor.nome}</div>
                <div class="autor-nacionalidade">${autor.bandeira} ${autor.pais}</div>
                <div class="autor-tags">${tagsHtml}</div>
                <div class="card-nota">
                    <i class="fa-solid fa-star"></i>
                    <span>${autor.notaMedia.toFixed(1)}</span>
                    <small>nota média</small>
                </div>
                <div class="card-rodape">
                    <span class="obras-count">
                        <i class="fa-solid fa-book-open"></i>
                        ${autor.obras.length} obra${autor.obras.length > 1 ? 's' : ''}
                    </span>
                    <button class="btn-ver-perfil" data-id="${autor.id}">
                        Ver perfil <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        // Delegação de evento no botão
        card.querySelector('.btn-ver-perfil').addEventListener('click', () => {
            abrirPerfil(autor.id);
        });

        grid.appendChild(card);
    });
}

/* =====================================================
   MODAL DE PERFIL
   ===================================================== */
function abrirPerfil(id) {
    const autor = autores.find(a => a.id === id);
    if (!autor) return;

    // Fundo colorido do header
    document.getElementById('modal-bg-inner').style.background = autor.corFundo;

    // Avatar
    const avatar = document.getElementById('modal-avatar');
    avatar.textContent       = autor.iniciais;
    avatar.style.background  = autor.cor + '20';
    avatar.style.boxShadow   = `0 0 0 3px ${autor.cor}55`;
    avatar.style.color       = autor.cor;

    // Nome e meta
    document.getElementById('modal-nome').textContent = autor.nome;
    document.getElementById('modal-meta').innerHTML = `
        <span><i class="fa-solid fa-globe"></i>${autor.bandeira} ${autor.pais}</span>
        <span><i class="fa-solid fa-book-open"></i>${autor.obras.length} obra${autor.obras.length > 1 ? 's' : ''} no acervo</span>
        <span><i class="fa-solid fa-star" style="color:#f59e0b"></i><b style="color:#f59e0b">${autor.notaMedia.toFixed(1)}</b> nota média</span>
    `;

    // Tags de tipo
    document.getElementById('modal-tags').innerHTML = autor.tipos
        .map(t => `<span class="autor-tag ${t}">${getTipoLabel(t)}</span>`)
        .join('');

    // Bio
    document.getElementById('modal-bio').textContent = autor.bio;

    // Obras
    const obrasEl = document.getElementById('modal-obras');
    obrasEl.innerHTML = autor.obras.map(obra => {
        const c = getCorObra(obra.tipo);

        const estrelas = gerarEstrelas(obra.nota);

        return `
            <div class="obra-item" onclick="irParaObra('${obra.titulo}')">
                <div class="obra-capa">
                    <img src="${obra.capa}"
                         alt="${obra.titulo}"
                         onerror="this.parentElement.innerHTML='<div class=\\'obra-capa-fallback\\' style=\\'background:${c.bg};color:${c.cor}\\'>${obra.icone}</div>'">
                </div>
                <div class="obra-info">
                    <div class="obra-nome">${obra.titulo}</div>
                    <div class="obra-detalhe">${obra.detalhe}</div>
                </div>
                <div class="obra-nota">
                    ${estrelas}
                    <span>${obra.nota.toFixed(1)}</span>
                </div>
                <i class="fa-solid fa-chevron-right obra-seta"></i>
            </div>
        `;
    }).join('');

    // Título da seção de obras
    document.getElementById('modal-obras-titulo').textContent =
        `Obras no acervo (${autor.obras.length})`;

    // Abre o overlay
    document.getElementById('perfil-overlay').classList.add('aberto');
    document.body.style.overflow = 'hidden';
}

function fecharPerfil() {
    document.getElementById('perfil-overlay').classList.remove('aberto');
    document.body.style.overflow = '';
}

function irParaObra(titulo) {
    window.location.href = 'Descrição.html?title=' + encodeURIComponent(titulo);
}

/* Gera HTML das estrelas baseado na nota (0–5) */
function gerarEstrelas(nota) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (nota >= i) {
            html += '<i class="fa-solid fa-star" style="font-size:11px;color:#f59e0b;"></i>';
        } else if (nota >= i - 0.5) {
            html += '<i class="fa-solid fa-star-half-stroke" style="font-size:11px;color:#f59e0b;"></i>';
        } else {
            html += '<i class="fa-regular fa-star" style="font-size:11px;color:#f59e0b;"></i>';
        }
    }
    return html;
}

/* =====================================================
   EVENTOS
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* Renderiza inicial */
    renderCards(getListaFiltrada());
    document.getElementById('stat-autores').textContent = autores.length;

    /* Filtros de categoria */
    document.querySelectorAll('.filtros-rapidos .tag').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtros-rapidos .tag').forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');
            filtroAtivo = btn.dataset.filtro;
            atualizar();
        });
    });

    /* Campo de busca — tempo real */
    const input = document.getElementById('campo-pesquisa');
    input.addEventListener('input', () => {
        termoBusca = input.value.toLowerCase().trim();
        atualizar();
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            termoBusca = input.value.toLowerCase().trim();
            atualizar();
        }
    });

    /* Botão buscar */
    document.getElementById('btn-buscar').addEventListener('click', () => {
        termoBusca = input.value.toLowerCase().trim();
        atualizar();
    });

    /* Ordenação */
    document.getElementById('select-ordem').addEventListener('change', e => {
        ordenacao = e.target.value;
        atualizar();
    });

    /* Fechar modal — botão X */
    document.getElementById('btn-fechar').addEventListener('click', fecharPerfil);

    /* Fechar modal — clique no overlay */
    document.getElementById('perfil-overlay').addEventListener('click', e => {
        if (e.target === document.getElementById('perfil-overlay')) fecharPerfil();
    });

    /* Fechar modal — tecla Escape */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') fecharPerfil();
    });
});

/* =====================================================
   ATUALIZAÇÃO GERAL
   ===================================================== */
function atualizar() {
    renderCards(getListaFiltrada());
}