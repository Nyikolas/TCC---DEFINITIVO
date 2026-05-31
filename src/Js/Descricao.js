const descricaoData = {
  'Solo Leveling': {
    title: 'Solo Leveling',
    autor: 'Chu-Gong',
    categoria: 'Mangá / Webtoon',
    capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_dapavu4fhd04bcjagc4v0sge0a/-S897-FWEBP',
    sinopse: 'Sung Jin-Woo é o caçula dos caçulas, o jogador mais fraco em um mundo onde caçadores lutam contra monstros em masmorras. Um dia, ele recebe um poder especial: o Sistema, que o permite subir de nível sozinho. Agora, ele se torna o jogador mais forte do mundo.',
    capitulos: ['Capítulo 1 - O Caçador Mais Fraco', 'Capítulo 2 - A Busca', 'Capítulo 3 - A Transformação', 'Capítulo 4 - O Máscara', 'Capítulo 5 - A Evolução'],
    total: 200
  },
  'One Piece': {
    title: 'One Piece',
    autor: 'Eiichiro Oda',
    categoria: 'Mangá / Shonen',
    capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_mfpdoof6nd6ej6n2dlhtgsg660/-S897-FWEBP',
    sinopse: 'Monkey D. Luffy e sua tripulação navegam pelo Grande Line em busca do tesouro lendário One Piece. Aventuras, batalhas e sonhos se entrelaçam na busca pelo título de Rei dos Piratas.',
    capitulos: ['Capítulo 1 - Romance Dawn', 'Capítulo 2 - O Homem do Chapéu de Palha', 'Capítulo 3 - Desaparecimento do Roupa Veloz'],
    total: 1180
  },
  'Berserk': {
    title: 'Berserk',
    autor: 'Kentaro Miura',
    categoria: 'Mangá / Seinen',
    capa: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Berserk_vol01.png',
    sinopse: 'Guts, um mercenário marcado pela tragédia, enfrenta um destino cruel em um mundo sombriamente medieval. Ele busca vingança contra seu amigo traidor, o Senhor dos Falcões, enquanto lida com forças de demônios e profecias',
    capitulos: ['Capítulo 1 - O Espadachim Negro', 'Capítulo 2 - O Encontro', 'Capítulo 3 - A Traição'],
    total: 380
  },
  'Batman': {
    title: 'Batman: Absolute',
    autor: 'Vários',
    categoria: 'HQ / Super-herói',
    capa: 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_mose922j392el6h2q2c1nv8g7l/-S897-FWEBP',
    sinopse: 'Batman retorna de seu exílio auto-imposto para restaurar sua presença em Gotham City e acaba envolvido em confrontos com antigos e novos inimigos.',
    capitulos: ['Capítulo 1 - O Retorno', 'Capítulo 2 - Simbiontes do Medo'],
    total: 50
  },
  'Game of Thrones': {
    title: 'Game of Thrones',
    autor: 'George R.R. Martin',
    categoria: 'Livro / Fantasia',
    capa: 'https://i2.wp.com/m.media-amazon.com/images/I/518dGmVCDfL.jpg?w=150&resize=150,200&ssl=1',
    sinopse: 'Sangue, política e dragões. A luta pelo trono de ferro em um reino onde inverno está chegando. Famílias nobres competem pelo poder enquanto forças sombrias crescem no norte.',
    capitulos: ['Capítulo 1 - Inverno Está Chegando', 'Capítulo 2 - O Norte', 'Capítulo 3 - A Guerra'],
    total: 150
  },
  'Senhor Dos Anéis': {
    title: 'Senhor Dos Anéis',
    autor: 'J.R.R. Tolkien',
    categoria: 'Livro / Fantasia',
    capa: 'https://m.media-amazon.com/images/I/51lkAKXgK4L._SY445_SX342_QL70_ML2_.jpg',
    sinopse: 'A jornada épica de Frodo Bolseiro e a Sociedade do Anel para destruir o Um Anel no fogo da Montanha da Perdição e derrotar Sauron.',
    capitulos: ['Capítulo 1 - O Início da Jornada', 'Capítulo 2 - A Irmandade', 'Capítulo 3 - A Batalha do Abismo'],
    total: 100
  },
  'Boa Noite Punpun': {
    title: 'Boa Noite Punpun',
    autor: 'Inio Asano',
    categoria: 'Mangá / Shojo',
    capa: 'https://m.media-amazon.com/images/I/51EQ5jMPsHL._SY425_.jpg',
    sinopse: 'A história de Punpun, um garoto que enfrenta muitos desafios na vida real, enquanto tenta encontrar seu lugar no mundo.',
    capitulos: ['Capítulo 1 - A Vida de Punpun', 'Capítulo 2 - Os Amigos de Punpun', 'Capítulo 3 - O Amor de Punpun'],
    total: 432
  },
  'Tudo bem não estar tudo bem': {
    title: 'Tudo bem não estar tudo bem',
    autor: ' Megan Devine',
    categoria: 'Livro / Triste',
    capa: 'https://m.media-amazon.com/images/I/712tS1Yz6NL._SY425_.jpg',
    sinopse: 'Um guia para lidar com a dor e o luto, oferecendo conforto e compreensão para aqueles que estão passando por momentos difíceis.',
    capitulos: ['Capítulo 1 - Aceitação', 'Capítulo 2 - O Processo de Luto', 'Capítulo 3 - Encontrando Força'],
    total: 240

  },
  'O Iluminado': {
    title: 'O Iluminado',
    autor: 'Stephen King',
    categoria: 'Livro / Horror',
    capa: 'https://m.media-amazon.com/images/I/81Q+pJi4NjL._SY466_.jpg',
    sinopse: 'Um escritor se muda para um hotel isolado e começa a experimentar fenômenos sobrenaturais que afetam sua mente e saúde mental.',
    capitulos: ['Capítulo 1 - O Hotel', 'Capítulo 2 - A Maldição', 'Capítulo 3 - A Vingança'],
    total: 520
  },
  'O Homem de Giz': {
    title: 'O Homem de Giz',
    autor: 'Stephen King',
    categoria: 'Livro / Suspense',
    capa: 'https://m.media-amazon.com/images/I/81Q+pJi4NjL._SY466_.jpg',
    sinopse: 'Em 1986, Eddie e os amigos são apenas crianças prestes a entrar na adolescência. Eles passam a maior parte dos dias andando de bicicleta pela pacata vizinhança e em busca de aventuras. Os desenhos a giz são seu código secreto: homenzinhos-palito rabiscados no asfalto. mensagens que só eles entendem. Mas um desenho misterioso os leva até um corpo desmembrado espalhado em um bosque. E depois disso nada foi o mesmo..',
    capitulos: ['Capítulo 1 - O Desenho', 'Capítulo 2 - A Descoberta', 'Capítulo 3 - O Confronto'],
    total: 520
  },
};

