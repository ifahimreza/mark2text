"use client";

import { useMemo, useState } from "react";
import {
  applyCleanup,
  convertMarkdownToHtml,
  htmlToMarkdown,
  markdownToPlainText,
  textToMarkdown,
  type CleanupOptions,
  wrapHtmlDocument
} from "@/lib/convert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

type Tab = "plain" | "rich" | "html";
type Mode = "markdown-to-text" | "to-markdown";
type ReverseInput = "plain" | "rich" | "html";

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

export default function HomePage() {
  const [markdown, setMarkdown] = useState("");
  const [mode, setMode] = useState<Mode>("markdown-to-text");
  const [reverseInput, setReverseInput] = useState<ReverseInput>("plain");
  const [reverseSource, setReverseSource] = useState("");
  const [reverseRichSource, setReverseRichSource] = useState("");
  const [reverseOutput, setReverseOutput] = useState("");
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
    if (mode === "markdown-to-text") {
      setOutputs({ plain: generatedPlain, html: generatedHtml, rich: generatedHtml });
      setStatus("Converted.");
      return;
    }

    const source =
      reverseInput === "rich" ? reverseRichSource : reverseSource;
    const markdownOutput =
      reverseInput === "plain"
        ? textToMarkdown(source)
        : htmlToMarkdown(source);
    setReverseOutput(markdownOutput);
    setStatus("Converted to Markdown.");
  };

  const handleCopy = async () => {
    try {
      if (mode === "to-markdown") {
        await navigator.clipboard.writeText(reverseOutput);
        setStatus("Copied to clipboard.");
        return;
      }

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
    if (mode === "to-markdown") {
      const blob = new Blob([reverseOutput], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "mark2text.md";
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }

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
    <main className="relative min-h-screen bg-[var(--page-bg)] px-4 py-12 text-[var(--page-text)] sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--page-primary)]/15 blur-[180px]" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[440px] w-[440px] rounded-full bg-[var(--page-surface-accent)] blur-[200px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col gap-10">
        <header className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tight sm:text-6xl">
              <span className="title-main logo-text">Mark2Text</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-[var(--page-muted)]">
              A minimalist, client-side Markdown to text converter for fast and secure. Convert Markdown to clean plain text, rich text, or HTML in
              your browser.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--page-muted)]">
              <span className="rounded-full border border-[var(--page-border)] bg-[var(--page-surface)] px-4 py-2 shadow-sm">
                Client-side only
              </span>
              <span className="rounded-full border border-[var(--page-border)] bg-[var(--page-surface)] px-4 py-2 shadow-sm">
                No uploads or tracking
              </span>
              <span className="rounded-full border border-[var(--page-border)] bg-[var(--page-surface)] px-4 py-2 shadow-sm">
                Plain text output
              </span>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--page-border-soft)] px-4 py-3">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-muted-2)]">
                  Source input
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-[var(--page-muted)]">
                    Mode
                    <select
                      value={mode}
                      onChange={(event) =>
                        setMode(event.target.value as Mode)
                      }
                      className="rounded-md border border-[var(--page-border)] bg-[var(--page-surface)] px-3 py-1 text-xs font-medium text-[var(--page-text)] shadow-none outline-none transition focus:border-[var(--page-primary)]"
                    >
                      <option value="markdown-to-text">
                        Markdown → Text/HTML
                      </option>
                      <option value="to-markdown">
                        Text/HTML → Markdown
                      </option>
                    </select>
                  </label>
                  {mode === "to-markdown" && (
                    <label className="flex items-center gap-2 text-xs text-[var(--page-muted)]">
                      Input
                      <select
                        value={reverseInput}
                        onChange={(event) =>
                          setReverseInput(event.target.value as ReverseInput)
                        }
                        className="rounded-md border border-[var(--page-border)] bg-[var(--page-surface)] px-3 py-1 text-xs font-medium text-[var(--page-text)] shadow-none outline-none transition focus:border-[var(--page-primary)]"
                      >
                        <option value="plain">Plain Text</option>
                        <option value="rich">Rich Text</option>
                        <option value="html">HTML</option>
                      </select>
                    </label>
                  )}
                  <Button
                    size="sm"
                    onClick={handleConvert}
                    className="bg-[var(--page-primary)] text-white hover:bg-[var(--page-primary-hover)]"
                  >
                    Convert
                  </Button>
                </div>
              </div>
              <div className="p-4">
                {mode === "markdown-to-text" && (
                  <Textarea
                    value={markdown}
                    onChange={(event) => setMarkdown(event.target.value)}
                    placeholder="Paste your Markdown here..."
                    className="min-h-[360px] border-0 bg-transparent text-[var(--page-text)] shadow-none focus-visible:ring-0"
                  />
                )}
                {mode === "to-markdown" && reverseInput !== "rich" && (
                  <Textarea
                    value={reverseSource}
                    onChange={(event) => setReverseSource(event.target.value)}
                    placeholder={
                      reverseInput === "plain"
                        ? "Paste your plain text here..."
                        : "Paste your HTML here..."
                    }
                    className="min-h-[360px] border-0 bg-transparent text-[var(--page-text)] shadow-none focus-visible:ring-0"
                  />
                )}
                {mode === "to-markdown" && reverseInput === "rich" && (
                  <div
                    className="rich-output min-h-[360px] rounded-lg border border-[var(--page-border-soft)] bg-[var(--page-surface)] p-4 text-sm text-[var(--page-text)]"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Paste or type rich text here..."
                    onInput={(event) =>
                      setReverseRichSource(event.currentTarget.innerHTML)
                    }
                    dangerouslySetInnerHTML={{ __html: reverseRichSource }}
                  />
                )}
              </div>
            </div>

            {mode === "markdown-to-text" && (
              <div className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-4 shadow-sm">
                <div className="flex flex-wrap gap-6 text-sm text-[var(--page-muted)]">
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
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {mode === "markdown-to-text" ? (
                  <label className="flex items-center gap-2 text-sm text-[var(--page-muted)]">
                    Output format
                    <select
                      value={activeTab}
                      onChange={(event) =>
                        setActiveTab(event.target.value as Tab)
                      }
                      className="rounded-md border border-[var(--page-border)] bg-[var(--page-surface)] px-3 py-1 text-xs font-medium text-[var(--page-text)] shadow-none outline-none transition focus:border-[var(--page-primary)]"
                    >
                      <option value="plain">Plain Text</option>
                      <option value="rich">Rich Text</option>
                      <option value="html">HTML</option>
                    </select>
                  </label>
                ) : (
                  <span className="text-sm font-medium text-[var(--page-muted)]">
                    Markdown output
                  </span>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    className="bg-[var(--page-surface-accent)] text-[var(--page-text)] hover:bg-[var(--page-surface-accent-hover)]"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="group flex items-center gap-2 border-[var(--page-border)] bg-[var(--page-surface-accent-2)] text-[var(--page-text)] transition hover:-translate-y-0.5 hover:border-[var(--page-border)] hover:bg-[var(--page-surface-accent)] focus-visible:ring-[var(--page-ring)]"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 transition group-hover:-translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v12m0 0 4-4m-4 4-4-4m-6 7h16"
                      />
                    </svg>
                    Download
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[var(--page-border-soft)] bg-[var(--page-surface-muted)] px-4 py-3 text-sm text-[var(--page-text)]">
                {mode === "markdown-to-text" && (
                  <>
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
                        className="min-h-[320px] border-0 bg-transparent text-[var(--page-text)] shadow-none focus-visible:ring-0"
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
                        className="min-h-[320px] border-0 bg-transparent font-mono text-xs text-[var(--page-muted)] shadow-none focus-visible:ring-0"
                      />
                    )}
                    {activeTab === "rich" && (
                      <div
                        className="rich-output min-h-[320px] rounded-lg border border-[var(--page-border-soft)] bg-[var(--page-surface)] p-4 text-sm text-[var(--page-text)]"
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
                  </>
                )}
                {mode === "to-markdown" && (
                  <Textarea
                    value={reverseOutput}
                    onChange={(event) => setReverseOutput(event.target.value)}
                    placeholder="Markdown output will appear here."
                    className="min-h-[320px] border-0 bg-transparent font-mono text-xs text-[var(--page-muted)] shadow-none focus-visible:ring-0"
                  />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] px-4 py-3 text-xs text-[var(--page-muted-2)] shadow-sm">
              {status ?? "Convert once to sync the latest Markdown output."}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--page-muted-2)]">
              Plain text conversion
            </p>
            <h2 className="mt-3 text-lg font-semibold text-[var(--page-text)]">
              Clean plain text for SEO copy
            </h2>
            <p className="mt-2 text-sm text-[var(--page-muted)]">
              Use Mark2Text as an online Markdown to plain text converter when you need
              readable website copy, meta descriptions, or marketing drafts without
              formatting artifacts.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--page-muted-2)]">
              Client-side security
            </p>
            <h2 className="mt-3 text-lg font-semibold text-[var(--page-text)]">
              Private conversion in your browser
            </h2>
            <p className="mt-2 text-sm text-[var(--page-muted)]">
              All Markdown conversion happens locally on your device. No uploads, no
              servers, and no tracking scripts—just fast Markdown cleanup and export.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--page-muted-2)]">
            AI-ready workflow note
          </p>
          <h2 className="mt-3 text-lg font-semibold text-[var(--page-text)]">
            Why teams prep AI briefs in Markdown
          </h2>
          <p className="mt-2 text-sm text-[var(--page-muted)]">
            Markdown keeps AI prompts readable for humans, easy to diff in version control,
            and structured enough to guide LLMs with headings, lists, and code blocks.
            Mark2Text helps you strip that formatting when you need plain copy for docs,
            emails, or product summaries.
          </p>
        </section>

        <footer className="flex flex-col items-center gap-3 border-t border-[var(--page-border-soft)] pt-6 text-center text-xs text-[var(--page-muted-2)]">
          <span>Mark2Text — a minimalist Markdown to text converter.</span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[var(--page-muted-2)]">
            <a className="hover:text-[var(--page-primary)]" href="/privacy">
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a className="hover:text-[var(--page-primary)]" href="/terms">
              Terms
            </a>
          </div>
          <span>
            Made with tea and care by Fahim Reza ·{" "}
            <a
              className="hover:text-[var(--page-primary)]"
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
