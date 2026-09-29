export default function PhotographyAdminLoading() {
  return (
    <main className="min-h-screen bg-cream px-6 pb-28 pt-28 md:px-16 lg:px-24" aria-busy="true">
      <div className="mx-auto max-w-6xl animate-pulse">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">Photography / Admin</p>
        <h1 className="mt-5 font-serif text-5xl text-ink">摄影后台</h1>
        <div className="mt-12 h-96 border border-ink/10 bg-warmwhite" />
      </div>
    </main>
  );
}
