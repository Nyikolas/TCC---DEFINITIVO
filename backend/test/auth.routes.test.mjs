import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';

async function startApp(options = {}) {
  const { createApp } = await import('../server.js');
  const server = createApp(options).listen(0, '127.0.0.1');
  const baseUrl = await new Promise((resolve) => {
    server.on('listening', () => {
      const { port } = server.address();
      resolve(`http://127.0.0.1:${port}`);
    });
  });

  return { baseUrl, close: () => server.close() };
}

test('cadastro usa repositorio e salva senha com hash', async (t) => {
  let createdUser = null;
  const usersRepository = {
    async findByUsernameOrEmail() {
      return null;
    },
    async createUser(user) {
      createdUser = user;
      return {
        id: 'user-1',
        username: user.username,
        email: user.email,
      };
    },
  };

  const app = await startApp({ usersRepository });
  t.after(app.close);

  const res = await fetch(`${app.baseUrl}/api/signup`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: 'Jacare',
      email: 'jacare@example.com',
      password: '123456',
    }),
  });
  const body = await res.json();

  assert.equal(res.status, 201);
  assert.equal(body.user_id, 'user-1');
  assert.equal(createdUser.username, 'Jacare');
  assert.equal(createdUser.email, 'jacare@example.com');
  assert.notEqual(createdUser.passwordHash, '123456');
  assert.equal(await bcrypt.compare('123456', createdUser.passwordHash), true);
});

test('login valida senha pelo hash salvo no repositorio', async (t) => {
  const passwordHash = await bcrypt.hash('123456', 10);
  const usersRepository = {
    async findByUsername(username) {
      assert.equal(username, 'Jacare');
      return {
        id: 'user-1',
        username: 'Jacare',
        email: 'jacare@example.com',
        passwordHash,
      };
    },
  };

  const app = await startApp({ usersRepository });
  t.after(app.close);

  const res = await fetch(`${app.baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: 'Jacare',
      password: '123456',
    }),
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.user.id, 'user-1');
  assert.equal(body.user.username, 'Jacare');
  assert.equal(body.user.email, 'jacare@example.com');
});

test('perfil atualiza nome, foto, xp e nivel pelo repositorio', async (t) => {
  let updatedProfile = null;
  const usersRepository = {
    async updateProfile(userId, profile) {
      assert.equal(userId, 'user-1');
      updatedProfile = profile;
    },
  };

  const app = await startApp({ usersRepository });
  t.after(app.close);

  const res = await fetch(`${app.baseUrl}/api/profile/user-1`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      nome: 'Nykolas',
      fotoPerfil: 'avatar.png',
      xp: 140,
      nivel: 2,
    }),
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.message, 'Perfil atualizado com sucesso!');
  assert.deepEqual(updatedProfile, {
    nome: 'Nykolas',
    fotoPerfil: 'avatar.png',
    xp: 140,
    nivel: 2,
  });
});
