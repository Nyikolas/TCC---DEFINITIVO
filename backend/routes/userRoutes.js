import { Router } from 'express';
import defaultUsersRepository from '../repositories/usersRepository.js';

export function createUserRoutes({ usersRepository = defaultUsersRepository } = {}) {
  const router = Router();

  router.get('/profile/:id', async (req, res) => {
    try {
      const profile = await usersRepository.findProfile(req.params.id);

      if (!profile) {
        return res.status(404).json({ error: 'Usuario nao encontrado' });
      }

      res.status(200).json(profile);
    } catch (err) {
      return sendRepositoryError(res, err, 'Erro ao buscar perfil');
    }
  });

  router.put('/profile/:id', async (req, res) => {
    const { nome, fotoPerfil, xp, nivel } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome e obrigatorio' });
    }

    try {
      await usersRepository.updateProfile(req.params.id, { nome, fotoPerfil, xp, nivel });
      res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
    } catch (err) {
      return sendRepositoryError(res, err, 'Erro ao atualizar perfil');
    }
  });

  return router;
}

function sendRepositoryError(res, err, message) {
  console.error('[profile]', err.message);

  if (err.code === 'SUPABASE_NOT_CONFIGURED') {
    return res.status(503).json({ error: 'Supabase nao configurado no backend' });
  }

  return res.status(500).json({ error: message });
}

export default createUserRoutes();
