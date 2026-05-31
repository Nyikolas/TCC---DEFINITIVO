-- UniRead - tabelas Supabase
-- Cole no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  foto_perfil text,
  xp integer not null default 0,
  nivel integer not null default 1,
  criado_em timestamptz not null default now()
);

create unique index if not exists idx_usuarios_nome
  on usuarios (lower(nome));

create table if not exists favoritos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  obra_titulo text not null,
  criado_em timestamptz not null default now(),
  unique (usuario_id, obra_titulo)
);

create index if not exists idx_favoritos_usuario
  on favoritos (usuario_id);

create table if not exists progresso_leitura (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  manga_id text not null,
  chapter_id text not null,
  pagina integer not null default 1,
  updated_at timestamptz not null default now(),
  unique (user_id, manga_id, chapter_id)
);

create index if not exists idx_progresso_user
  on progresso_leitura (user_id);

create index if not exists idx_progresso_manga
  on progresso_leitura (user_id, manga_id);

alter table usuarios enable row level security;
alter table favoritos enable row level security;
alter table progresso_leitura enable row level security;

-- Backend usa SERVICE_ROLE_KEY, entao ignora RLS.
-- Se usar Supabase Auth direto no frontend depois, crie policies por auth.uid().
