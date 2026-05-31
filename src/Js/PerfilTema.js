// ===================== GAMIFICACAO - NIVEIS E XP =====================
const NIVEIS = [
    { nivel: 1, titulo: 'Iniciante', xpMax: 100 },
    { nivel: 2, titulo: 'Leitor', xpMax: 250 },
    { nivel: 3, titulo: 'Aventureiro', xpMax: 500 },
    { nivel: 4, titulo: 'Explorador', xpMax: 900 },
    { nivel: 5, titulo: 'Veterano', xpMax: 1400 },
    { nivel: 6, titulo: 'Especialista', xpMax: 2000 },
    { nivel: 7, titulo: 'Mestre', xpMax: 2800 },
    { nivel: 8, titulo: 'Lendario', xpMax: 4000 },
];

const CONQUISTAS = [
    {
        id: 'conquista-terror',
        titulo: 'Mestre do Terror',
        chave: 'qtdTerror',
        meta: 5,
        xpRecompensa: 50,
        moldura: true,
    },
    {
        id: 'conquista-avido',
        titulo: 'Leitor Avido',
        chave: 'totalObrasLidas',
        meta: 10,
        xpRecompensa: 80,
        moldura: false,
    },
    {
        id: 'conquista-otaku',
        titulo: 'Otaku',
        chave: 'qtdMangas',
        meta: 5,
        xpRecompensa: 60,
        moldura: false,
    },
    {
        id: 'conquista-heroi',
        titulo: 'Heroi das HQs',
        chave: 'qtdHQs',
        meta: 5,
        xpRecompensa: 60,
        moldura: false,
    },
];

let xpTotal = parseInt(localStorage.getItem('xpTotal') || '0', 10);

function calcularNivel(xp) {
    for (let i = NIVEIS.length - 1; i >= 0; i--) {
        if (xp >= (i === 0 ? 0 : NIVEIS[i - 1].xpMax)) return NIVEIS[i];
    }
    return NIVEIS[0];
}

function atualizarXP() {
    const dadoNivel = calcularNivel(xpTotal);
    const nivelIdx = NIVEIS.indexOf(dadoNivel);
    const xpAnterior = nivelIdx === 0 ? 0 : NIVEIS[nivelIdx - 1].xpMax;
    const progresso = ((xpTotal - xpAnterior) / (dadoNivel.xpMax - xpAnterior)) * 100;

    const elNivel = document.getElementById('nivelAtual');
    const elTitulo = document.getElementById('tituloNivel');
    const elXpAtual = document.getElementById('xpAtual');
    const elXpMax = document.getElementById('xpMax');
    const elBarra = document.getElementById('xpBarra');

    if (elNivel) elNivel.textContent = dadoNivel.nivel;
    if (elTitulo) elTitulo.textContent = dadoNivel.titulo;
    if (elXpAtual) elXpAtual.textContent = xpTotal;
    if (elXpMax) elXpMax.textContent = dadoNivel.xpMax;
    if (elBarra) elBarra.style.width = Math.min(progresso, 100) + '%';
}

function getConquistasDesbloqueadasPerfil() {
    return JSON.parse(localStorage.getItem('conquistasDesbloqueadas') || '[]');
}

function salvarConquistasDesbloqueadas(conquistas) {
    localStorage.setItem('conquistasDesbloqueadas', JSON.stringify(conquistas));
}

function desbloquearConquistaVisual(conquista) {
    const el = document.getElementById(conquista.id);
    if (el) {
        el.classList.remove('bloqueada');
        el.classList.add('desbloqueada');
    }

    if (conquista.moldura && typeof atualizarAvatarPagina === 'function') {
        atualizarAvatarPagina(localStorage.getItem('molduraAtiva') || 'nenhuma');
    }
}

function verificarTodasConquistas() {
    CONQUISTAS.forEach(conquista => {
        const progresso = parseInt(localStorage.getItem(conquista.chave) || '0', 10);
        if (progresso >= conquista.meta) desbloquearConquistaVisual(conquista);
    });

    const qtdTerror = parseInt(localStorage.getItem('qtdTerror') || '0', 10);
    const elQtd = document.getElementById('qtdLida');
    if (elQtd) elQtd.textContent = qtdTerror;
}

