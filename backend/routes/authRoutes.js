import { Router } from 'express';
import bcrypt from 'bcryptjs';
import defaultUsersRepository from '../repositories/usersRepository.js';

export function createAuthRoutes({ usersRepository = defaultUsersRepository } = {}) {
  const router = Router();

  router.post('/signup', async (req, res) => {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim();
    const password = String(req.body.password || '');

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos sao obrigatorios!' });
    }

    try {
      const existingUser = await usersRepository.findByUsernameOrEmail(username, email);

      if (existingUser) {
        return res.status(400).json({ error: 'Usuario ou email ja registrado!' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await usersRepository.createUser({ username, email, passwordHash });

      res.status(201).json({
        message: 'Usuario registrado com sucesso!',
        user_id: user.id,
        user: publicUser(user),
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Usuario ou email ja registrado!' });
      }

      return sendRepositoryError(res, err, 'Erro ao registrar usuario');
    }
  });

  router.post('/login', async (req, res) => {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario e senha sao obrigatorios!' });
    }

    try {
      const user = await usersRepository.findByUsername(username);

      if (!user) {
        return res.status(401).json({ error: 'Usuario ou senha incorretos' });
      }

      const passwordOk = await bcrypt.compare(password, user.passwordHash || '');

      if (!passwordOk) {
        return res.status(401).json({ error: 'Usuario ou senha incorretos' });
      }

      res.status(200).json({
        message: 'Login realizado com sucesso!',
        user: publicUser(user),
      });
    } catch (err) {
      return sendRepositoryError(res, err, 'Erro ao buscar usuario');
    }
  });

  return router;
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username || user.nome,
    email: user.email,
  };
}

function sendRepositoryError(res, err, message) {
  console.error('[auth]', err.message);

  if (err.code === 'SUPABASE_NOT_CONFIGURED') {
    return res.status(503).json({ error: 'Supabase nao configurado no backend' });
  }

  return res.status(500).json({ error: message });
}

export default createAuthRoutes();
