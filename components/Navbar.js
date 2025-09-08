import { useState } from 'react'
import { useSpring, animated, config } from '@react-spring/web'
import { useRouter } from 'next/router'
import { Navbar } from 'flowbite-react'
import ThemeToggle from './ThemeToggle'

export default function SiteNav({ theme, setTheme }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const springStyles = useSpring({
    from: { height: 0, opacity: 0, transform: 'scaleY(0.95)' },
    to: {
      height: isOpen ? 'auto' : 0,
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'scaleY(1)' : 'scaleY(0.95)',
    },
    config: { tension: 200, friction: 20 },
  })

  const navItems = [
    { label: 'About', href: '/#about' },
    { label: 'Current Projects', href: '/#current-projects' },
    { label: 'Github Projects', href: '/#projects' },
    { label: 'Notes', href: '/note' },
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
        <Navbar.Toggle
          className="text-white hover:bg-charcoal-600"
          onClick={() => setIsOpen((o) => !o)}
        />
      </div>

      {/* mobile drawer */}
      <animated.ul
        style={springStyles}
        className="w-full overflow-hidden md:hidden origin-top list-none m-0 p-0"
      >
        {navItems.map(({ label, href }) => (
          <div key={href}>
            <Navbar.Link
              href={href}
              active={router.asPath === href}
              className="
                block px-4 py-2 text-white hover:bg-charcoal-600 dark:text-gray-300
                transform transition-transform duration-200 hover:scale-105
              "
            >
              {label}
            </Navbar.Link>
          </div>
        ))}
      </animated.ul>

      <Navbar.Collapse>
        {navItems.map(({ label, href }) => (
          <Navbar.Link
            key={href}
            href={href}
            active={router.asPath === href}
            className="
              text-white hover:bg-charcoal-600 dark:text-gray-300
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
