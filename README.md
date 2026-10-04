# sanjustin.dev

Justin San's personal portfolio, built with Next.js.

Install dependencies with `npm ci`, then run `npm run dev` for development.
Use Node.js 22.12 or newer for the test tooling. Run `npm test` for regression checks. For browser checks, install Chromium with
`npx playwright install chromium`, then run `npm run test:e2e`. The browser suite
builds and starts the production app against a local fixture API on ports 4100
and 3100; it does not require the live API.

For production, run `npm run build` followed by `npm start`. The site uses
server-rendered pages and incremental static regeneration, so it requires a
Next.js server rather than a static export.

Server-side API requests default to `https://apisanjustin.vercel.app`.
Set `API_BASE_URL` in `.env` or the deployment environment to use another API
origin. The API must be reachable at build time for the homepage; unavailable
note/project path lists can be generated on demand. Temporary detail API
failures preserve previously generated pages instead of caching a 404.
