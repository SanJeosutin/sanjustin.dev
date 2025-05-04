import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar } from 'flowbite-react'
import ThemeToggle from './ThemeToggle'

export default function SiteNav({ theme, setTheme }) {
  const router = useRouter()

  const navItems = [
    { label: 'Home',         href: '/' },
    { label: 'About',        href: '/#about' },
    { label: 'Projects',     href: '/#projects' },
    { label: 'Current Work', href: '/#current-work' },
    { label: 'Contact',      href: '/#contact' },
  ]

  return (
    <Navbar
      fluid
      rounded
      className="
        sticky top-0 z-50
        bg-persian_green-500 text-white
        dark:bg-gray-800 dark:text-gray-300
        shadow
      "
    >
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold">
          San Justin
        </span>
      </Navbar.Brand>

      <div className="flex md:order-2 items-center space-x-2">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        {navItems.map(({ label, href }) => (
          <Navbar.Link
            key={href}
            href={href}
            active={router.asPath === href}
            className="
              text-white dark:text-gray-300
              transform transition-transform duration-200
              hover:scale-105
            "
          >
            {label}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  )
}
