import 'dotenv/config';

const { SUPABASE_URL } = process.env;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  } catch (err) {
    console.warn('[supabase] pacote @supabase/supabase-js nao instalado; progresso desativado');
  }
}

export default supabase;
