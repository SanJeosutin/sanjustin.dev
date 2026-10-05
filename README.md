# sanjustin.dev

Justin San's personal portfolio built with [Next.js](https://nextjs.org).

## Quick start

```bash
# 1. Clone the repo
git clone https://github.com/SanJeosutin/sanjustin.dev.git
cd sanjustin.dev

# 2. Install dependencies
npm ci

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech requirements

- Node.js 22.12 or newer
- [Node.js](https://nodejs.org/) package manager (npm)

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Run the production server after building |
| `npm test` | Run regression tests with Vitest |
| `npm run test:e2e` | Run browser tests with Playwright |

### End-to-end testing

E2E tests run against a local fixture API on ports 4100 and 3100 — they don't need the live API. First install Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

## Environment variables

Create a `.env` file in the project root:

```
API_BASE_URL=https://apisanjustin.vercel.app
```

This controls where server-side API requests go. The default points to the live API at `apisanjustin.vercel.app`. You can override it in your deployment environment or with a local `.env` file.

The API must be reachable at build time for the homepage to generate correctly. If it's down, previously cached pages are kept instead of being replaced with 404s.

## Production deployment

The site uses server-rendered pages and incremental static regeneration, so you need to run the Next.js server (not serve it as static files):

```bash
npm run build
npm start
```

That's it — the built site will be available on port 3000 by default.
