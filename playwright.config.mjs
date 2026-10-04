import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3100', headless: true },
  webServer: [
    { command: 'node tests/fixture-api.mjs', url: 'http://127.0.0.1:4100/api/projects', timeout: 10000 },
    {
      command: 'npm run build && npm start -- --hostname 127.0.0.1 --port 3100',
      env: { API_BASE_URL: 'http://127.0.0.1:4100', NEXT_TELEMETRY_DISABLED: '1' },
      url: 'http://127.0.0.1:3100',
      timeout: 120000,
    },
  ],
})
