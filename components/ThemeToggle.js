import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle Theme"
      className="p-2 rounded  hover:bg-charcoal-600 dark:hover:bg-gray-700 transition"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-6 w-6 text-yellow-400" />
      ) : (
        <MoonIcon className="h-6 w-6 text-celeste-700" />
      )}
    </button>
  )
}