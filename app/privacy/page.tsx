export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f5f9ff] px-4 py-12 text-[#00284d] sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[960px] space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a7190]">
            Privacy Policy
          </p>
          <h1 className="text-3xl font-semibold text-[#00284d]">
            Privacy-first Markdown to text conversion.
          </h1>
          <p className="text-sm text-[#355070]">
            Mark2Text is a client-side Markdown to text converter. Your Markdown and
            output never leave your browser, which keeps your content private and
            secure.
          </p>
        </header>

        <section className="rounded-2xl border border-[#c9e2ff] bg-white p-6 text-sm text-[#355070] shadow-sm">
          <h2 className="text-base font-semibold text-[#00284d]">
            What we collect
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>No Markdown uploads or server-side storage.</li>
            <li>No analytics, ads, or tracking pixels.</li>
            <li>No account creation or personal data collection.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#c9e2ff] bg-white p-6 text-sm text-[#355070] shadow-sm">
          <h2 className="text-base font-semibold text-[#00284d]">
            How the converter works
          </h2>
          <p className="mt-3">
            Markdown conversion happens locally in your browser using a secure,
            sanitized pipeline. Clipboard access is only used when you press Copy.
            Downloading creates a file directly in your browser without sending data
            anywhere.
          </p>
        </section>

        <section className="rounded-2xl border border-[#c9e2ff] bg-white p-6 text-sm text-[#355070] shadow-sm">
          <h2 className="text-base font-semibold text-[#00284d]">Contact</h2>
          <p className="mt-3">
            If you have privacy questions about this online Markdown to plain text
            converter, email us and we will respond promptly.
          </p>
        </section>

        <a
          href="/"
          className="text-sm font-medium text-[#0285ff] hover:text-[#0270d6]"
        >
          ← Back to Mark2Text
        </a>
      </div>
    </main>
  );
}
