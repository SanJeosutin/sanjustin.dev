// components/Contact.js
import { Button } from 'flowbite-react'

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/SanJeosutin',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/justinsan',
  },
  {
    name: 'Email',
    href: 'mailto:contact@sanjustin.dev',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-charcoal-700 dark:text-white">
        Connect with Me
      </h2>
      <div className="flex flex-wrap gap-4">
        {socials.map(s=>(
          <Button
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            outline
            className="border-persian_green-500 text-persian_green-500 hover:bg-persian_green-50"
          >
            {s.name}
          </Button>
        ))}
      </div>
    </section>
  )
}