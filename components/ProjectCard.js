import { useSpring, animated } from '@react-spring/web'
import { Card, Button } from 'flowbite-react'
import { StarIcon } from '@heroicons/react/24/solid'

export default function ProjectCard({ repo }) {
  const [hoverProps, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 15 },
  }))

  return (
    <animated.div
      style={{
        transform: hoverProps.scale.to(s => `scale(${s})`)
      }}
      onMouseEnter={() => api.start({ scale: 1.03 })}
      onMouseLeave={() => api.start({ scale: 1 })}
      className="h-full"
    >
      <Card
        className="
          flex flex-col h-full
          border-2 bg-tiffany-blue-200        /* light only */
          dark:border-none                      /* dark only */
          transition-colors duration-500 ease-in-out"
      >
        <h5 className="text-xl font-semibold mb-2 text-celeste-600">{repo.name}</h5>
        <p className="flex-1 text-celeste-100 dark:text-gray-300">
          {repo.description || 'No description provided.'}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <Button
            href={repo.html_url}
            target="_blank"
            rel="noopener"
            size="sm"
            className="
              bg-tiffany-blue-500 text-white        /* light only */
              hover:bg-tiffany-blue-600
              dark:bg-gray-600                        /* dark only */
              transition-colors duration-500 ease-in-out"
          >
            View Repo
          </Button>
          <div className="flex items-center text-sm text-yellow-500">
            <StarIcon className="h-5 w-5 mr-1" />
            {repo.stargazers_count}
          </div>
        </div>
      </Card>
    </animated.div>
  )
}
