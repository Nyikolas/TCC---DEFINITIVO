import { pathToFileURL } from 'node:url';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mangaRoutes from './manga.js';
import { createAuthRoutes } from './routes/authRoutes.js';
import { createFavoriteRoutes } from './routes/favoriteRoutes.js';
import { createUserRoutes } from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;

export function createApp(options = {}) {
  const app = express();
  const {
    usersRepository,
    favoritesRepository,
  } = options;

  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));

  app.use(express.json());
  app.use('/api', mangaRoutes);
  app.use('/api', createAuthRoutes({ usersRepository }));
  app.use('/api', createUserRoutes({ usersRepository }));
  app.use('/api/favoritos', createFavoriteRoutes({ favoritesRepository }));

  app.get('/', (req, res) => {
    res.json({ status: 'UniRead API rodando', versao: '1.0.0' });
  });

  return app;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(PORT, () => {
    console.log(`UniRead API rodando em http://localhost:${PORT}`);
  });
}

export default createApp();
