import supabase from '../supabase.js';

const USER_SELECT = 'id,nome,email,senha_hash,foto_perfil,xp,nivel,criado_em';

export async function findByUsernameOrEmail(username, email) {
  return await findByUsername(username) || await findByEmail(email);
}

export async function findByUsername(username) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('usuarios')
    .select(USER_SELECT)
    .eq('nome', username)
    .maybeSingle();

  throwIfError(error);
  return mapUser(data);
}

export async function findByEmail(email) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('usuarios')
    .select(USER_SELECT)
    .eq('email', email)
    .maybeSingle();

  throwIfError(error);
  return mapUser(data);
}

export async function createUser({ username, email, passwordHash }) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('usuarios')
    .insert({
      nome: username,
      email,
      senha_hash: passwordHash,
    })
    .select(USER_SELECT)
    .single();

  throwIfError(error);
  return mapUser(data);
}

export async function findProfile(userId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('usuarios')
    .select('id,nome,email,foto_perfil,xp,nivel,criado_em')
    .eq('id', userId)
    .maybeSingle();

  throwIfError(error);
  return mapProfile(data);
}

export async function updateProfile(userId, { nome, fotoPerfil, xp, nivel }) {
  const client = requireSupabase();
  const updates = {
    nome,
    foto_perfil: fotoPerfil,
  };

  if (Number.isFinite(Number(xp))) {
    updates.xp = Number(xp);
  }

  if (Number.isFinite(Number(nivel))) {
    updates.nivel = Number(nivel);
  }

  const { error } = await client
    .from('usuarios')
    .update(updates)
    .eq('id', userId);

  throwIfError(error);
}

function requireSupabase() {
  if (!supabase) {
    const err = new Error('Supabase nao configurado');
    err.code = 'SUPABASE_NOT_CONFIGURED';
    throw err;
  }

  return supabase;
}

function throwIfError(error) {
  if (error) throw error;
}

function mapUser(row) {
  if (!row) return null;

  return {
    ...mapProfile(row),
    username: row.nome,
    passwordHash: row.senha_hash,
  };
}

function mapProfile(row) {
  if (!row) return null;

  return {
    id: row.id,
    nome: row.nome,
    username: row.nome,
    email: row.email,
    fotoPerfil: row.foto_perfil,
    xp: row.xp,
    nivel: row.nivel,
    criado_em: row.criado_em,
  };
}

export default {
  findByUsernameOrEmail,
  findByUsername,
  findByEmail,
  createUser,
  findProfile,
  updateProfile,
};
