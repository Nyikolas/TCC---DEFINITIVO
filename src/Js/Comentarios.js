// =====================================================================
//  Comentarios.js
//  Sistema de comentários por capítulo
//  Funcionalidades: curtir, responder (reply), deletar, denunciar
//  Persistência: localStorage
// =====================================================================

// ─────────────────────────────────────────────
//  ESTADO
// ─────────────────────────────────────────────

// Chave base no localStorage: comentarios_{titulo}_{capitulo}
function chaveStorage(titulo, capitulo) {
    return `comentarios_${titulo}_${capitulo}`.replace(/\s+/g, '_');
}

// Retorna os comentários do capítulo atual
function getComentarios() {
    const chave = chaveStorage(currentTitle, currentChapterIndex);
    return JSON.parse(localStorage.getItem(chave) || '[]');
}

// Salva os comentários do capítulo atual
function setComentarios(lista) {
    const chave = chaveStorage(currentTitle, currentChapterIndex);
    localStorage.setItem(chave, JSON.stringify(lista));
}

// ID único para cada comentário
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Nome do usuário (usa o que estiver salvo ou "Visitante")
function getNomeUsuario() {
    return localStorage.getItem('nomeUsuario') || 'Visitante';
}

// Avatar do usuário
function getAvatarUsuario() {
    return localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/40';
}

// ─────────────────────────────────────────────
//  ORDENAÇÃO
// ─────────────────────────────────────────────

let ordemAtual = 'recentes'; // 'recentes' | 'curtidas'

function ordenarComentarios(lista) {
    if (ordemAtual === 'curtidas') {
        return [...lista].sort((a, b) => (b.curtidas || 0) - (a.curtidas || 0));
    }
    // recentes: maior timestamp primeiro
    return [...lista].sort((a, b) => b.timestamp - a.timestamp);
}

// ─────────────────────────────────────────────
//  FORMATAÇÃO DE DATA
// ─────────────────────────────────────────────

function formatarData(timestamp) {
    const diff = Date.now() - timestamp;
    const min  = Math.floor(diff / 60000);
    const h    = Math.floor(diff / 3600000);
    const d    = Math.floor(diff / 86400000);

    if (min < 1)  return 'Agora mesmo';
    if (min < 60) return `há ${min} min`;
    if (h < 24)   return `há ${h}h`;
    if (d < 7)    return `há ${d} dia${d > 1 ? 's' : ''}`;

    return new Date(timestamp).toLocaleDateString('pt-BR');
}

// ─────────────────────────────────────────────
//  RENDERIZAÇÃO
// ─────────────────────────────────────────────

function renderizarTudo() {
    const lista       = getComentarios();
    const ordenada    = ordenarComentarios(lista);
    const container   = document.getElementById('comentariosLista');
    const vazio       = document.getElementById('comentariosVazio');
    const countEl     = document.getElementById('comentariosCount');

    // Conta total incluindo replies
    const total = lista.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);
    if (countEl) countEl.textContent = total;

    // Limpa (preserva o elemento vazio)
    container.innerHTML = '';

    if (lista.length === 0) {
        container.appendChild(criarVazio());
        return;
    }

    ordenada.forEach(comentario => {
        container.appendChild(criarCardComentario(comentario, false));
    });
}

function criarVazio() {
    const div = document.createElement('div');
    div.className = 'comentarios-vazio';
    div.innerHTML = `<span class="vazio-icone">💬</span><p>Seja o primeiro a comentar!</p>`;
    return div;
}

