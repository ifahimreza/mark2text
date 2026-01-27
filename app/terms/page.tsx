export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[960px] space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-200/70">
            Terms of Service
          </p>
          <h1 className="text-3xl font-semibold text-slate-100">
            Simple terms for a minimalist Markdown converter.
          </h1>
          <p className="text-sm text-slate-300">
            These terms explain how you may use Mark2Text, a client-side Markdown to
            text converter. By using the site, you agree to the guidelines below.
          </p>
        </header>

        <section className="rounded-2xl border border-orange-200/15 bg-slate-950/60 p-6 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Acceptable use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Use the tool for lawful content and respectful workflows.</li>
            <li>Do not attempt to disrupt or reverse engineer the service.</li>
            <li>You are responsible for the Markdown content you convert and share.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-orange-200/15 bg-slate-950/60 p-6 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">No warranties</h2>
          <p className="mt-3">
            Mark2Text is provided “as is” without warranties of any kind. We do not
            guarantee uninterrupted availability, but we aim to keep the online
            Markdown to plain text converter reliable and fast.
          </p>
        </section>

        <section className="rounded-2xl border border-orange-200/15 bg-slate-950/60 p-6 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Updates</h2>
          <p className="mt-3">
            We may update these terms as the product evolves. Continued use of the
            site means you accept the latest version.
          </p>
        </section>

        <a
          href="/"
          className="text-sm font-medium text-orange-200 hover:text-orange-100"
        >
          ← Back to Mark2Text
        </a>
      </div>
    </main>
  );
}
