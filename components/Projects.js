import { useState, useRef, useEffect } from 'react'
import { useTrail, animated } from '@react-spring/web'
import ProjectCard from './ProjectCard'

export default function Projects({ repos }) {
  const items = Array.isArray(repos) ? repos.filter(repo => repo && typeof repo === 'object' && !Array.isArray(repo)) : []
  const ITEMS_PER_PAGE = 6
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)

  const [currentPage, setCurrentPage] = useState(1)
  const page = Math.min(currentPage, Math.max(totalPages, 1))
  useEffect(() => {
    setCurrentPage(p => Math.min(p, Math.max(totalPages, 1)))
  }, [totalPages])

  const [show, setShow] = useState(false)
  const sectionRef = useRef(null)

  // IntersectionObserver to trigger show once on first page load
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // slice out only the repos for this page
  const start = (page - 1) * ITEMS_PER_PAGE
  const currentRepos = items.slice(start, start + ITEMS_PER_PAGE)

  // animate only the current page’s cards
  const trail = useTrail(currentRepos.length, {
    from: { opacity: 0, y: 20 },
    to: { opacity: show ? 1 : 0, y: show ? 0 : 20 },
    config: { mass: 1, tension: 200, friction: 20 },
    delay: 200,
  })

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-16 px-4 max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-8 text-charcoal-700 dark:text-white">
        Projects on GitHub
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trail.map((style, i) => (
          <animated.div
            key={currentRepos[i].id}
            style={{
              opacity: style.opacity,
              transform: style.y.to(y => `translateY(${y}px)`),
            }}
          >
            <ProjectCard repo={currentRepos[i]} />
          </animated.div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-8 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={page <= 1}
          className="
      inline-block px-4 py-2 rounded shadow
      bg-persian_green-500 text-white
      hover:bg-persian_green-600
      dark:bg-charcoal-700 dark:text-gray-100 dark:hover:bg-charcoal-600
      transition-colors duration-300
      disabled:opacity-50
    "
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, idx) => {
          const buttonPage = idx + 1
          return (
            <button
              key={buttonPage}
              onClick={() => setCurrentPage(buttonPage)}
              className={`
          inline-block px-4 py-2 rounded shadow
          ${buttonPage === page
                  ? '                bg-persian_green-500 text-white'
                  : '                hover:bg-persian_green-600'}
          dark:bg-charcoal-700 dark:text-gray-100 dark:hover:bg-charcoal-600
          transition-colors duration-300
        `}
            >
              {buttonPage}
            </button>
          )
        })}

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, Math.max(totalPages, 1)))}
          disabled={totalPages === 0 || page >= totalPages}
          className="
      inline-block px-4 py-2 rounded shadow
      bg-persian_green-500 text-white
      hover:bg-persian_green-600
      dark:bg-charcoal-700 dark:text-gray-100 dark:hover:bg-charcoal-600
      transition-colors duration-300
      disabled:opacity-50
    "
        >
          Next
        </button>
      </div>

    </section>
  )
}
