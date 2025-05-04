import Link from 'next/link'
import { Card } from 'flowbite-react'
import { currentProjects } from '../data/currentProjects'

export default function CurrentlyWorkingOn() {
  return (
    <section
      id="current-work"
      className="py-16 px-4 max-w-6xl mx-auto transition-colors duration-500 ease-in-out"
    >
      <h2 className="text-3xl font-bold mb-8 text-charcoal-700 dark:text-white">
        Currently Working On
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {currentProjects.map((proj) => (
          <Card key={proj.slug} className="flex flex-col h-full">
            <h5 className="text-xl font-semibold mb-2">{proj.name}</h5>
            <p className="flex-1 text-gray-600 dark:text-gray-300 mb-4">
              {proj.shortDescription}
            </p>
            <div className="mt-auto flex space-x-4">
              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block px-4 py-2 rounded
                  bg-sandy_brown-500 text-white
                  hover:bg-sandy_brown-600
                  transition-colors duration-300
                "
              >
                View on GitHub
              </a>
              <Link href={`/work/${proj.slug}`} legacyBehavior>
                <a
                  className="
                    inline-block px-4 py-2 rounded
                    bg-persian_green-500 text-white
                    hover:bg-persian_green-600
                    transition-colors duration-300
                  "
                >
                  Learn More
                </a>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