function tentarDesbloquear(conquista) {
    const desbloqueadas = getConquistasDesbloqueadasPerfil();
    if (desbloqueadas.includes(conquista.id)) return;

    desbloqueadas.push(conquista.id);
    salvarConquistasDesbloqueadas(desbloqueadas);
    desbloquearConquistaVisual(conquista);

    xpTotal += conquista.xpRecompensa;
    localStorage.setItem('xpTotal', xpTotal);
    atualizarXP();

    mostrarToast(`Conquista desbloqueada: ${conquista.titulo}! +${conquista.xpRecompensa} XP`);

    if (typeof renderizarCardRecompensas === 'function') {
        renderizarCardRecompensas();
    }
}

function mostrarToast(mensagem) {
    let toast = document.getElementById('toast-conquista');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-conquista';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(80px);
            background: var(--cor-principal, #a855f7);
            color: #fff;
            padding: 14px 28px;
            border-radius: 30px;
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            font-weight: 500;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            z-index: 9999;
            opacity: 0;
            transition: all 0.4s ease;
            white-space: nowrap;
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
    }, 3500);
}

function atualizarStatsPerfil(totalObras) {
    const elStatObras = document.getElementById('statObras');
    const elStatHoras = document.getElementById('statHoras');
    const tempoLeituraSegundos = parseInt(localStorage.getItem('tempoLeituraSegundos') || '0', 10);
    const horasLidas = Math.floor(tempoLeituraSegundos / 3600);

    if (elStatObras) elStatObras.textContent = totalObras;
    if (elStatHoras) elStatHoras.textContent = horasLidas + 'h';
}

function testarConquista() {
    let qtdTerror = parseInt(localStorage.getItem('qtdTerror') || '0', 10);
    if (qtdTerror < 5) {
        qtdTerror++;
        localStorage.setItem('qtdTerror', qtdTerror);
        const elQtd = document.getElementById('qtdLida');
        if (elQtd) elQtd.textContent = qtdTerror;
    }

    let totalObras = parseInt(localStorage.getItem('totalObrasLidas') || '0', 10);
    totalObras++;
    localStorage.setItem('totalObrasLidas', totalObras);
    atualizarStatsPerfil(totalObras);

    xpTotal += 20;
    localStorage.setItem('xpTotal', xpTotal);
    atualizarXP();

    CONQUISTAS.forEach(conquista => {
        const progresso = parseInt(localStorage.getItem(conquista.chave) || '0', 10);
        if (progresso >= conquista.meta) tentarDesbloquear(conquista);
    });
}

function resetarTudo() {
    if (!confirm('Tem certeza? Isso vai resetar o XP e todas as conquistas.')) return;

    xpTotal = 0;
    localStorage.setItem('xpTotal', '0');
    salvarConquistasDesbloqueadas([]);

    localStorage.setItem('qtdTerror', '0');
    localStorage.setItem('totalObrasLidas', '0');
    localStorage.setItem('qtdMangas', '0');
    localStorage.setItem('qtdHQs', '0');
    localStorage.setItem('molduraAtiva', 'nenhuma');

    CONQUISTAS.forEach(conquista => {
        const el = document.getElementById(conquista.id);
        if (el) {
            el.classList.remove('desbloqueada');
            el.classList.add('bloqueada');
        }
    });

    atualizarXP();
    atualizarStatsPerfil(0);

    const elQtd = document.getElementById('qtdLida');
    if (elQtd) elQtd.textContent = '0';

    if (typeof atualizarAvatarPagina === 'function') atualizarAvatarPagina('nenhuma');
    if (typeof renderizarCardRecompensas === 'function') renderizarCardRecompensas();

    mostrarToast('Tudo resetado com sucesso!');
}

atualizarXP();
verificarTodasConquistas();

document.getElementById('resetarXP')?.addEventListener('click', resetarTudo);
