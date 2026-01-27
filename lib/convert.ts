import { toText } from "hast-util-to-text";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

export type CleanupOptions = {
  removeExtraBlankLines: boolean;
  stripLinks: boolean;
  removeCodeBlocks: boolean;
};

const collapseBlankLines = (value: string) =>
  value.replace(/\n{3,}/g, "\n\n").trim();

const stripLinksFromMarkdown = (value: string) =>
  value
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<([^\s>]+)>/g, "$1");

const removeFencedCodeBlocks = (value: string) =>
  value.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "");

export const applyCleanup = (
  markdown: string,
  options: CleanupOptions
): string => {
  let cleaned = markdown;

  if (options.removeCodeBlocks) {
    cleaned = removeFencedCodeBlocks(cleaned);
  }

  if (options.stripLinks) {
    cleaned = stripLinksFromMarkdown(cleaned);
  }

  if (options.removeExtraBlankLines) {
    cleaned = collapseBlankLines(cleaned);
  }

  return cleaned;
};

export const convertMarkdownToHtml = (markdown: string): string => {
  const file = remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .processSync(markdown);

  return String(file);
};

export const markdownToPlainText = (markdown: string): string => {
  const processor = remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize);

  const tree = processor.runSync(processor.parse(markdown));
  const text = toText(tree);

  return text.replace(/\n{3,}/g, "\n\n").trim();
};

export const htmlToMarkdown = (html: string): string => {
  if (!html.trim()) {
    return "";
  }

  const file = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: "-",
      fences: true,
      listItemIndent: "one",
      rule: "-"
    })
    .processSync(html);

  return collapseBlankLines(String(file));
};

export const textToMarkdown = (text: string): string => {
  if (!text.trim()) {
    return "";
  }

  return collapseBlankLines(text.replace(/\r\n/g, "\n"));
};

export const wrapHtmlDocument = (html: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mark2Text Export</title>
  </head>
  <body>
    ${html}
  </body>
</html>`;
