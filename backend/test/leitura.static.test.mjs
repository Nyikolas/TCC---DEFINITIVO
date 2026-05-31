import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');

test('leitor expoe perfil e imagens passam pelo proxy', async () => {
  const html = await readFile(resolve(root, 'Leitura.html'), 'utf8');
  const js = await readFile(resolve(root, 'src', 'Js', 'Leitura.js'), 'utf8');
  const descricaoJs = await readFile(resolve(root, 'src', 'Js', 'Descricao.js'), 'utf8');

  assert.match(html, /href="Perfil\.html"/);
  assert.match(html, /id="fotoPerfilNav"/);
  assert.match(js, /function proxificarImagem/);
  assert.match(js, /\/imagem\?url=/);
  assert.doesNotMatch(js, /localhost:3000/);
  assert.doesNotMatch(descricaoJs, /localhost:3000/);
  assert.match(js, /const API_BASE = '\/api'/);
  assert.match(descricaoJs, /const API_BASE = '\/api'/);
});
