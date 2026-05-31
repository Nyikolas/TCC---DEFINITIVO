const lumiObras = [
  {
    titulo: 'One Piece',
    tipo: 'Manga',
    humor: ['feliz', 'animado', 'determinação', 'desmotivado'],
    capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_mfpdoof6nd6ej6n2dlhtgsg660/-S897-FWEBP',
    motivo: 'tem aventura, amizade e uma energia boa para levantar o animo.',
  },
  {
    titulo: 'Solo Leveling',
    tipo: 'Manga / Webtoon',
    humor: ['cansado', 'fraco', 'desmotivado', 'ansioso'],
    capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_dapavu4fhd04bcjagc4v0sge0a/-S897-FWEBP',
    motivo: 'combina com quem quer ver evolucao, superacao e batalhas empolgantes.',
  },
  {
    titulo: 'Berserk',
    tipo: 'Manga / Seinen',
    humor: ['Odio', 'raiva', 'perdido', 'intenso'],
    capa: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Berserk_vol01.png',
    motivo: 'e uma obra profunda, sombria e intensa para momentos mais pesados.',
  },
  {
    titulo: 'Batman',
    tipo: 'HQ',
    humor: ['Justica', 'injustica', 'focado', 'sombrio'],
    capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_mose922j392el6h2q2c1nv8g7l/-S897-FWEBP',
    motivo: 'traz misterio, acao e um clima investigativo para canalizar a tensao.',
  },
  {
    titulo: 'Senhor Dos Aneis',
    tituloBusca: 'Senhor Dos Aneis',
    tipo: 'Livro / Fantasia',
    humor: ['calmo', 'sonhador', 'esperancoso', 'curioso'],
    capa: 'https://m.media-amazon.com/images/I/51lkAKXgK4L._SY445_SX342_QL70_ML2_.jpg',
    motivo: 'oferece uma jornada epica, acolhedora e cheia de fantasia.',
  },
  {
    titulo: 'Game of Thrones',
    tipo: 'Livro / Fantasia',
    humor: ['curioso', 'tenso', 'intrigado', 'focado'],
    capa: 'https://i2.wp.com/m.media-amazon.com/images/I/518dGmVCDfL.jpg?w=150&resize=150,200&ssl=1',
    motivo: 'tem estrategia, politica, conflitos e um mundo cheio de reviravoltas.',
  },

  {
    titulo: 'Tudo bem não estar tudo bem',
    tipo: 'Livro / Triste',
    humor: ['triste', 'ansioso', 'cansado', 'desmotivado'],
    capa: 'https://m.media-amazon.com/images/I/712tS1Yz6NL._SY425_.jpg',
    motivo: 'oferece conforto e compreensão para aqueles que estão passando por momentos difíceis.',
  },
  {
    titulo: 'O Homem de Giz',
    tipo: 'Livro / Suspense',
    humor: ['curioso', 'tenso', 'intrigado', 'ansioso'],
    capa: 'https://i2.wp.com/m.media-amazon.com/images/I/518dGmVCDfL.jpg?w=150&resize=150,200&ssl=1',
    motivo: 'traz um clima de suspense e mistério para explorar.',
  },
  {
    titulo: 'O Iluminado',
    tipo: 'Livro / Horror',
    humor: ['medo', 'ansioso', 'tenso', 'intrigado'],
    capa: 'https://m.media-amazon.com/images/I/81Q+pJi4NjL._SY466_.jpg',
    motivo: 'traz um clima de medo e tensao para explorar.',
  },
];

const LUMI_API_URL = '/api/lumi-chat';

const sentimentos = [
  {
    nome: 'triste',
    palavras: ['triste', 'mal', 'deprimido', 'chateado', 'chorar', 'sozinho', 'solidao', 'vazio'],
    resposta: 'Percebi um clima mais triste na sua mensagem.',
  },
  {
    nome: 'ansioso',
    palavras: ['ansioso', 'ansiedade', 'preocupado', 'nervoso', 'medo', 'inseguro', 'pressao'],
    resposta: 'Sua mensagem parece carregar ansiedade ou preocupacao.',
  },
  {
    nome: 'raiva',
    palavras: ['raiva', 'irritado', 'odio', 'estressado', 'injustica', 'bravo', 'furioso'],
    resposta: 'Senti uma energia de raiva ou tensao no que voce escreveu.',
  },
  {
    nome: 'feliz',
    palavras: ['feliz', 'alegre', 'animado', 'empolgado', 'bem', 'otimo', 'legal'],
    resposta: 'Voce parece estar em um momento mais leve e animado.',
  },
  {
    nome: 'cansado',
    palavras: ['cansado', 'exausto', 'sem energia', 'desmotivado', 'fraco', 'desanimo'],
    resposta: 'Parece que voce esta precisando de uma leitura para recuperar o folego.',
  },
  {
    nome: 'calmo',
    palavras: ['calmo', 'tranquilo', 'paz', 'relaxar', 'leve', 'descansar'],
    resposta: 'Sua mensagem passa uma vontade de algo mais tranquilo.',
  },
  {
    nome: 'curioso',
    palavras: ['curioso', 'misterio', 'investigar', 'pensar', 'duvida', 'intrigado'],
    resposta: 'Vi um tom de curiosidade na sua mensagem.',
  },
];

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function detectarSentimento(texto) {
  const textoNormalizado = normalizarTexto(texto);

  return sentimentos.find((sentimento) =>
    sentimento.palavras.some((palavra) => textoNormalizado.includes(normalizarTexto(palavra)))
  ) || {
    nome: 'curioso',
    resposta: 'Nao identifiquei um sentimento especifico, entao escolhi algo facil de entrar na historia.',
  };
}