function criarCardComentario(comentario, isReply) {
    const euSou   = comentario.autor === getNomeUsuario();
    const curtido = (comentario.curtidoPor || []).includes(getIdVisitante());
    const denunciado = (comentario.denunciadoPor || []).includes(getIdVisitante());

    const card = document.createElement('div');
    card.className = `comentario-card ${isReply ? 'comentario-reply' : ''} ${denunciado ? 'comentario-denunciado' : ''}`;
    card.dataset.id = comentario.id;

    card.innerHTML = `
        <img class="comentario-avatar" src="${comentario.avatar}" alt="${comentario.autor}">
        <div class="comentario-corpo">
            <div class="comentario-topo">
                <span class="comentario-autor">${comentario.autor}</span>
                <span class="comentario-data">${formatarData(comentario.timestamp)}</span>
            </div>
            <p class="comentario-texto">${escaparHTML(comentario.texto)}</p>
            <div class="comentario-acoes">
                <button class="acao-btn curtir-btn ${curtido ? 'curtido' : ''}"
                        data-id="${comentario.id}"
                        data-reply="${isReply}"
                        data-parent="${comentario.parentId || ''}">
                    ${curtido ? '❤️' : '🤍'} <span class="curtidas-num">${comentario.curtidas || 0}</span>
                </button>
                ${!isReply ? `
                <button class="acao-btn reply-btn" data-id="${comentario.id}">
                    💬 Responder
                </button>` : ''}
                ${euSou ? `
                <button class="acao-btn deletar-btn" data-id="${comentario.id}" data-reply="${isReply}" data-parent="${comentario.parentId || ''}">
                    🗑️ Deletar
                </button>` : `
                <button class="acao-btn denunciar-btn ${denunciado ? 'denunciado' : ''}"
                        data-id="${comentario.id}"
                        data-reply="${isReply}"
                        data-parent="${comentario.parentId || ''}"
                        ${denunciado ? 'disabled' : ''}>
                    ${denunciado ? '🚩 Denunciado' : '🚩 Denunciar'}
                </button>`}
            </div>

            <!-- Caixa de reply (oculta por padrão) -->
            ${!isReply ? `
            <div class="reply-box" id="reply-${comentario.id}" style="display:none">
                <img class="form-avatar form-avatar-sm"
                     src="${getAvatarUsuario()}" alt="você">
                <div class="form-direita">
                    <textarea class="comentario-input reply-input"
                              placeholder="Responder para ${comentario.autor}..."
                              maxlength="300" rows="2"></textarea>
                    <div class="form-rodape">
                        <button class="btn-cancelar-reply" data-id="${comentario.id}">Cancelar</button>
                        <button class="btn-enviar-reply btn-enviar" data-id="${comentario.id}">Responder</button>
                    </div>
                </div>
            </div>` : ''}

            <!-- Replies -->
            ${!isReply && comentario.replies?.length ? `
            <div class="replies-container">
                ${comentario.replies.map(r => criarCardComentario(r, true).outerHTML).join('')}
            </div>` : ''}
        </div>
    `;

    // Bind dos eventos após criar o elemento
    bindEventosCard(card, comentario, isReply);

    return card;
}

// ─────────────────────────────────────────────
//  EVENTOS DOS CARDS
// ─────────────────────────────────────────────

function bindEventosCard(card, comentario, isReply) {

    // CURTIR
    const btnCurtir = card.querySelector('.curtir-btn');
    if (btnCurtir) {
        btnCurtir.addEventListener('click', () => curtir(comentario.id, isReply, comentario.parentId));
    }

    // REPLY — abre/fecha a caixa de resposta
    const btnReply = card.querySelector('.reply-btn');
    if (btnReply) {
        btnReply.addEventListener('click', () => {
            const box = document.getElementById(`reply-${comentario.id}`);
            if (!box) return;
            const aberto = box.style.display !== 'none';
            box.style.display = aberto ? 'none' : 'flex';
            if (!aberto) box.querySelector('textarea').focus();
        });
    }

    // CANCELAR REPLY
    const btnCancelar = card.querySelector('.btn-cancelar-reply');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            const box = document.getElementById(`reply-${comentario.id}`);
            if (box) box.style.display = 'none';
        });
    }

    // ENVIAR REPLY
    const btnEnviarReply = card.querySelector('.btn-enviar-reply');
    if (btnEnviarReply) {
        btnEnviarReply.addEventListener('click', () => enviarReply(comentario.id));
    }

    // DELETAR
    const btnDeletar = card.querySelector('.deletar-btn');
    if (btnDeletar) {
        btnDeletar.addEventListener('click', () => deletar(comentario.id, isReply, comentario.parentId));
    }

    // DENUNCIAR
    const btnDenunciar = card.querySelector('.denunciar-btn');
    if (btnDenunciar) {
        btnDenunciar.addEventListener('click', () => abrirModalDenuncia(comentario.id, isReply, comentario.parentId));
    }
}

