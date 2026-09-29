import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const originalEnv = { ...process.env };

function resetEnv() {
  for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY"]) {
    delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
}

test.afterEach(resetEnv);

test("browser client requires public Supabase configuration", async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const { createBrowserSupabaseClient } = await import("./browser.js");
  assert.throws(() => createBrowserSupabaseClient(), /NEXT_PUBLIC_SUPABASE_URL.*NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
});

test("server client passes request cookies and writes response cookies", async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
  const { createServerSupabaseClient } = await import("./server.js");
  const requestCookies = [{ name: "sb-token", value: "abc" }];
  const responseCookies = [];
  const client = createServerSupabaseClient({
    cookies: {
      getAll: () => requestCookies,
      setAll: (cookies) => responseCookies.push(...cookies),
    },
  });
  assert.equal(typeof client.auth.getUser, "function");
  assert.deepEqual(client.__cookieAdapter.getAll(), requestCookies);
  client.__cookieAdapter.setAll([{ name: "sb-refresh", value: "def", options: { httpOnly: true } }]);
  assert.deepEqual(responseCookies, [{ name: "sb-refresh", value: "def", options: { httpOnly: true } }]);
});

test("admin client requires only the secret key and disables session persistence", async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  process.env.SUPABASE_SECRET_KEY = "secret-key";
  const { createAdminSupabaseClient } = await import("./admin.js");
  const client = createAdminSupabaseClient();
  assert.equal(typeof client.auth.getUser, "function");
  assert.deepEqual(client.__options.auth, { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false });
});

test("middleware protects admin pages with redirect and admin APIs with 401", async () => {
  const { middleware } = await import("../../middleware.js");
  const pageResponse = await middleware(new Request("https://example.com/photography/admin"));
  assert.equal(pageResponse.status, 307);
  assert.equal(pageResponse.headers.get("location"), "https://example.com/photography/login");

  const apiResponse = await middleware(new Request("https://example.com/api/admin/photos"));
  assert.equal(apiResponse.status, 401);

  const legacyResponse = await middleware(new Request("https://example.com/photography/manage"));
  assert.equal(legacyResponse.status, 307);
  assert.equal(legacyResponse.headers.get("location"), "https://example.com/photography/login");
});

test("login page provides email/password form and browser auth navigation", async () => {
  const source = await fs.readFile(new URL("../../app/photography/login/page.jsx", import.meta.url), "utf8");
  assert.match(source, /createBrowserSupabaseClient/);
  assert.match(source, /signInWithPassword/);
  assert.match(source, /\/photography\/admin/);
  assert.match(source, /登录失败，请稍后重试。/);
  assert.match(source, /bg-cream/);
  assert.match(source, /font-serif/);
  assert.match(source, /font-mono/);
  assert.match(source, /try \{/);
  assert.match(source, /catch/);
  assert.match(source, /finally/);
});

test("protected photography admin route renders the photography workspace", async () => {
  const source = await fs.readFile(new URL("../../app/photography/admin/page.jsx", import.meta.url), "utf8");
  assert.match(source, /export default/);
  assert.match(source, /PhotoAdminClient/);
});
