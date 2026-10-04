import { defineConfig } from 'vitest/config'
import { transformWithEsbuild } from 'vite'

export default defineConfig({
  plugins: [{
    name: 'jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      if (/\/(components|pages)\/.*\.js$/.test(id)) {
        return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' })
      }
    },
  }],
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{js,jsx}'],
    setupFiles: ['tests/setup.js'],
  },
})
