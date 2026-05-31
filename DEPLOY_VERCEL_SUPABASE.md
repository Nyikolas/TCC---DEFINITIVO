# Deploy UniRead na Vercel com Supabase

## 1. Criar tabelas no Supabase

1. Abra Supabase.
2. Entre no projeto.
3. Va em SQL Editor.
4. Cole o conteudo de `backend/supabase_tabelas.sql`.
5. Execute.

## 2. Configurar variaveis na Vercel

Em Vercel > Project Settings > Environment Variables:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key
MANGADEX_BASE=https://api.mangadex.org
FRONTEND_URL=https://seu-projeto.vercel.app
```

`SUPABASE_SERVICE_KEY` fica so no backend. Nunca coloque essa chave em arquivo JS do frontend.

## 3. Deploy

```powershell
npm install
npm test
vercel
vercel --prod
```

## 4. Rotas principais

MangaDex:

```text
GET /api/manga/buscar?titulo=one%20piece
GET /api/manga/:mangaId/capitulos
GET /api/capitulo/:chapterId/paginas
GET /api/imagem?url=...
```

Auth:

```text
POST /api/signup
POST /api/login
```

Perfil:

```text
GET /api/profile/:id
PUT /api/profile/:id
```

Favoritos:

```text
POST /api/favoritos/add
GET /api/favoritos/:usuario_id
DELETE /api/favoritos/remove
```

## 5. Teste rapido

Depois do deploy, abra:

```text
https://seu-projeto.vercel.app/api/manga/buscar?titulo=one%20piece
```

Se retornar JSON com `mangas`, MangaDex esta funcionando.