descricaoData['Batman: Absolute'] = descricaoData['Batman'];
const chaveSenhorDosAneis = Object.keys(descricaoData).find((titulo) => titulo.toLowerCase().includes('senhor'));
if (chaveSenhorDosAneis) {
  descricaoData['Senhor Dos Anéis'] = descricaoData[chaveSenhorDosAneis];
  descricaoData['Senhor Dos Aneis'] = descricaoData[chaveSenhorDosAneis];
}


const API_BASE = '/api';

function ehManga(data) {
  return data?.categoria?.toLowerCase().includes('mang');
}

async function buscarMangaDex(title) {
  const res = await fetch(`${API_BASE}/manga/buscar?titulo=${encodeURIComponent(title)}`);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.erro || 'Erro ao buscar MangaDex');
  }

  return json.mangas?.[0] || null;
}

async function buscarCapitulosMangaDex(mangaId) {
  const res = await fetch(`${API_BASE}/manga/${mangaId}/capitulos`);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.erro || 'Erro ao buscar capitulos');
  }

  return json.capitulos || [];
}

function montarHrefLeitura(data, capituloIndex = 0) {
  if (!data.mangaId) {
    return 'Leitura.html?title=' + encodeURIComponent(data.title);
  }

  const params = new URLSearchParams({
    mangaId: data.mangaId,
    title: data.title,
    capitulo: String(capituloIndex),
  });

  return 'Leitura.html?' + params.toString();
}

function renderDescricao(title, data) {
  const capitulos = data.capitulosMangaDex || data.capitulos || [];

  document.getElementById('descricao-capa').src = data.capa;
  document.getElementById('descricao-titulo').innerText = data.title;
  document.getElementById('descricao-categoria').innerText = data.categoria;
  document.getElementById('descricao-autor').innerText = 'Autor: ' + data.autor;
  document.getElementById('descricao-chapters').innerText = 'Capitulos: ' + (data.total || capitulos.length || '-');
  document.getElementById('descricao-sinopse').innerText = data.sinopse;

  const capitulosLista = document.getElementById('capitulos-lista');
  capitulosLista.innerHTML = '';

  if (capitulos.length === 0) {
    const span = document.createElement('span');
    span.innerText = data.mangaId ? 'Nenhum capitulo disponivel no MangaDex.' : 'Capitulos indisponiveis.';
    capitulosLista.appendChild(span);
  }

  capitulos.forEach((cap, index) => {
    const span = document.createElement('span');
    span.innerText = typeof cap === 'string'
      ? cap
      : `Capitulo ${cap.numero}${cap.titulo ? ' - ' + cap.titulo : ''}`;

    if (data.mangaId && typeof cap !== 'string') {
      span.style.cursor = 'pointer';
      span.onclick = () => {
        window.location.href = montarHrefLeitura(data, index);
      };
    }

    capitulosLista.appendChild(span);
  });

  const botaoLer = document.getElementById('botao-ler');
  botaoLer.href = montarHrefLeitura(data);
  botaoLer.innerText = data.mangaId ? 'Comecar a ler' : 'Ir para Leitura';

  const outras = document.getElementById('outras-obras');
  outras.innerHTML = '';
  Object.keys(descricaoData).forEach((nome) => {
    if (nome === title) return;
    const button = document.createElement('button');
    button.innerText = nome;
    button.onclick = () => loadDescricao(nome);
    outras.appendChild(button);
  });

  configurarFavorito(title);
}

