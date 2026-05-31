// =====================================================================
//  Perfil.js
//  Responsável por:
//    1. Botões de navegação (logout / sair)
//    2. Upload e persistência da foto de perfil
//    3. Sincronização da foto na navbar
//    4. Carregamento dos favoritos
//    5. Atualização das estatísticas na tela
// =====================================================================

// ─────────────────────────────────────────────
//  BOTÕES DE NAVEGAÇÃO
// ─────────────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    localStorage.removeItem('logged');
    window.location.href = 'index.html';
});

document.getElementById('sairBtn')?.addEventListener('click', function () {
    localStorage.removeItem('logged');
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
