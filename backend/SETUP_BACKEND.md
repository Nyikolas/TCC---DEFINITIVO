# Setup backend UniRead

Backend atual usa:

- Express
- Supabase
- MangaDex via adapter `backend/mangadex.js`

MySQL local nao e mais usado.

## Instalar dependencias

```powershell
cd backend
npm install
```

## Configurar ambiente

Crie `backend/.env` para rodar localmente:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key
MANGADEX_BASE=https://api.mangadex.org
PORT=3000
```

## Criar tabelas

No Supabase > SQL Editor, cole e execute:

```text
backend/supabase_tabelas.sql
```

## Rodar local

```powershell
npm start
```

Teste:

```text
http://localhost:3000/api/manga/buscar?titulo=one%20piece
```

## Testes

```powershell
npm test
```
