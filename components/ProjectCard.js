import { useSpring, animated } from '@react-spring/web'
import { Card } from 'flowbite-react'
import { StarIcon } from '@heroicons/react/24/solid'

export default function ProjectCard({ repo }) {
  const [spr, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 15 },
  }))

  return (
    <animated.div
      style={{ transform: spr.scale.to(s => `scale(${s})`) }}
      onMouseEnter={() => api.start({ scale: 1.03 })}
      onMouseLeave={() => api.start({ scale: 1 })}
      className="h-full"
    >
      <Card className="flex flex-col h-full border-2 border-persian_green-300">
        <div className="flex items-start justify-between gap-3">
          <h5 className="text-xl font-semibold mb-2">{repo.name}</h5>
          {repo.featured ? (
            <span className="rounded-full bg-persian_green-100 px-3 py-1 text-xs font-semibold text-persian_green-700 dark:bg-charcoal-700 dark:text-persian_green-200">
              Featured
            </span>
          ) : null}
        </div>
        <p className="flex-1 text-gray-600 dark:text-gray-300">
          {repo.description || 'No description provided.'}
        </p>
        {repo.showcaseNote ? (
          <p className="mt-3 rounded-lg bg-sandy_brown-50 p-3 text-sm text-charcoal-700 dark:bg-charcoal-700 dark:text-gray-100">
            {repo.showcaseNote}
          </p>
        ) : null}
        <div className="mt-4 flex items-center justify-between">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-block px-4 py-2 rounded shadow
              bg-sandy_brown-600 text-white
              hover:bg-sandy_brown-400
              dark:bg-charcoal-700 dark:text-gray-100 dark:hover:bg-charcoal-600
              transition-colors duration-300
            "
          >
            View Repo
          </a>
          <div className="flex items-center text-sm text-yellow-500">
            <StarIcon className="h-5 w-5 mr-1" />
            {repo.stargazers_count}
          </div>
        </div>
      </Card>
    </animated.div>
  )
}
