import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mark2Text | Markdown to Text Converter",
  description:
    "Mark2Text is a minimalist, client-side Markdown to text converter. Convert Markdown to plain text, rich text, or HTML instantly in your browser.",
  keywords: [
    "markdown to text",
    "markdown to plain text",
    "markdown converter",
    "online markdown converter",
    "client-side markdown",
    "markdown to HTML"
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] antialiased">
        {children}
      </body>
    </html>
  );
}
