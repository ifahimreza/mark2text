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
    <main className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-16 h-72 w-72 rounded-full bg-orange-100/50 blur-[160px] dark:bg-orange-500/5" />
        <div className="absolute right-10 top-10 h-80 w-80 rounded-full bg-slate-100/70 blur-[180px] dark:bg-slate-800/40" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1360px] flex-col gap-10">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-300">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900/60">
                mark2text.com
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900/60">
                Client-side only
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900/60">
                Markdown → text
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-base text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                  M2
                </span>
                <span>Mark 2 Text</span>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                Markdown to text, instantly
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
                Convert Markdown into clean text.
                <span className="block">Share it anywhere instantly.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Paste Markdown, run a quick conversion, then refine and copy the
                plain text, rich text, or sanitized HTML output.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  mark2text.com
                </div>
                <Button size="sm" onClick={handleConvert}>
                  Convert
                </Button>
              </div>
              <div className="p-4">
                <Textarea
                  value={markdown}
                  onChange={(event) => setMarkdown(event.target.value)}
                  className="min-h-[360px] border-0 bg-transparent text-slate-900 shadow-none focus-visible:ring-0 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
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
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  Preview
                  <select
                    value={activeTab}
                    onChange={(event) => setActiveTab(event.target.value as Tab)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-none outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="plain">Plain Text</option>
                    <option value="rich">Rich Text</option>
                    <option value="html">HTML</option>
                  </select>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    Download
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100">
                {activeTab === "plain" && (
                  <Textarea
                    value={outputs.plain}
                    onChange={(event) =>
                      setOutputs((prev) => ({
                        ...prev,
                        plain: event.target.value
                      }))
                    }
                    className="min-h-[320px] border-0 bg-transparent text-slate-900 shadow-none focus-visible:ring-0 dark:text-slate-100"
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
                    className="min-h-[320px] border-0 bg-transparent font-mono text-xs text-slate-700 shadow-none focus-visible:ring-0 dark:text-slate-200"
                  />
                )}
                {activeTab === "rich" && (
                  <div
                    className="min-h-[320px] rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
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

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
              {status ?? "Convert once to sync the latest Markdown output."}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              Info
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              What is Markdown?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Markdown is a lightweight syntax for formatting text with simple
              symbols for headings, lists, and emphasis.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              Info
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              How Mark2Text works
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Paste Markdown, run Convert, then edit, copy, or download the
              format you need.
            </p>
          </div>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              Feature
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Clean output
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Remove blank lines, links, and code blocks with toggles.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              Feature
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Editable previews
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Refine plain text, rich text, or HTML before sharing.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              Feature
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Share fast
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Copy or download in one click for any destination.
            </p>
          </div>
        </section>

        <footer className="flex flex-col items-center gap-3 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>Built by Fahim Reza — © 2026 All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <span>x @ifahimreza</span>
            <span aria-hidden="true">·</span>
            <a className="hover:text-slate-600 dark:hover:text-slate-200" href="/privacy">
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a className="hover:text-slate-600 dark:hover:text-slate-200" href="/terms">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
