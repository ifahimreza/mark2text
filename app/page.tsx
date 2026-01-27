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
  const [markdown, setMarkdown] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("plain");
  const [cleanup, setCleanup] = useState<CleanupOptions>(DEFAULT_CLEANUP);
  const [outputs, setOutputs] = useState<OutputState>({
    plain: "",
    html: "",
    rich: ""
  });
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
    <main className="relative min-h-screen bg-[#f5f9ff] px-4 py-12 text-[#00284d] sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#0285ff]/15 blur-[180px]" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[440px] w-[440px] rounded-full bg-[#e5f3ff] blur-[200px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col gap-10">
        <header className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="title-main">Mark2Text</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-[#355070]">
              A minimalist, client-side Markdown to text converter for fast, secure, and
              SEO-ready copy. Convert Markdown to clean plain text, rich text, or HTML in
              your browser.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#355070]">
              <span className="rounded-full border border-[#c9e2ff] bg-white px-4 py-2 shadow-sm">
                Client-side only
              </span>
              <span className="rounded-full border border-[#c9e2ff] bg-white px-4 py-2 shadow-sm">
                No uploads or tracking
              </span>
              <span className="rounded-full border border-[#c9e2ff] bg-white px-4 py-2 shadow-sm">
                Plain text output
              </span>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[#c9e2ff] bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-[#dbeeff] px-4 py-3">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#5a7190]">
                  Source input
                </span>
                <Button
                  size="sm"
                  onClick={handleConvert}
                  className="bg-[#0285ff] text-white hover:bg-[#0270d6]"
                >
                  Convert
                </Button>
              </div>
              <div className="p-4">
                <Textarea
                  value={markdown}
                  onChange={(event) => setMarkdown(event.target.value)}
                  placeholder="Paste your Markdown here..."
                  className="min-h-[360px] border-0 bg-transparent text-[#00284d] shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#c9e2ff] bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-6 text-sm text-[#355070]">
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
            <div className="rounded-2xl border border-[#c9e2ff] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-[#355070]">
                  Output format
                  <select
                    value={activeTab}
                    onChange={(event) => setActiveTab(event.target.value as Tab)}
                    className="rounded-md border border-[#c9e2ff] bg-white px-3 py-1 text-xs font-medium text-[#00284d] shadow-none outline-none transition focus:border-[#0285ff]"
                  >
                    <option value="plain">Plain Text</option>
                    <option value="rich">Rich Text</option>
                    <option value="html">HTML</option>
                  </select>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    className="bg-[#e5f3ff] text-[#00284d] hover:bg-[#d4ebff]"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="border-[#c9e2ff] text-[#00284d] hover:bg-[#e5f3ff]"
                  >
                    Download
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#dbeeff] bg-[#f8fbff] px-4 py-3 text-sm text-[#00284d]">
                {activeTab === "plain" && (
                  <Textarea
                    value={outputs.plain}
                    onChange={(event) =>
                      setOutputs((prev) => ({
                        ...prev,
                        plain: event.target.value
                      }))
                    }
                    placeholder="Plain text output will appear here."
                    className="min-h-[320px] border-0 bg-transparent text-[#00284d] shadow-none focus-visible:ring-0"
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
                    placeholder="HTML output will appear here."
                    className="min-h-[320px] border-0 bg-transparent font-mono text-xs text-[#355070] shadow-none focus-visible:ring-0"
                  />
                )}
                {activeTab === "rich" && (
                  <div
                    className="rich-output min-h-[320px] rounded-lg border border-[#dbeeff] bg-white p-4 text-sm text-[#00284d]"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Rich text output will appear here."
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

            <div className="rounded-2xl border border-[#c9e2ff] bg-white px-4 py-3 text-xs text-[#5a7190] shadow-sm">
              {status ?? "Convert once to sync the latest Markdown output."}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#c9e2ff] bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5a7190]">
              Plain text conversion
            </p>
            <h2 className="mt-3 text-lg font-semibold text-[#00284d]">
              Clean plain text for SEO copy
            </h2>
            <p className="mt-2 text-sm text-[#355070]">
              Use Mark2Text as an online Markdown to plain text converter when you need
              readable website copy, meta descriptions, or marketing drafts without
              formatting artifacts.
            </p>
          </div>
          <div className="rounded-2xl border border-[#c9e2ff] bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5a7190]">
              Client-side security
            </p>
            <h2 className="mt-3 text-lg font-semibold text-[#00284d]">
              Private conversion in your browser
            </h2>
            <p className="mt-2 text-sm text-[#355070]">
              All Markdown conversion happens locally on your device. No uploads, no
              servers, and no tracking scripts—just fast Markdown cleanup and export.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#c9e2ff] bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a7190]">
            AI-ready workflow note
          </p>
          <h2 className="mt-3 text-lg font-semibold text-[#00284d]">
            Why teams prep AI briefs in Markdown
          </h2>
          <p className="mt-2 text-sm text-[#355070]">
            Markdown keeps AI prompts readable for humans, easy to diff in version control,
            and structured enough to guide LLMs with headings, lists, and code blocks.
            Mark2Text helps you strip that formatting when you need plain copy for docs,
            emails, or product summaries.
          </p>
        </section>

        <footer className="flex flex-col items-center gap-3 border-t border-[#dbeeff] pt-6 text-center text-xs text-[#5a7190]">
          <span>Mark2Text — a minimalist Markdown to text converter.</span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[#5a7190]">
            <a className="hover:text-[#0285ff]" href="/privacy">
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a className="hover:text-[#0285ff]" href="/terms">
              Terms
            </a>
          </div>
          <span>
            Credits: Fahim Reza ·{" "}
            <a
              className="hover:text-[#0285ff]"
              href="https://x.com/ifahimreza"
              rel="noreferrer"
              target="_blank"
            >
              @ifahimreza
            </a>
          </span>
        </footer>
      </div>
    </main>
  );
}
