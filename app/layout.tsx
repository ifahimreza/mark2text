import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mark2Text",
  description: "Clean Markdown conversion to plain text, rich text, and HTML."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