// ─────────────────────────────────────────────
//  AÇÕES
// ─────────────────────────────────────────────

// Identificador único do visitante (para rastrear curtidas e denúncias)
function getIdVisitante() {
    let id = localStorage.getItem('visitanteId');
    if (!id) {
        id = gerarId();
        localStorage.setItem('visitanteId', id);
    }
    return id;
}

function curtir(id, isReply, parentId) {
    const lista  = getComentarios();
    const visId  = getIdVisitante();

    if (isReply && parentId) {
        const pai = lista.find(c => c.id === parentId);
        if (!pai) return;
        const reply = pai.replies.find(r => r.id === id);
        if (!reply) return;
        reply.curtidoPor = reply.curtidoPor || [];
        if (reply.curtidoPor.includes(visId)) {
            reply.curtidoPor = reply.curtidoPor.filter(v => v !== visId);
            reply.curtidas   = Math.max(0, (reply.curtidas || 1) - 1);
        } else {
            reply.curtidoPor.push(visId);
            reply.curtidas = (reply.curtidas || 0) + 1;
        }
    } else {
        const c = lista.find(c => c.id === id);
        if (!c) return;
        c.curtidoPor = c.curtidoPor || [];
        if (c.curtidoPor.includes(visId)) {
            c.curtidoPor = c.curtidoPor.filter(v => v !== visId);
            c.curtidas   = Math.max(0, (c.curtidas || 1) - 1);
        } else {
            c.curtidoPor.push(visId);
            c.curtidas = (c.curtidas || 0) + 1;
        }
    }

    setComentarios(lista);
    renderizarTudo();
}

function deletar(id, isReply, parentId) {
    if (!confirm('Tem certeza que quer deletar este comentário?')) return;
    let lista = getComentarios();

    if (isReply && parentId) {
        const pai = lista.find(c => c.id === parentId);
        if (pai) pai.replies = pai.replies.filter(r => r.id !== id);
    } else {
        lista = lista.filter(c => c.id !== id);
    }

    setComentarios(lista);
    renderizarTudo();
    mostrarToastComentario('🗑️ Comentário deletado.');
}

// ─────────────────────────────────────────────
//  DENÚNCIA
// ─────────────────────────────────────────────

let denunciaAlvo = null; // { id, isReply, parentId }

function abrirModalDenuncia(id, isReply, parentId) {
    denunciaAlvo = { id, isReply, parentId };
    document.getElementById('modalDenuncia').style.display = 'flex';
}

function fecharModalDenuncia() {
    denunciaAlvo = null;
    document.getElementById('modalDenuncia').style.display = 'none';
}

function registrarDenuncia(motivo) {
    if (!denunciaAlvo) return;
    const { id, isReply, parentId } = denunciaAlvo;
    const lista  = getComentarios();
    const visId  = getIdVisitante();

    const marcar = (comentario) => {
        comentario.denunciadoPor = comentario.denunciadoPor || [];
        if (!comentario.denunciadoPor.includes(visId)) {
            comentario.denunciadoPor.push(visId);
            comentario.denuncias = (comentario.denuncias || 0) + 1;
            comentario.motivoDenuncia = motivo;
        }
    };

    if (isReply && parentId) {
        const pai = lista.find(c => c.id === parentId);
        if (pai) {
            const reply = pai.replies.find(r => r.id === id);
            if (reply) marcar(reply);
        }
    } else {
        const c = lista.find(c => c.id === id);
        if (c) marcar(c);
    }

    setComentarios(lista);
    fecharModalDenuncia();
    renderizarTudo();
    mostrarToastComentario('🚩 Comentário denunciado. Obrigado pelo feedback!');
}

// ─────────────────────────────────────────────
//  ENVIO DE COMENTÁRIOS
// ─────────────────────────────────────────────

