import { createClient } from "@supabase/supabase-js";

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  return { url, key };
}

export function createAdminSupabaseClient() {
  const { url, key } = config();
  const options = { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } };
  const client = createClient(url, key, options);
  client.__options = options;
  return client;
}
