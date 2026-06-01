import { Router } from 'express';
import {
  handleBuscarManga,
  handleBuscarDetalhesManga,
  handleListarCapitulos,
  handleBuscarPaginas,
  handleProxyImagem,
  handleSalvarProgresso,
  handleBuscarProgresso,
} from './mangaHandlers.js';

const router = Router();

router.get('/manga/buscar', handleBuscarManga);
router.get('/manga/:mangaId', handleBuscarDetalhesManga);
router.get('/manga/:mangaId/capitulos', handleListarCapitulos);
router.get('/capitulo/:chapterId/paginas', handleBuscarPaginas);
router.get('/imagem', handleProxyImagem);
router.post('/progresso', handleSalvarProgresso);
router.get('/progresso/:mangaId', handleBuscarProgresso);

export default router;
