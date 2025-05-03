// components/Contact.js
import { Button } from 'flowbite-react'

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/YOUR_GITHUB_USERNAME',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/YOUR_LINKEDIN_USERNAME',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/YOUR_TWITTER_HANDLE',
  },
  {
    name: 'Email',
    href: 'mailto:YOUR_EMAIL_ADDRESS',
  },
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-16 px-4 max-w-6xl mx-auto transition-colors duration-500 ease-in-out"
    >
      <h2
        className="
          text-3xl font-bold mb-8
          text-light-sea-green-700 dark:text-white
        "
      >
        Connect with Me
      </h2>

      <div className="flex flex-wrap gap-4">
        {socials.map((s) => (
          <Button
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            outline={true}
            className="border-light-sea-green-500 text-light-sea-green-500 hover:bg-light-sea-green-50 dark:border-gray-400 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {s.name}
          </Button>
        ))}
      </div>
    </section>
  )
}
