import { useEffect, useState } from 'react'
import '../styles/globals.css'
import 'flowbite/dist/flowbite.css'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('light')

  const [themeReady, setThemeReady] = useState(false)

  // On mount, read from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light') setTheme(saved)
    } catch {
      // Storage may be disabled; theme switching still works in memory.
    }
    setThemeReady(true)
  }, [])

  // Whenever theme changes, update <html> class and localStorage
  useEffect(() => {
    if (!themeReady) return
    const other = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.remove(other)
    document.documentElement.classList.add(theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Persist when storage is available.
    }
  }, [theme, themeReady])

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-500 ease-in-out">
      <main className="flex-1">
        <Component {...pageProps} theme={theme} setTheme={setTheme} />
      </main>
      <Footer />
    </div>
  )
}
