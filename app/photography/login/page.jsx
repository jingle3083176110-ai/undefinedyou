"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "../../../lib/supabase/browser.js";

export default function PhotographyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: authError } = await createBrowserSupabaseClient().auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push("/photography/admin");
      router.refresh();
    } catch {
      setError("登录失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-20">
      <section className="w-full max-w-md border border-ink/15 bg-warmwhite p-8 md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">Photography / Private</p>
        <h1 className="mt-6 font-serif text-5xl leading-none text-ink">摄影后台登录</h1>
        <p className="mt-5 leading-relaxed text-muted">登录以管理你的摄影档案。</p>
      <form className="mt-10 space-y-6" onSubmit={submit}>
        <label className="block text-sm text-muted" htmlFor="email">邮箱<input className="mt-2 w-full border-b border-ink/25 bg-transparent px-0 py-3 text-ink outline-none focus:border-ink" id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="block text-sm text-muted" htmlFor="password">密码<input className="mt-2 w-full border-b border-ink/25 bg-transparent px-0 py-3 text-ink outline-none focus:border-ink" id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error ? <p role="alert">{error}</p> : null}
        <button className="w-full bg-ink px-5 py-4 font-mono text-xs uppercase tracking-[0.18em] text-cream transition-colors hover:bg-accent disabled:opacity-60" type="submit" disabled={loading}>{loading ? "登录中…" : "登录"}</button>
      </form>
      </section>
    </main>
  );
}
