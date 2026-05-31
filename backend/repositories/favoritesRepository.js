import supabase from '../supabase.js';

export async function addFavorite({ usuario_id, obra_titulo }) {
  const client = requireSupabase();
  const { error } = await client
    .from('favoritos')
    .insert({ usuario_id, obra_titulo });

  throwIfError(error);
}

export async function listFavorites(usuario_id) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('favoritos')
    .select('id,usuario_id,obra_titulo,criado_em')
    .eq('usuario_id', usuario_id)
    .order('criado_em', { ascending: false });

  throwIfError(error);
  return data || [];
}

export async function removeFavorite({ usuario_id, obra_titulo }) {
  const client = requireSupabase();
  const { error } = await client
    .from('favoritos')
    .delete()
    .eq('usuario_id', usuario_id)
    .eq('obra_titulo', obra_titulo);

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

export default {
  addFavorite,
  listFavorites,
  removeFavorite,
};
