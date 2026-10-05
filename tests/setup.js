import { afterEach, beforeEach, vi } from 'vitest'
import { cloneElement } from 'react'
import { JSDOM } from 'jsdom'
import { cleanup } from '@testing-library/react'

vi.mock('next/router', () => ({ useRouter: () => ({ asPath: '/', back: vi.fn() }) }))
vi.mock('next/link', () => ({ default: ({ children, href }) => cloneElement(children, { href }) }))
vi.mock('react-shadow', () => ({ default: { div: 'div' } }))

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserver)

// Node 26 exposes its own storage globals; use an isolated browser storage realm.
const storageWindow = new JSDOM('', { url: 'http://localhost' }).window
beforeEach(() => {
  vi.stubGlobal('localStorage', storageWindow.localStorage)
  vi.stubGlobal('Storage', storageWindow.Storage)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.stubGlobal('IntersectionObserver', IntersectionObserver)
  storageWindow.localStorage.clear()
  document.documentElement.className = ''
})
