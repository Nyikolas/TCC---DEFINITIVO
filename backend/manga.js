import { Router } from 'express';
import { buscarManga, buscarDetalhesManga, listarCapitulos, buscarPaginas } from './mangadex.js';
import supabase from './supabase.js';

const router = Router();

router.get('/manga/buscar', async (req, res) => {
  const { titulo } = req.query;

  if (!titulo) {
    return res.status(400).json({ erro: 'Parametro "titulo" e obrigatorio' });
  }

  try {
    const resultado = await buscarManga(titulo);
    res.json({ mangas: resultado });
  } catch (err) {
    console.error('[buscar manga]', err.message);
    res.status(500).json({ erro: 'Erro ao buscar mangas' });
  }
});

router.get('/manga/:mangaId', async (req, res) => {
  try {
    const dados = await buscarDetalhesManga(req.params.mangaId);
    res.json(dados);
  } catch (err) {
    console.error('[detalhes manga]', err.message);
    res.status(500).json({ erro: 'Erro ao buscar detalhes da obra' });
  }
});

router.get('/manga/:mangaId/capitulos', async (req, res) => {
  try {
    const capitulos = await listarCapitulos(req.params.mangaId);
    res.json({ capitulos });
  } catch (err) {
    console.error('[listar capitulos]', err.message);
    res.status(500).json({ erro: 'Erro ao listar capitulos' });
  }
});

router.get('/capitulo/:chapterId/paginas', async (req, res) => {
  try {
    const paginas = await buscarPaginas(req.params.chapterId);
    res.json({ paginas });
  } catch (err) {
    console.error('[buscar paginas]', err.message);
    res.status(500).json({ erro: 'Erro ao buscar paginas do capitulo' });
  }
});

router.get('/imagem', async (req, res) => {
  const { url } = req.query;

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
    res.send(bytes);
  } catch (err) {
    console.error('[proxy imagem]', err.message);
    res.status(502).json({ erro: 'Erro ao buscar imagem' });
  }
});

function imagemPermitida(imageUrl) {
  const host = imageUrl.hostname.toLowerCase();

  return host === 'uploads.mangadex.org' ||
    host.endsWith('.mangadex.network') ||
    host === '127.0.0.1' ||
    host === 'localhost';
}

router.post('/progresso', async (req, res) => {
  const { mangaId, chapterId, pagina } = req.body;

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

  res.json({ ok: true });
});

router.get('/progresso/:mangaId', async (req, res) => {
  if (!supabase) {
    return res.json({ progresso: null });
  }

  const userId = req.headers['x-user-id'] || 'anonimo';

  const { data, error } = await supabase
    .from('progresso_leitura')
    .select('*')
    .eq('user_id', userId)
    .eq('manga_id', req.params.mangaId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ erro: 'Erro ao buscar progresso' });
  }

  res.json({ progresso: data || null });
});

export default router;
