export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[960px] space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-700/80 dark:text-orange-200">
            Terms
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Simple terms for a simple tool.
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            By using Mark2Text, you agree to use the tool responsibly and at your
            own discretion.
          </p>
        </header>

        <section className="rounded-2xl border border-orange-200 bg-white p-6 text-sm text-slate-600 dark:border-orange-500/30 dark:bg-slate-900/60 dark:text-slate-300">
          <ul className="space-y-3">
            <li>
              The tool is provided “as is” without warranties of any kind.
            </li>
            <li>
              You are responsible for the content you process and share.
            </li>
            <li>
              We may update these terms as the product evolves.
            </li>
          </ul>
        </section>

        <a
          href="/"
          className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-200"
        >
          ← Back to Mark2Text
        </a>
      </div>
    </main>
  );
}
