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

async function startVercelFunction(handler) {
  const server = http.createServer((req, res) => handler(req, res));
  const baseUrl = await listen(server);
  return { baseUrl, close: () => server.close() };
}

test('rota Vercel unica atende MangaDex depois do rewrite', async (t) => {
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

  const handler = (await import('../../api/index.js')).default;
  const api = await startVercelFunction(handler);
  t.after(api.close);

  const buscaRes = await fetch(`${api.baseUrl}/api/index.js?path=manga/buscar&titulo=One%20Piece`);
  const buscaBody = await buscaRes.json();

  assert.equal(buscaRes.status, 200);
  assert.equal(buscaBody.mangas[0].id, 'one-piece-id');

  const capitulosRes = await fetch(`${api.baseUrl}/api/index.js?path=manga/one-piece-id/capitulos`);
  const capitulosBody = await capitulosRes.json();

  assert.equal(capitulosRes.status, 200);
  assert.equal(capitulosBody.capitulos[0].id, 'chapter-1');

  const paginasRes = await fetch(`${api.baseUrl}/api/index.js?path=capitulo/chapter-1/paginas`);
  const paginasBody = await paginasRes.json();

  assert.equal(paginasRes.status, 200);
  assert.deepEqual(paginasBody.paginas, [
    'https://uploads.example/data/hash-1/001.jpg',
  ]);
});
