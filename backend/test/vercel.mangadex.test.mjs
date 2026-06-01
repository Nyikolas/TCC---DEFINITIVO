import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function listen(server) {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return `http://127.0.0.1:${port}`;
}

async function startFakeMangaDex(handler) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    handler(url, res);
  });

  const baseUrl = await listen(server);
  return { baseUrl, close: () => server.close() };
}

function createMockResponse() {
  const response = {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    json(body) {
      this.setHeader('content-type', 'application/json');
      this.body = body;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };

  return response;
}

async function call(handler, req) {
  const res = createMockResponse();
  await handler(req, res);
  return res;
}

test('adapters Vercel exportam handlers validos', async () => {
  const adapterPaths = [
    '../../api/index.js',
    '../../api/login.js',
    '../../api/signup.js',
    '../../api/profile/[id].js',
    '../../api/favoritos/add.js',
    '../../api/favoritos/remove.js',
    '../../api/favoritos/[usuario_id].js',
    '../../api/progresso.js',
    '../../api/progresso/[mangaId].js',
    '../../api/manga/buscar.js',
    '../../api/manga/[mangaId].js',
    '../../api/manga/[mangaId]/capitulos.js',
    '../../api/capitulo/[chapterId]/paginas.js',
    '../../api/imagem.js',
  ];

  for (const adapterPath of adapterPaths) {
    const mod = await import(adapterPath);
    assert.equal(typeof mod.default, 'function', adapterPath);
  }
});

test('rotas MangaDex existem como adapters Vercel explicitos', async (t) => {
  const fakeMangaDex = await startFakeMangaDex((url, res) => {
    if (url.pathname === '/manga') {
      sendJson(res, 200, {
        data: [
          {
            id: 'one-piece-id',
            attributes: {
              title: { en: 'One Piece' },
              description: { en: 'Pirate adventure.' },
              status: 'ongoing',
            },
            relationships: [],
          },
        ],
      });
      return;
    }

    if (url.pathname === '/manga/one-piece-id/feed') {
      sendJson(res, 200, {
        data: [
          {
            id: 'chapter-1',
            attributes: {
              chapter: '1',
              title: 'Romance Dawn',
              pages: 2,
              translatedLanguage: 'pt-br',
              publishAt: '2025-01-01T00:00:00Z',
            },
          },
        ],
      });
      return;
    }

    if (url.pathname === '/at-home/server/chapter-1') {
      sendJson(res, 200, {
        baseUrl: 'https://uploads.example',
        chapter: {
          hash: 'hash-1',
          data: ['001.jpg'],
        },
      });
      return;
    }

    sendJson(res, 404, { errors: [{ detail: 'not found' }] });
  });
  t.after(fakeMangaDex.close);

  process.env.MANGADEX_BASE = fakeMangaDex.baseUrl;

  const buscar = (await import('../../api/manga/buscar.js')).default;
  const capitulos = (await import('../../api/manga/[mangaId]/capitulos.js')).default;
  const paginas = (await import('../../api/capitulo/[chapterId]/paginas.js')).default;

  const buscaRes = await call(buscar, {
    method: 'GET',
    url: '/api/manga/buscar?titulo=One%20Piece',
    query: { titulo: 'One Piece' },
  });

  assert.equal(buscaRes.statusCode, 200);
  assert.equal(buscaRes.body.mangas[0].id, 'one-piece-id');

  const capitulosRes = await call(capitulos, {
    method: 'GET',
    url: '/api/manga/one-piece-id/capitulos',
    query: { mangaId: 'one-piece-id' },
  });

  assert.equal(capitulosRes.statusCode, 200);
  assert.equal(capitulosRes.body.capitulos[0].id, 'chapter-1');

  const paginasRes = await call(paginas, {
    method: 'GET',
    url: '/api/capitulo/chapter-1/paginas',
    query: { chapterId: 'chapter-1' },
  });

  assert.equal(paginasRes.statusCode, 200);
  assert.deepEqual(paginasRes.body.paginas, [
    'https://uploads.example/data/hash-1/001.jpg',
  ]);
});
