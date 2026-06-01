import { buscarManga, buscarDetalhesManga, listarCapitulos, buscarPaginas } from './mangadex.js';
import supabase from './supabase.js';

export async function handleBuscarManga(req, res) {
  const titulo = getQuery(req, 'titulo');

  if (!titulo) {
    return res.status(400).json({ erro: 'Parametro "titulo" e obrigatorio' });
  }

  try {
    const resultado = await buscarManga(titulo);
    return res.json({ mangas: resultado });
  } catch (err) {
    console.error('[buscar manga]', err.message);
    return res.status(500).json({ erro: 'Erro ao buscar mangas', detalhe: err.message });
  }
}

export async function handleBuscarDetalhesManga(req, res) {
  const mangaId = getParam(req, 'mangaId');

  if (!mangaId) {
    return res.status(400).json({ erro: 'mangaId e obrigatorio' });
  }

  try {
    const dados = await buscarDetalhesManga(mangaId);
    return res.json(dados);
  } catch (err) {
    console.error('[detalhes manga]', err.message);
    return res.status(500).json({ erro: 'Erro ao buscar detalhes da obra', detalhe: err.message });
  }
}

export async function handleListarCapitulos(req, res) {
  const mangaId = getParam(req, 'mangaId');

  if (!mangaId) {
    return res.status(400).json({ erro: 'mangaId e obrigatorio' });
  }

  try {
    const capitulos = await listarCapitulos(mangaId);
    return res.json({ capitulos });
  } catch (err) {
    console.error('[listar capitulos]', err.message);
    return res.status(500).json({ erro: 'Erro ao listar capitulos', detalhe: err.message });
  }
}

export async function handleBuscarPaginas(req, res) {
  const chapterId = getParam(req, 'chapterId');

  if (!chapterId) {
    return res.status(400).json({ erro: 'chapterId e obrigatorio' });
  }

  try {
    const paginas = await buscarPaginas(chapterId);
    return res.json({ paginas });
  } catch (err) {
    console.error('[buscar paginas]', err.message);
    return res.status(500).json({ erro: 'Erro ao buscar paginas do capitulo', detalhe: err.message });
  }
}

export async function handleProxyImagem(req, res) {
  const url = getQuery(req, 'url');

  if (!url) {
    return res.status(400).json({ erro: 'Parametro "url" e obrigatorio' });
  }

  let imageUrl;
  try {
    imageUrl = new URL(url);
  } catch {
    return res.status(400).json({ erro: 'URL de imagem invalida' });
  }

  if (!['http:', 'https:'].includes(imageUrl.protocol)) {
    return res.status(400).json({ erro: 'URL de imagem invalida' });
  }

  if (!imagemPermitida(imageUrl)) {
    return res.status(400).json({ erro: 'Host de imagem nao permitido' });
  }

  try {
    const upstream = await fetch(imageUrl);
    if (!upstream.ok) {
      return res.status(upstream.status).json({ erro: 'Imagem indisponivel' });
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const bytes = Buffer.from(await upstream.arrayBuffer());

    res.setHeader('content-type', contentType);
    res.setHeader('cache-control', 'public, max-age=86400');
    return res.send(bytes);
  } catch (err) {
    console.error('[proxy imagem]', err.message);
    return res.status(502).json({ erro: 'Erro ao buscar imagem' });
  }
}

export async function handleSalvarProgresso(req, res) {
  const { mangaId, chapterId, pagina } = req.body || {};

  if (!mangaId || !chapterId) {
    return res.status(400).json({ erro: 'mangaId e chapterId sao obrigatorios' });
  }

  if (!supabase) {
    return res.json({ ok: true, progresso: 'desativado' });
  }

  const userId = req.headers['x-user-id'] || 'anonimo';

  const { error } = await supabase
    .from('progresso_leitura')
    .upsert({
      user_id: userId,
      manga_id: mangaId,
      chapter_id: chapterId,
      pagina,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id, manga_id, chapter_id' });

  if (error) {
    console.error('[salvar progresso]', error.message);
    return res.status(500).json({ erro: 'Erro ao salvar progresso' });
  }

  return res.json({ ok: true });
}

export async function handleBuscarProgresso(req, res) {
  if (!supabase) {
    return res.json({ progresso: null });
  }

  const mangaId = getParam(req, 'mangaId');
  const userId = req.headers['x-user-id'] || 'anonimo';

  const { data, error } = await supabase
    .from('progresso_leitura')
    .select('*')
    .eq('user_id', userId)
    .eq('manga_id', mangaId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ erro: 'Erro ao buscar progresso' });
  }

  return res.json({ progresso: data || null });
}

function getQuery(req, name) {
  return first(req.query?.[name]) || new URL(req.url || '/', 'http://localhost').searchParams.get(name);
}

function getParam(req, name) {
  return first(req.params?.[name]) || first(req.query?.[name]) || getPathParam(req, name);
}

function getPathParam(req, name) {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;

  if (name === 'mangaId') {
    return pathname.match(/^\/api\/manga\/([^/]+)/)?.[1] || null;
  }

  if (name === 'chapterId') {
    return pathname.match(/^\/api\/capitulo\/([^/]+)/)?.[1] || null;
  }

  return null;
}

function first(value) {
  if (Array.isArray(value)) return value[0];
  return value || null;
}

function imagemPermitida(imageUrl) {
  const host = imageUrl.hostname.toLowerCase();

  return host === 'uploads.mangadex.org' ||
    host.endsWith('.mangadex.network') ||
    host === '127.0.0.1' ||
    host === 'localhost';
}
