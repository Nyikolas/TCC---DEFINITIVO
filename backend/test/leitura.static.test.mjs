import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '..', '..');

test('leitor expoe perfil e imagens passam pelo proxy', async () => {
  const html = await readFile(resolve(root, 'Leitura.html'), 'utf8');
  const js = await readFile(resolve(root, 'src', 'Js', 'Leitura.js'), 'utf8');
  const descricaoJs = await readFile(resolve(root, 'src', 'Js', 'Descricao.js'), 'utf8');
  const perfilJs = await readFile(resolve(root, 'src', 'Js', 'Perfil.js'), 'utf8');
  const perfilTemaJs = await readFile(resolve(root, 'src', 'Js', 'PerfilTema.js'), 'utf8');

  assert.match(html, /href="Perfil\.html"/);
  assert.match(html, /id="fotoPerfilNav"/);
  assert.match(js, /function proxificarImagem/);
  assert.match(js, /\/imagem\?url=/);
  assert.match(js, /function getApiBase/);
  assert.match(descricaoJs, /function getApiBase/);
  assert.match(perfilJs, /\/profile\/\$\{userId\}/);
  assert.match(perfilTemaJs, /salvarPerfilRemoto/);
});
// Testa que o leitor explica claramente quando a API devolve HTML em vez de JSON, para evitar confusão do usuário - e isso
test('leitor explica quando a API devolve HTML em vez de JSON', async () => {
  const js = await readFile(resolve(root, 'src', 'Js', 'Leitura.js'), 'utf8');
  const context = {
    window: {
      UNIREAD_API_BASE: '/api',
      location: { hostname: 'uniread.vercel.app', protocol: 'https:', port: '' },
      addEventListener() {},
    },
    document: { addEventListener() {} },
    fetch: async () => ({
      ok: false,
      status: 404,
      text: async () => '<html><body>The page could not be found</body></html>',
    }),
    console,
    URLSearchParams,
    CustomEvent: class CustomEvent {},
    setInterval() {},
  };

  vm.runInNewContext(js, context);

  await assert.rejects(
    () => context.fetchJson('/api/manga/buscar?titulo=one%20piece'),
    /Resposta nao JSON.*The page could not be found/,
  );
});
