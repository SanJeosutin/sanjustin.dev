import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer className="mt-auto py-6 bg-charcoal-100 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* copyright */}
        <p className="text-sm text-charcoal-700 dark:text-gray-400">
          © {new Date().getFullYear()} Justin San. All rights reserved.
        </p>

        {/* social / important links */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/SanJeosutin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-charcoal-700 dark:text-gray-400 hover:text-persian_green-500 dark:hover:text-persian_green-400 transition-colors duration-200 text-sm"
          >
             <FaGithub className="inline-block w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/justinsan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-charcoal-700 dark:text-gray-400 hover:text-persian_green-500 dark:hover:text-persian_green-400 transition-colors duration-200 text-sm"
          >
            <FaLinkedin className="inline-block w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/sanjeosutin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-charcoal-700 dark:text-gray-400 hover:text-persian_green-500 dark:hover:text-persian_green-400 transition-colors duration-200 text-sm"
          >
            <FaInstagram className="inline-block w-5 h-5" />
          </a>
          <a
            href="mailto:contact@sanjustin.dev"
            className="text-charcoal-700 dark:text-gray-400 hover:text-persian_green-500 dark:hover:text-persian_green-400 transition-colors duration-200 text-sm"
          >
             <HiOutlineMail className="inline-block w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

