import { useEffect, useState } from 'react'
import '../styles/globals.css'
import 'flowbite/dist/flowbite.css'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('light')

  // On mount, read from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved)
      document.documentElement.classList.add(saved)
    }
  }, [])

  // Whenever theme changes, update <html> class and localStorage
  useEffect(() => {
    const other = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.remove(other)
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-500 ease-in-out">
      {/* Make this take up all remaining space */}
      <main className="flex-1">
        <Component {...pageProps} theme={theme} setTheme={setTheme} />
      </main>
      <Footer />
    </div>
  )
}
