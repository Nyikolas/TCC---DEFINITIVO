import 'dotenv/config';

const HOME_TITLE_ALIASES = new Map([
  ['boa noite punpun', 'Oyasumi Punpun'],
  ['boa noite pun-pun', 'Oyasumi Punpun'],
]);

function getBaseUrl() {
  return process.env.MANGADEX_BASE || 'https://api.mangadex.org';
}

async function md(path) {
  const res = await fetch(`${getBaseUrl()}${path}`);
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(json.errors?.[0]?.detail || 'Erro MangaDex');
  }

  return json;
}

function normalizarChaveTitulo(titulo) {
  return String(titulo || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function resolverTituloBusca(titulo) {
  const chave = normalizarChaveTitulo(titulo);
  return HOME_TITLE_ALIASES.get(chave) || titulo;
}

function paramsBuscaManga(titulo, limite, idioma) {
  const params = new URLSearchParams();
  params.set('title', resolverTituloBusca(titulo));
  params.set('limit', String(limite));
  params.append('includes[]', 'cover_art');
  params.append('includes[]', 'author');

  if (idioma) {
    params.append('availableTranslatedLanguage[]', idioma);
  }

  return params;
}

async function buscarMangaRaw(titulo, limite, idioma) {
  const params = paramsBuscaManga(titulo, limite, idioma);
  const json = await md(`/manga?${params}`);
  return json.data || [];
}

export async function buscarManga(titulo, limite = 10) {
  let mangas = await buscarMangaRaw(titulo, limite);

  if (mangas.length === 0) {
    mangas = await buscarMangaRaw(titulo, limite, 'pt-br');
  }

  return ordenarPorTitulo(mangas, titulo).map((manga) => formatarManga(manga, titulo));
}

export async function buscarDetalhesManga(mangaId) {
  const json = await md(`/manga/${mangaId}?includes[]=cover_art&includes[]=author`);
  return formatarManga(json.data);
}

function paramsCapitulos(idioma) {
  const params = new URLSearchParams();
  params.set('order[chapter]', 'asc');
  params.set('limit', '500');

  if (idioma) {
    params.append('translatedLanguage[]', idioma);
  }

  return params;
}

async function listarCapitulosRaw(mangaId, idioma) {
  const params = paramsCapitulos(idioma);
  const json = await md(`/manga/${mangaId}/feed?${params}`);
  return json.data || [];
}

export async function listarCapitulos(mangaId) {
  let capitulos = await listarCapitulosRaw(mangaId, 'pt-br');

  if (!capitulos.some(temPaginas)) {
    capitulos = await listarCapitulosRaw(mangaId, 'en');
  }

  if (!capitulos.some(temPaginas)) {
    capitulos = await listarCapitulosRaw(mangaId);
  }

  return capitulos
    .filter(temPaginas)
    .map((capitulo) => ({
      id: capitulo.id,
      numero: capitulo.attributes.chapter || '?',
      titulo: capitulo.attributes.title || '',
      data: formatarData(capitulo.attributes.publishAt),
      paginas: capitulo.attributes.pages,
      idioma: capitulo.attributes.translatedLanguage || '',
    }));
}

export async function buscarPaginas(chapterId) {
  const json = await md(`/at-home/server/${chapterId}`);
  const { baseUrl, chapter } = json;
  const { hash, data = [], dataSaver = [] } = chapter || {};
  const arquivos = data.length > 0 ? data : dataSaver;

  return arquivos.map((arquivo) => `${baseUrl}/data/${hash}/${arquivo}`);
}

function formatarManga(manga, tituloBuscado = '') {
  return {
    id: manga.id,
    titulo: tituloPreferido(manga, tituloBuscado) || 'Sem titulo',
    descricao: primeiroTexto(manga.attributes.description) || '',
    status: manga.attributes.status,
    capa: getCapa(manga),
    autor: getAutor(manga),
  };
}

function getCapa(manga) {
  const rel = manga.relationships?.find((item) => item.type === 'cover_art');
  const fileName = rel?.attributes?.fileName;

  if (!fileName) return null;
  return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`;
}

function getAutor(manga) {
  const rel = manga.relationships?.find((item) => item.type === 'author');
  return rel?.attributes?.name || 'Desconhecido';
}

function temPaginas(capitulo) {
  return Number(capitulo.attributes?.pages || 0) > 0;
}

function formatarData(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

function primeiroTexto(campo = {}) {
  return campo['pt-br'] || campo.en || Object.values(campo).find(Boolean) || '';
}

function ordenarPorTitulo(mangas, tituloBuscado) {
  return [...mangas].sort((a, b) => {
    return pontuarTitulo(a, tituloBuscado) - pontuarTitulo(b, tituloBuscado);
  });
}

function pontuarTitulo(manga, tituloBuscado) {
  const alvo = normalizarChaveTitulo(resolverTituloBusca(tituloBuscado));
  const original = normalizarChaveTitulo(tituloBuscado);
  const titulos = todosTitulos(manga).map(normalizarChaveTitulo);

  if (titulos.some((titulo) => titulo === alvo || titulo === original)) return 0;
  if (titulos.some((titulo) => titulo.startsWith(`${alvo}:`) || titulo.startsWith(`${original}:`))) return 1;
  if (titulos.some((titulo) => titulo.startsWith(alvo) || titulo.startsWith(original))) return 2;
  if (titulos.some((titulo) => titulo.includes(alvo) || titulo.includes(original))) return 3;
  return 4;
}

function todosTitulos(manga) {
  const principais = Object.values(manga.attributes.title || {});
  const alternativos = (manga.attributes.altTitles || [])
    .flatMap((item) => Object.values(item || {}));

  return [...principais, ...alternativos].filter(Boolean);
}

function tituloPreferido(manga, tituloBuscado) {
  if (tituloBuscado) {
    const alvo = normalizarChaveTitulo(resolverTituloBusca(tituloBuscado));
    const original = normalizarChaveTitulo(tituloBuscado);
    const exato = todosTitulos(manga).find((titulo) => {
      const normalizado = normalizarChaveTitulo(titulo);
      return normalizado === alvo || normalizado === original;
    });

    if (exato) return exato;
  }

  return primeiroTexto(manga.attributes.title);
}