function configurarFavorito(title) {
  const btnFavorito = document.getElementById("btn-favorito");
  const favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

  if (favoritos.includes(title)) {
    btnFavorito.classList.replace("fa-regular", "fa-solid");
    btnFavorito.classList.add("favoritado");
  } else {
    btnFavorito.classList.remove("favoritado");
    if (btnFavorito.classList.contains("fa-solid")) {
      btnFavorito.classList.replace("fa-solid", "fa-regular");
    }
  }

  btnFavorito.onclick = (e) => {
    e.preventDefault();
    let favoritosList = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

    if (!favoritosList.includes(title)) {
      favoritosList.push(title);
      btnFavorito.classList.replace("fa-regular", "fa-solid");
      btnFavorito.classList.add("favoritado");
    } else {
      favoritosList = favoritosList.filter(item => item !== title);
      btnFavorito.classList.replace("fa-solid", "fa-regular");
      btnFavorito.classList.remove("favoritado");
    }

    localStorage.setItem("meusFavoritos", JSON.stringify(favoritosList));
  };
}

async function loadDescricao(title) {
  const data = descricaoData[title];

  if (!data) {
    alert('Descricao nao encontrada para: ' + title);
    window.location.href = 'index.html';
    return;
  }

  renderDescricao(title, data);

  if (!ehManga(data)) return;

  document.getElementById('descricao-chapters').innerText = 'Capitulos: carregando...';

  try {
    const manga = await buscarMangaDex(title);
    if (!manga) return;

    const capitulos = await buscarCapitulosMangaDex(manga.id);
    renderDescricao(title, {
      ...data,
      mangaId: manga.id,
      title: manga.titulo || data.title,
      autor: manga.autor || data.autor,
      categoria: 'Manga / MangaDex',
      capa: manga.capa || data.capa,
      sinopse: manga.descricao || data.sinopse,
      total: capitulos.length,
      capitulosMangaDex: capitulos,
    });
  } catch (err) {
    console.error('[MangaDex descricao]', err);
    document.getElementById('descricao-chapters').innerText = 'Capitulos: indisponiveis no momento';
  }
}

function loadDescricaoLocal(title) {
  const data = descricaoData[title];

  if (!data) {
    alert('Descrição não encontrada para: ' + title);
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('descricao-capa').src = data.capa;
  document.getElementById('descricao-titulo').innerText = data.title;
  document.getElementById('descricao-categoria').innerText = data.categoria;
  document.getElementById('descricao-autor').innerText = 'Autor: ' + data.autor;
  document.getElementById('descricao-chapters').innerText = 'Capítulos: ' + data.total;
  document.getElementById('descricao-sinopse').innerText = data.sinopse;

  const capitulosLista = document.getElementById('capitulos-lista');
  capitulosLista.innerHTML = '';
  data.capitulos.forEach((cap) => {
    const span = document.createElement('span');
    span.innerText = cap;
    capitulosLista.appendChild(span);
  });

  const botaoLer = document.getElementById('botao-ler');
  botaoLer.href = 'Leitura.html?title=' + encodeURIComponent(title);
  botaoLer.innerText = 'Começar a ler';

  // Lista outras obras
  const outras = document.getElementById('outras-obras');
  outras.innerHTML = '';
  Object.keys(descricaoData).forEach((nome) => {
    if (nome === title) return;
    const button = document.createElement('button');
    button.innerText = nome;
    button.onclick = () => loadDescricao(nome);
    outras.appendChild(button);
  });

  // Configurar favoritos APÓS o título ser carregado
  const btnFavorito = document.getElementById("btn-favorito");

  // Verificar se já está favoritado
  const favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];
  if (favoritos.includes(title)) {
    btnFavorito.classList.replace("fa-regular", "fa-solid");
    btnFavorito.classList.add("favoritado");
  } else {
    btnFavorito.classList.remove("favoritado");
    if (btnFavorito.classList.contains("fa-solid")) {
      btnFavorito.classList.replace("fa-solid", "fa-regular");
    }
  }

  // Evento de click para favoritar/desfavoritar
  btnFavorito.addEventListener("click", (e) => {
    e.preventDefault();
    let favoritosList = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

    if (!favoritosList.includes(title)) {
      favoritosList.push(title);
      btnFavorito.classList.replace("fa-regular", "fa-solid");
      btnFavorito.classList.add("favoritado");
      console.log(`${title} adicionado aos favoritos!`);
    } else {
      favoritosList = favoritosList.filter(item => item !== title);
      btnFavorito.classList.replace("fa-solid", "fa-regular");
      btnFavorito.classList.remove("favoritado");
      console.log(`${title} removido dos favoritos.`);
    }

    localStorage.setItem("meusFavoritos", JSON.stringify(favoritosList));
  });
}

function initDescricao() {
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get('title') || 'Solo Leveling';
  loadDescricao(title);
}

window.addEventListener('DOMContentLoaded', initDescricao);
