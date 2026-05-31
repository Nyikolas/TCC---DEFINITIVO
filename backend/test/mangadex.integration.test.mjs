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

async function startApp() {
  const { createApp } = await import('../server.js');
  const server = createApp().listen(0, '127.0.0.1');
  const baseUrl = await new Promise((resolve) => {
    server.on('listening', () => {
      const { port } = server.address();
      resolve(`http://127.0.0.1:${port}`);
    });
  });

  return { baseUrl, close: () => server.close() };
}

test('busca obra de manga da Home pelo MangaDex', async (t) => {
  let mangaDexTitle = null;
  const fakeMangaDex = await startFakeMangaDex((url, res) => {
    if (url.pathname !== '/manga') {
      sendJson(res, 404, { errors: [{ detail: 'not found' }] });
      return;
    }

    mangaDexTitle = url.searchParams.get('title');
    sendJson(res, 200, {
      data: [
        {
          id: 'punpun-id',
          attributes: {
            title: { en: 'Goodnight Punpun' },
            description: { en: 'Punpun follows ordinary life turning heavy.' },
            status: 'completed',
          },
          relationships: [
            {
              type: 'cover_art',
              attributes: { fileName: 'cover-file.jpg' },
            },
          ],
        },
      ],
    });
  });
  t.after(fakeMangaDex.close);

  process.env.MANGADEX_BASE = fakeMangaDex.baseUrl;
  const app = await startApp();
  t.after(app.close);

  const res = await fetch(`${app.baseUrl}/api/manga/buscar?titulo=${encodeURIComponent('Boa Noite Punpun')}`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(mangaDexTitle, 'Oyasumi Punpun');
  assert.equal(body.mangas[0].id, 'punpun-id');
  assert.equal(body.mangas[0].titulo, 'Goodnight Punpun');
  assert.equal(
    body.mangas[0].capa,
    'https://uploads.mangadex.org/covers/punpun-id/cover-file.jpg.256.jpg',
  );
});

test('lista capitulos legiveis e busca paginas do capitulo', async (t) => {
  const idiomasConsultados = [];
  const fakeMangaDex = await startFakeMangaDex((url, res) => {
    if (url.pathname === '/manga/punpun-id/feed') {
      const idioma = url.searchParams.get('translatedLanguage[]') || '';
      idiomasConsultados.push(idioma);

      if (idioma === 'pt-br') {
        sendJson(res, 200, {
          data: [
            {
              id: 'chapter-empty',
              attributes: {
                chapter: '1',
                title: 'Sem paginas',
                pages: 0,
                translatedLanguage: 'pt-br',
                publishAt: '2025-01-01T00:00:00Z',
              },
            },
          ],
        });
        return;
      }

      sendJson(res, 200, {
        data: [
          {
            id: 'chapter-readable',
            attributes: {
              chapter: '1',
              title: 'A readable chapter',
              pages: 2,
              translatedLanguage: 'en',
              publishAt: '2025-01-02T00:00:00Z',
            },
          },
        ],
      });
      return;
    }

    if (url.pathname === '/at-home/server/chapter-readable') {
      sendJson(res, 200, {
        baseUrl: 'https://uploads.example',
        chapter: {
          hash: 'chapter-hash',
          data: ['001.jpg', '002.jpg'],
        },
      });
      return;
    }

    sendJson(res, 404, { errors: [{ detail: 'not found' }] });
  });
  t.after(fakeMangaDex.close);

  process.env.MANGADEX_BASE = fakeMangaDex.baseUrl;
  const app = await startApp();
  t.after(app.close);

  const capitulosRes = await fetch(`${app.baseUrl}/api/manga/punpun-id/capitulos`);
  const capitulosBody = await capitulosRes.json();

  assert.equal(capitulosRes.status, 200);
  assert.deepEqual(idiomasConsultados, ['pt-br', 'en']);
  assert.deepEqual(
    capitulosBody.capitulos.map((capitulo) => ({
      id: capitulo.id,
      numero: capitulo.numero,
      paginas: capitulo.paginas,
      idioma: capitulo.idioma,
    })),
    [
      {
        id: 'chapter-readable',
        numero: '1',
        paginas: 2,
        idioma: 'en',
      },
    ],
  );

  const paginasRes = await fetch(`${app.baseUrl}/api/capitulo/chapter-readable/paginas`);
  const paginasBody = await paginasRes.json();

  assert.equal(paginasRes.status, 200);
  assert.deepEqual(paginasBody.paginas, [
    'https://uploads.example/data/chapter-hash/001.jpg',
    'https://uploads.example/data/chapter-hash/002.jpg',
  ]);
});

test('prioriza obra exata antes de spin-off na busca da Home', async (t) => {
  const fakeMangaDex = await startFakeMangaDex((url, res) => {
    if (url.pathname !== '/manga') {
      sendJson(res, 404, { errors: [{ detail: 'not found' }] });
      return;
    }

    sendJson(res, 200, {
      data: [
        {
          id: 'ragnarok-id',
          attributes: {
            title: { 'ko-ro': 'Na Honjaman Level Up: Ragnarok' },
            altTitles: [{ en: 'Solo Leveling: Ragnarok' }],
            description: {},
            status: 'ongoing',
          },
          relationships: [],
        },
        {
          id: 'solo-leveling-id',
          attributes: {
            title: { 'ko-ro': 'Na Honjaman Level-Up' },
            altTitles: [{ en: 'Solo Leveling' }],
            description: {},
            status: 'completed',
          },
          relationships: [],
        },
      ],
    });
  });
  t.after(fakeMangaDex.close);

  process.env.MANGADEX_BASE = fakeMangaDex.baseUrl;
  const app = await startApp();
  t.after(app.close);

  const res = await fetch(`${app.baseUrl}/api/manga/buscar?titulo=${encodeURIComponent('Solo Leveling')}`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.mangas[0].id, 'solo-leveling-id');
  assert.equal(body.mangas[0].titulo, 'Solo Leveling');
});

test('serve imagem do leitor por proxy', async (t) => {
  const fakeImageServer = http.createServer((req, res) => {
    if (req.url !== '/data/hash/001.jpg') {
      res.writeHead(404);
      res.end();
      return;
    }

    res.writeHead(200, { 'content-type': 'image/jpeg' });
    res.end(Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
  });
  const fakeImageBase = await listen(fakeImageServer);
  t.after(() => fakeImageServer.close());

  const app = await startApp();
  t.after(app.close);

  const imageUrl = `${fakeImageBase}/data/hash/001.jpg`;
  const res = await fetch(`${app.baseUrl}/api/imagem?url=${encodeURIComponent(imageUrl)}`);
  const bytes = Buffer.from(await res.arrayBuffer());

  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'image/jpeg');
  assert.deepEqual([...bytes], [0xff, 0xd8, 0xff, 0xd9]);
});
