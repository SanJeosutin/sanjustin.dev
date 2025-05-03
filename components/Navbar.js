import { Navbar } from 'flowbite-react'
import ThemeToggle from './ThemeToggle'

export default function SiteNav({ theme, setTheme }) {
  return (
    <Navbar
      fluid
      rounded
      className="
      transition-colors duration-500 ease-in-out
      bg-light-sea-green-300 text-celeste-700    /* light theme */
        dark:bg-gray-800 dark:text-gray-300    /* dark theme */
        shadow
      "
    >
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold">
          Justin San
        </span>
      </Navbar.Brand>

      <div className="flex md:order-2 items-center space-x-2 ">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        {['projects','about','contact'].map(id => (
          <Navbar.Link
            key={id}
            href={`#${id}`}
            className="transition-colors duration-500 ease-in-out text-white dark:text-gray-300"
          >
            {id.charAt(0).toUpperCase()+id.slice(1)}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  )
}
