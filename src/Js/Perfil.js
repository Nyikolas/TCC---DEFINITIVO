// =====================================================================
//  Perfil.js
//  Responsável por:
//    1. Botões de navegação (logout / sair)
//    2. Upload e persistência da foto de perfil
//    3. Sincronização da foto na navbar
//    4. Carregamento dos favoritos
//    5. Atualização das estatísticas na tela
// =====================================================================

const PERFIL_API_BASE = getPerfilApiBase();

function getPerfilApiBase() {
    if (window.UNIREAD_API_BASE) return window.UNIREAD_API_BASE;
    const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (window.location.protocol === 'file:' || (local && window.location.port !== '3000')) {
        return 'http://localhost:3000/api';
    }
    return '/api';
}

// ─────────────────────────────────────────────
//  BOTÕES DE NAVEGAÇÃO
// ─────────────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    localStorage.removeItem('logged');
    window.location.href = 'index.html';
});

document.getElementById('sairBtn')?.addEventListener('click', function () {
    localStorage.removeItem('logged');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    window.location.href = 'Login.html';
});

// ─────────────────────────────────────────────
//  FOTO DE PERFIL
// ─────────────────────────────────────────────
const avatarContainer = document.getElementById('avatarContainer');
const fotoPerfil      = document.getElementById('fotoPerfil');
const fotoPerfilNav   = document.getElementById('fotoPerfilNav');
const uploadFoto      = document.getElementById('uploadFoto');

// Carrega foto salva no localStorage
(function carregarFotoSalva() {
    const fotoSalva = localStorage.getItem('userAvatar');
    if (!fotoSalva) return;
    if (fotoPerfil)    fotoPerfil.src    = fotoSalva;
    if (fotoPerfilNav) fotoPerfilNav.src = fotoSalva;
})();

async function carregarPerfilRemoto() {
    const userId = localStorage.getItem('userId');
    const nomeSalvo = localStorage.getItem('username');
    const nomeUsuario = document.getElementById('nomeUsuario');

    if (nomeSalvo && nomeUsuario) nomeUsuario.textContent = nomeSalvo;
    if (!userId) return;

    try {
        const res = await fetch(`${PERFIL_API_BASE}/profile/${userId}`);
        const perfil = await res.json();

        if (!res.ok) throw new Error(perfil.error || 'Erro ao buscar perfil');

        const nome = perfil.nome || perfil.username || nomeSalvo || 'Usuario';
        if (nomeUsuario) nomeUsuario.textContent = nome;
        localStorage.setItem('username', nome);

        if (perfil.fotoPerfil) {
            localStorage.setItem('userAvatar', perfil.fotoPerfil);
            if (fotoPerfil) fotoPerfil.src = perfil.fotoPerfil;
            if (fotoPerfilNav) fotoPerfilNav.src = perfil.fotoPerfil;
        }

        const xpLocal = Number(localStorage.getItem('xpTotal') || '0');
        const xpRemoto = Number(perfil.xp || '0');

        if (xpLocal > xpRemoto) {
            await salvarPerfilRemoto();
        } else if (typeof aplicarPerfilRemoto === 'function') {
            aplicarPerfilRemoto(perfil);
        }
    } catch (err) {
        console.warn('[perfil remoto]', err);
    }
}

async function salvarPerfilRemoto() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const nome = localStorage.getItem('username') || document.getElementById('nomeUsuario')?.textContent || 'Usuario';
    const fotoPerfilAtual = localStorage.getItem('userAvatar') || fotoPerfil?.src || null;
    const xp = Number(localStorage.getItem('xpTotal') || '0');
    const nivel = Number(document.getElementById('nivelAtual')?.textContent || '1');

    try {
        const res = await fetch(`${PERFIL_API_BASE}/profile/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, fotoPerfil: fotoPerfilAtual, xp, nivel }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Erro ao salvar perfil');
        }
    } catch (err) {
        console.warn('[salvar perfil remoto]', err);
    }
}

window.salvarPerfilRemoto = salvarPerfilRemoto;

// Clique no container → abre seletor de arquivo
avatarContainer?.addEventListener('click', () => uploadFoto?.click());

// Arquivo selecionado → lê, exibe e salva
uploadFoto?.addEventListener('change', function () {
    const arquivo = this.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = function (e) {
        const src = e.target.result;
        if (fotoPerfil)    fotoPerfil.src    = src;
        if (fotoPerfilNav) fotoPerfilNav.src = src;
        localStorage.setItem('userAvatar', src);
        salvarPerfilRemoto();

        // Atualiza também os mini-avatares do card de recompensas (se visíveis)
        document.querySelectorAll('.slot-foto').forEach(img => img.src = src);
    };
    leitor.readAsDataURL(arquivo);
});

// ─────────────────────────────────────────────
//  FAVORITOS
// ─────────────────────────────────────────────
(function carregarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('meusFavoritos') || '[]');
    const lista     = document.getElementById('listaFavoritos');
    if (!lista) return;

    if (favoritos.length === 0) {
        lista.innerHTML = '<p>Você ainda não tem obras favoritas.</p>';
        return;
    }

    favoritos.forEach(titulo => {
        // descricaoData vem de Descricao.js (carregado antes deste script)
        const data = descricaoData[titulo];
        if (!data) return;

        const card = document.createElement('a');
        card.href      = `Descrição.html?title=${encodeURIComponent(titulo)}`;
        card.className = 'card-favorito';
        card.innerHTML = `
            <img src="${data.capa}" alt="${data.title}" class="card-favorito-capa">
            <div class="card-favorito-info">
                <div class="card-favorito-titulo">${data.title}</div>
                <div class="card-favorito-autor">${data.autor}</div>
            </div>
        `;
        lista.appendChild(card);
    });
})();

// ─────────────────────────────────────────────
//  ESTATÍSTICAS
// ─────────────────────────────────────────────
(function atualizarStats() {
    const total = parseInt(localStorage.getItem('totalObrasLidas') || '0');
    const tempoLeituraSegundos = parseInt(localStorage.getItem('tempoLeituraSegundos') || '0', 10);
    const horasLidas = Math.floor(tempoLeituraSegundos / 3600);

    const elObras = document.getElementById('statObras');
    const elHoras = document.getElementById('statHoras');

    if (elObras) elObras.textContent = total;
    if (elHoras) elHoras.textContent = horasLidas + 'h';
    // statDias pode ser implementado com lógica de streak futuramente
})();

document.addEventListener('DOMContentLoaded', carregarPerfilRemoto);
