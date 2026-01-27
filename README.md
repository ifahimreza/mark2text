# Mark2Text

Mark2Text is a minimalist, client-side Markdown to text converter. It turns Markdown
into clean plain text, rich text, or sanitized HTML in the browser—no uploads, no
servers, and no tracking.

## Features

- **Client-side conversion** for privacy and speed.
- **Plain, rich, and HTML outputs** with one click.
- **Cleanup tools** to remove blank lines, strip links, or drop code blocks.
- **Downloadable exports** for quick sharing.

## Getting started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

### Build and start

```bash
npm run build
npm run start
```

## Project structure

```
app/            # Next.js App Router routes and UI
components/     # Reusable UI components
lib/            # Markdown conversion utilities
```

## Security & privacy

Mark2Text runs entirely in the browser. Markdown content never leaves your device,
and HTML output is sanitized before rendering.

## Contributing

We welcome contributions! Here’s a simple workflow:

1. Fork the repo and create a feature branch.
2. Make your changes with clear, focused commits.
3. Run any relevant checks (lint/tests if added).
4. Open a pull request with a short summary and screenshots for UI changes.

If you are not sure where to start, open an issue with your idea or a bug report.

## License

See [LICENSE](LICENSE).
