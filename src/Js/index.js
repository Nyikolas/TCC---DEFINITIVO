function toggleChat() {

    const chat = document.getElementById("chatbot-box");

    if (chat.style.display === "flex") {
        chat.style.display = "none";
    } else {
        chat.style.display = "flex";
    }

}

function enviarMensagem() {

    const input = document.getElementById("user-input");
    const mensagem = input.value;

    if (mensagem === "") return;

    const chatBody = document.getElementById("chat-body");

    /* Mensagem do usuário */
    const userMsg = document.createElement("div");
    userMsg.classList.add("user-message");
    userMsg.innerText = mensagem;

    chatBody.appendChild(userMsg);

    /* Resposta automática */
    const botMsg = document.createElement("div");
    botMsg.classList.add("bot-message");

    if (mensagem.toLowerCase().includes("oi")) {
        botMsg.innerText = "Olá! Como posso ajudar?";
    }
    else if (mensagem.toLowerCase().includes("pokemon")) {
        botMsg.innerText = "Você pode buscar pokémons na barra de pesquisa!";
    }
    else {
        botMsg.innerText = "Desculpe, ainda estou aprendendo 🤖";
    }

    setTimeout(() => {
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 500);

    input.value = "";

}


// Foto de Perfil

document.addEventListener('DOMContentLoaded', () => {
    // Busca a imagem salva no localStorage
    const fotoSalva = localStorage.getItem('userAvatar');
    
    // Seleciona a imagem da Navbar pelo ID que criamos
    const fotoNav = document.getElementById('fotoPerfilNav');

    // Se houver uma foto salva, substitui a imagem padrão
    if (fotoSalva && fotoNav) {
        fotoNav.src = fotoSalva;
    }
});

// ===================== CARROSSEL =====================
let slideAtual = 0;
let autoPlay;

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function atualizarCarrossel() {
  if (!slides.length || !dots.length) return;

  slides.forEach(s => s.classList.remove('ativo'));
  dots.forEach(d => d.classList.remove('ativo'));
  slides[slideAtual].classList.add('ativo');
  dots[slideAtual].classList.add('ativo');
}

function mudarSlide(direcao) {
  if (!slides.length) return;

  slideAtual = (slideAtual + direcao + slides.length) % slides.length;
  atualizarCarrossel();
  reiniciarAutoPlay();
}

function irParaSlide(index) {
  if (!slides.length) return;

  slideAtual = index;
  atualizarCarrossel();
  reiniciarAutoPlay();
}

function reiniciarAutoPlay() {
  if (!slides.length) return;

  clearInterval(autoPlay);
  autoPlay = setInterval(() => mudarSlide(1), 4000);
}

// Inicia o autoplay ao carregar a página
if (slides.length && dots.length) {
  autoPlay = setInterval(() => mudarSlide(1), 4000);
}

// ===================== PERSISTÊNCIA DE CORES =====================    
const corFundo = localStorage.getItem('corFundo');
const corBotao = localStorage.getItem('corBotao');
if (corFundo) document.documentElement.style.setProperty('--cor-fundo', corFundo);
if (corBotao) document.documentElement.style.setProperty('--cor-principal', corBotao);
