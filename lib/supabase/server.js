import { createServerClient } from "@supabase/ssr";

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  return { url, key };
}

export function createServerSupabaseClient(cookieStore) {
  const { url, key } = config();
  const cookies = cookieStore?.cookies || cookieStore;
  if (!cookies || typeof cookies.getAll !== "function") {
    throw new TypeError("createServerSupabaseClient requires a cookies adapter with getAll.");
  }
  const setAll = typeof cookies.setAll === "function"
    ? (values) => cookies.setAll(values)
    : (values) => values.forEach(({ name, value, options }) => {
      // Route handlers receive Next's RequestCookies, which exposes set rather than setAll.
      try { cookies.set?.(name, value, options); } catch {}
    });
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll,
    },
  });
  client.__cookieAdapter = cookies;
  return client;
}
