"use client";

import { useMemo, useState } from "react";
import {
  applyCleanup,
  convertMarkdownToHtml,
  markdownToPlainText,
  type CleanupOptions,
  wrapHtmlDocument
} from "@/lib/convert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_MARKDOWN = `# Mark2Text\n\nPaste Markdown on the left and grab the output on the right.\n\n- **Plain Text** strips formatting\n- **Rich Text** keeps formatting\n- **HTML** shows sanitized output\n\n\`\`\`js\nconsole.log("Hello, Markdown!");\n\`\`\``;

type Tab = "plain" | "rich" | "html";

type OutputState = {
  plain: string;
  html: string;
  rich: string;
};

const DEFAULT_CLEANUP: CleanupOptions = {
  removeExtraBlankLines: true,
  stripLinks: false,
  removeCodeBlocks: false
};

const buildOutputs = (markdown: string, cleanup: CleanupOptions): OutputState => {
  const cleaned = applyCleanup(markdown, cleanup);
  const html = convertMarkdownToHtml(cleaned);
  const plain = markdownToPlainText(cleaned);
  return { plain, html, rich: html };
};

export default function HomePage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [activeTab, setActiveTab] = useState<Tab>("plain");
  const [cleanup, setCleanup] = useState<CleanupOptions>(DEFAULT_CLEANUP);
  const [outputs, setOutputs] = useState<OutputState>(() =>
    buildOutputs(DEFAULT_MARKDOWN, DEFAULT_CLEANUP)
  );
  const [status, setStatus] = useState<string | null>(null);

  const cleanedMarkdown = useMemo(
    () => applyCleanup(markdown, cleanup),
    [markdown, cleanup]
  );
  const generatedHtml = useMemo(
    () => convertMarkdownToHtml(cleanedMarkdown),
    [cleanedMarkdown]
  );
  const generatedPlain = useMemo(
    () => markdownToPlainText(cleanedMarkdown),
    [cleanedMarkdown]
  );

  const handleConvert = () => {
    setOutputs({ plain: generatedPlain, html: generatedHtml, rich: generatedHtml });
    setStatus("Converted.");
  };

  const handleCopy = async () => {
    try {
      if (activeTab === "plain") {
        await navigator.clipboard.writeText(outputs.plain);
      } else if (activeTab === "html") {
        await navigator.clipboard.writeText(outputs.html);
      } else {
        if (typeof ClipboardItem !== "undefined") {
          const item = new ClipboardItem({
            "text/html": new Blob([outputs.rich], { type: "text/html" }),
            "text/plain": new Blob([outputs.plain], { type: "text/plain" })
          });
          await navigator.clipboard.write([item]);
        } else {
          await navigator.clipboard.writeText(outputs.plain);
        }
      }
      setStatus("Copied to clipboard.");
    } catch (error) {
      console.error(error);
      setStatus("Copy failed. Please try again.");
    }
  };

  const handleDownload = () => {
    const isPlain = activeTab === "plain";
    const filename = isPlain ? "mark2text.txt" : "mark2text.html";
    const content = isPlain ? outputs.plain : wrapHtmlDocument(outputs.html);
    const type = isPlain ? "text/plain" : "text/html";

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const toggle = (key: keyof CleanupOptions) =>
    (checked: boolean | "indeterminate") =>
      setCleanup((prev) => ({ ...prev, [key]: Boolean(checked) }));

  return (
    <main className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[180px]" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[440px] w-[440px] rounded-full bg-orange-400/10 blur-[200px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col gap-10">
        <header className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
              <span className="bg-gradient-to-r from-orange-200 via-orange-300 to-orange-500 bg-clip-text text-transparent">
                Mark2Text
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-300">
              A minimalist, client-side Markdown to text converter for fast, secure, and
              SEO-ready copy. Convert Markdown to clean plain text, rich text, or HTML in
              your browser.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-orange-300/20 bg-orange-500/10 px-4 py-2">
                Client-side only
              </span>
              <span className="rounded-full border border-orange-300/20 bg-orange-500/10 px-4 py-2">
                No uploads or tracking
              </span>
              <span className="rounded-full border border-orange-300/20 bg-orange-500/10 px-4 py-2">
                Plain text output
              </span>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Paste",
              description: "Drop Markdown into the input area."
            },
            {
              title: "Convert",
              description: "Click Convert to refresh the output."
            },
            {
              title: "Copy or download",
              description: "Grab plain text, rich text, or HTML."
            }
          ].map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-orange-200/15 bg-slate-950/40 p-4 text-sm text-slate-300"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-orange-200/60">
                Step {index + 1}
              </p>
              <h2 className="mt-2 text-base font-semibold text-slate-100">
                {step.title}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{step.description}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-orange-200/15 bg-slate-950/40">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/10 px-4 py-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-200/60">
                    Source input
                  </p>
                  <p className="text-xs text-slate-400">
                    Paste or type Markdown content below.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleConvert}
                  className="bg-orange-500 text-slate-900 hover:bg-orange-400"
                >
                  Convert
                </Button>
              </div>
              <div className="p-4">
                <Textarea
                  value={markdown}
                  onChange={(event) => setMarkdown(event.target.value)}
                  className="min-h-[360px] border-0 bg-transparent text-slate-100 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200/15 bg-slate-950/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-200/60">
                Cleanup options
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-slate-300">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={cleanup.removeExtraBlankLines}
                    onCheckedChange={toggle("removeExtraBlankLines")}
                  />
                  Remove extra blank lines
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={cleanup.stripLinks}
                    onCheckedChange={toggle("stripLinks")}
                  />
                  Strip links but keep text
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={cleanup.removeCodeBlocks}
                    onCheckedChange={toggle("removeCodeBlocks")}
                  />
                  Remove code blocks
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-orange-200/15 bg-slate-950/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-200/60">
                    Output
                  </p>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    Format
                    <select
                      value={activeTab}
                      onChange={(event) => setActiveTab(event.target.value as Tab)}
                      className="rounded-md border border-orange-200/20 bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-100 shadow-none outline-none transition focus:border-orange-300"
                    >
                      <option value="plain">Plain Text</option>
                      <option value="rich">Rich Text</option>
                      <option value="html">HTML</option>
                    </select>
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    className="bg-orange-500/10 text-orange-100 hover:bg-orange-500/20"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="border-orange-200/30 text-orange-100 hover:bg-orange-500/10"
                  >
                    Download
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-orange-200/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100">
                {activeTab === "plain" && (
                  <Textarea
                    value={outputs.plain}
                    onChange={(event) =>
                      setOutputs((prev) => ({
                        ...prev,
                        plain: event.target.value
                      }))
                    }
                    className="min-h-[320px] border-0 bg-transparent text-slate-100 shadow-none focus-visible:ring-0"
                  />
                )}
                {activeTab === "html" && (
                  <Textarea
                    value={outputs.html}
                    onChange={(event) =>
                      setOutputs((prev) => ({
                        ...prev,
                        html: event.target.value
                      }))
                    }
                    className="min-h-[320px] border-0 bg-transparent font-mono text-xs text-orange-100/80 shadow-none focus-visible:ring-0"
                  />
                )}
                {activeTab === "rich" && (
                  <div
                    className="min-h-[320px] rounded-lg border border-orange-200/10 bg-slate-950/50 p-4 text-sm text-slate-100"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(event) =>
                      setOutputs((prev) => ({
                        ...prev,
                        rich: event.currentTarget.innerHTML
                      }))
                    }
                    dangerouslySetInnerHTML={{ __html: outputs.rich }}
                  />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200/15 bg-slate-950/40 px-4 py-3 text-xs text-slate-400">
              {status ??
                "Tip: click Convert after edits to sync the latest Markdown output."}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-orange-200/15 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-200/70">
              Plain text conversion
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-100">
              Clean plain text for SEO copy
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Use Mark2Text as an online Markdown to plain text converter when you need
              readable website copy, meta descriptions, or marketing drafts without
              formatting artifacts.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200/15 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-200/70">
              Client-side security
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-100">
              Private conversion in your browser
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              All Markdown conversion happens locally on your device. No uploads, no
              servers, and no tracking scripts—just fast Markdown cleanup and export.
            </p>
          </div>
        </section>

        <footer className="flex flex-col items-center gap-3 border-t border-orange-200/10 pt-6 text-center text-xs text-slate-400">
          <span>Mark2Text — a minimalist Markdown to text converter.</span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <a className="hover:text-orange-200" href="/privacy">
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a className="hover:text-orange-200" href="/terms">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
