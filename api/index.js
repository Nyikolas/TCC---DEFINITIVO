import app from '../backend/server.js';

export default function handler(req, res) {
  normalizarUrlReescrita(req);
  return app(req, res);
}

function normalizarUrlReescrita(req) {
  const url = new URL(req.url || '/', 'http://localhost');
  const path = primeiro(req.query?.path) || url.searchParams.get('path');

  if (!path) return;

  url.searchParams.delete('path');
  const query = url.searchParams.toString();
  req.url = `/api/${String(path).replace(/^\/+/, '')}${query ? `?${query}` : ''}`;
}

function primeiro(valor) {
  if (Array.isArray(valor)) return valor[0];
  return valor || null;
}