function recomendarObra(sentimento) {
  const obrasCompativeis = lumiObras.filter((obra) => obra.humor.includes(sentimento.nome));
  const lista = obrasCompativeis.length > 0 ? obrasCompativeis : lumiObras;
  return lista[Math.floor(Math.random() * lista.length)];
}

function buscarObraPorTitulo(titulo) {
  return lumiObras.find((obra) => normalizarTexto(obra.titulo) === normalizarTexto(titulo || '')) || lumiObras[0];
}

function criarRespostaLocal(textoUsuario) {
  const sentimento = detectarSentimento(textoUsuario);
  const obra = recomendarObra(sentimento);

  return {
    sentimento,
    obra,
    texto: `${sentimento.resposta} Minha recomendacao é ${obra.titulo}: ${obra.motivo}`,
  };
}

async function criarResposta(textoUsuario) {
  try {
    const response = await fetch(LUMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mensagem: textoUsuario }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao consultar a Lumi.');
    }

    const obra = buscarObraPorTitulo(data.obraTitulo);

    return {
      sentimento: { nome: data.sentimento || 'indefinido' },
      obra,
      texto: data.texto || `Minha recomendacao e ${obra.titulo}: ${obra.motivo}`,
    };
  } catch (error) {
    const respostaLocal = criarRespostaLocal(textoUsuario);
    return {
      ...respostaLocal,
      texto: `${respostaLocal.texto} `,
    };
  }
}

function irParaObra(titulo) {
  window.location.href = `Descrição.html?title=${encodeURIComponent(titulo)}`;
}

function criarMensagem(texto, lado, recomendacao) {
  const mensagem = document.createElement('div');
  mensagem.className = `lumi-message ${lado}`;

  const bolha = document.createElement('div');
  bolha.className = 'lumi-bubble';
  bolha.textContent = texto;
  mensagem.appendChild(bolha);

  if (recomendacao) {
    const card = document.createElement('button');
    card.className = 'lumi-recommendation';
    card.type = 'button';
    card.onclick = () => irParaObra(recomendacao.tituloBusca || recomendacao.titulo);
    card.innerHTML = `
      <img src="${recomendacao.capa}" alt="${recomendacao.titulo}">
      <span>
        <strong>${recomendacao.titulo}</strong>
        <small>${recomendacao.tipo}</small>
      </span>
    `;
    mensagem.appendChild(card);
  }

  return mensagem;
}

function configurarChat(container) {
  const form = container.querySelector('[data-lumi-form]');
  const input = container.querySelector('[data-lumi-input]');
  const mensagens = container.querySelector('[data-lumi-messages]');

  if (!form || !input || !mensagens) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const texto = input.value.trim();
    if (!texto) return;

    mensagens.appendChild(criarMensagem(texto, 'user'));
    input.value = '';

    const digitando = criarMensagem('Lumi esta analisando seu sentimento...', 'bot');
    mensagens.appendChild(digitando);
    mensagens.scrollTop = mensagens.scrollHeight;

    setTimeout(async () => {
      const resposta = await criarResposta(texto);
      digitando.replaceWith(criarMensagem(resposta.texto, 'bot', resposta.obra));
      mensagens.scrollTop = mensagens.scrollHeight;
    }, 500);
  });
}

function criarWidgetFlutuante() {
  const icone = document.getElementById('chatbot-icone');
  if (!icone || document.getElementById('chatbot-box')) return;

  const box = document.createElement('section');
  box.id = 'chatbot-box';
  box.className = 'lumi-widget';
  box.innerHTML = `
    <div class="lumi-chat-header">
      <div>
        <strong>Lumi</strong>
        <span>Recomendadora de obras</span>
      </div>
      <button type="button" data-lumi-close aria-label="Fechar chat">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="lumi-messages" data-lumi-messages>
      <div class="lumi-message bot">
        <div class="lumi-bubble">Oi! Me diga como voce esta se sentindo e eu recomendo uma obra.</div>
      </div>
    </div>
    <form class="lumi-form" data-lumi-form>
      <input type="text" data-lumi-input placeholder="Ex: estou ansioso hoje..." autocomplete="off">
      <button type="submit" aria-label="Enviar mensagem">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  `;

  document.body.appendChild(box);
  configurarChat(box);

  icone.addEventListener('click', () => {
    box.classList.toggle('is-open');
  });

  box.querySelector('[data-lumi-close]').addEventListener('click', () => {
    box.classList.remove('is-open');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-lumi-chat]').forEach(configurarChat);
  criarWidgetFlutuante();
});
