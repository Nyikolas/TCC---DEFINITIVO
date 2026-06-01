import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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
