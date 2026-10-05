import { useState, useRef, useEffect } from 'react'
import { useTrail, animated } from '@react-spring/web'
import ProjectCard from './ProjectCard'

export default function Projects({ repos }) {
  const items = Array.isArray(repos) ? repos.filter(repo => repo && typeof repo === 'object' && !Array.isArray(repo)) : []
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

  const trail = useTrail(items.length, {
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
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-persian_green-600 dark:text-persian_green-300">
          Curated from GitHub
        </p>
        <h2 className="text-3xl font-bold text-charcoal-700 dark:text-white">
          Selected Projects on GitHub
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          A hand-picked set of repositories controlled by the GitHub showcase settings file.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {trail.map((style, i) => (
          <animated.div
            key={items[i].id ?? items[i].name ?? i}
            style={{
              opacity: style.opacity,
              transform: style.y.to(y => `translateY(${y}px)`),
            }}
          >
            <ProjectCard repo={items[i]} />
          </animated.div>
        ))}
      </div>
    </section>
  )
}
