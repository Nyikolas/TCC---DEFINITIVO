import { Router } from 'express';
import defaultFavoritesRepository from '../repositories/favoritesRepository.js';

export function createFavoriteRoutes({ favoritesRepository = defaultFavoritesRepository } = {}) {
  const router = Router();

  router.post('/add', async (req, res) => {
    const { usuario_id, obra_titulo } = req.body;

    if (!usuario_id || !obra_titulo) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    try {
      await favoritesRepository.addFavorite({ usuario_id, obra_titulo });
      res.status(201).json({ message: 'Favorito adicionado!' });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Obra ja favoritada' });
      }

      return sendRepositoryError(res, err, 'Erro ao adicionar favorito');
    }
  });

  router.get('/:usuario_id', async (req, res) => {
    try {
      const favorites = await favoritesRepository.listFavorites(req.params.usuario_id);
      res.status(200).json(favorites);
    } catch (err) {
      return sendRepositoryError(res, err, 'Erro ao buscar favoritos');
    }
  });

  router.delete('/remove', async (req, res) => {
    const { usuario_id, obra_titulo } = req.body;

    if (!usuario_id || !obra_titulo) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    try {
      await favoritesRepository.removeFavorite({ usuario_id, obra_titulo });
      res.status(200).json({ message: 'Favorito removido!' });
    } catch (err) {
      return sendRepositoryError(res, err, 'Erro ao remover favorito');
    }
  });

  return router;
}

function sendRepositoryError(res, err, message) {
  console.error('[favoritos]', err.message);

  if (err.code === 'SUPABASE_NOT_CONFIGURED') {
    return res.status(503).json({ error: 'Supabase nao configurado no backend' });
  }

  return res.status(500).json({ error: message });
}

export default createFavoriteRoutes();