function enviarComentario() {
    const input = document.getElementById('inputComentario');
    const texto = input.value.trim();
    if (!texto) return;

    const lista = getComentarios();
    lista.push({
        id:        gerarId(),
        autor:     getNomeUsuario(),
        avatar:    getAvatarUsuario(),
        texto,
        timestamp: Date.now(),
        curtidas:  0,
        curtidoPor: [],
        denuncias:  0,
        denunciadoPor: [],
        replies:   [],
    });

    setComentarios(lista);
    input.value = '';
    atualizarCharCount(0);
    renderizarTudo();
    mostrarToastComentario('✅ Comentário publicado!');
}

function enviarReply(parentId) {
    const box    = document.getElementById(`reply-${parentId}`);
    const input  = box?.querySelector('.reply-input');
    const texto  = input?.value.trim();
    if (!texto) return;

    const lista = getComentarios();
    const pai   = lista.find(c => c.id === parentId);
    if (!pai) return;

    pai.replies = pai.replies || [];
    pai.replies.push({
        id:        gerarId(),
        parentId,
        autor:     getNomeUsuario(),
        avatar:    getAvatarUsuario(),
        texto,
        timestamp: Date.now(),
        curtidas:  0,
        curtidoPor: [],
        denuncias:  0,
        denunciadoPor: [],
    });

    setComentarios(lista);
    if (input) input.value = '';
    if (box)   box.style.display = 'none';
    renderizarTudo();
    mostrarToastComentario('💬 Resposta publicada!');
}

// ─────────────────────────────────────────────
//  UTILITÁRIOS
// ─────────────────────────────────────────────

// Evita XSS — escapa HTML antes de exibir
function escaparHTML(texto) {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br>');
}

function atualizarCharCount(n) {
    const el = document.getElementById('charAtual');
    if (el) el.textContent = n;
}

function mostrarToastComentario(mensagem) {
    let toast = document.getElementById('toast-comentario');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-comentario';
        toast.style.cssText = `
            position:fixed; bottom:30px; left:50%;
            transform:translateX(-50%) translateY(80px);
            background:var(--cor-card, #1e1e2e); color:#fff;
            border: 1px solid var(--cor-borda-hover, rgba(168,85,247,0.4));
            padding:13px 28px; border-radius:30px;
            font-family:'Poppins',sans-serif; font-size:14px; font-weight:500;
            box-shadow:0 8px 32px rgba(0,0,0,0.5);
            z-index:9999; opacity:0; transition:all 0.4s ease;
            white-space:nowrap; pointer-events:none;
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
//  INIT
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // Avatar do formulário
    const formAvatar = document.getElementById('formAvatar');
    if (formAvatar) formAvatar.src = getAvatarUsuario();

    // Contador de caracteres
    const inputComentario = document.getElementById('inputComentario');
    if (inputComentario) {
        inputComentario.addEventListener('input', function () {
            atualizarCharCount(this.value.length);
        });

        // Enter para enviar (sem Shift)
        inputComentario.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // impede pular linha
                enviarComentario();
            }
        });
    }

    // Botão publicar
    const btnEnviar = document.getElementById('btnEnviar');
    if (btnEnviar) btnEnviar.addEventListener('click', enviarComentario);

    // Botões de ordenação
    document.querySelectorAll('.ordem-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.ordem-btn').forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
            ordemAtual = this.dataset.ordem;
            renderizarTudo();
        });
    });

    // Modal de denúncia — botões de motivo
    document.querySelectorAll('.denuncia-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            registrarDenuncia(this.dataset.motivo);
        });
    });

    // Modal de denúncia — cancelar
    const modalCancelar = document.getElementById('modalCancelar');
    if (modalCancelar) modalCancelar.addEventListener('click', fecharModalDenuncia);

    // Fecha modal ao clicar fora
    const modalOverlay = document.getElementById('modalDenuncia');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === this) fecharModalDenuncia();
        });
    }

    // Renderiza comentários iniciais
    // Aguarda Leitura.js definir currentTitle e currentChapterIndex
    setTimeout(renderizarTudo, 100);
});

document.addEventListener('leitura:capituloAlterado', () => {
    setTimeout(renderizarTudo, 50);
});
