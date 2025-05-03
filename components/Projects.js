import { useState, useRef, useEffect } from 'react'
import { useTrail, animated } from '@react-spring/web'
import ProjectCard from './ProjectCard'

export default function Projects({ repos }) {
  const [trigger, setTrigger] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrigger(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const trail = useTrail(repos.length, {
    opacity: trigger ? 1 : 0,
    y: trigger ? 0 : 20,
    from: { opacity: 0, y: 20 },
    config: { mass: 1, tension: 200, friction: 20 },
    delay: 200,
  })

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-16 px-4 max-w-6xl mx-auto transition-colors duration-500 ease-in-out"
    >
      <h2
        className="
          text-3xl font-bold mb-8
          text-celeste-800        /* light only */
          dark:text-white         /* dark only */
          transition-colors duration-500 ease-in-out"
      >
        Projects on GitHub
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trail.map((style, i) => (
          <animated.div
            key={repos[i].id}
            style={{
              opacity: style.opacity,
              transform: style.y.to(y => `translateY(${y}px)`),
            }}
          >
            <ProjectCard repo={repos[i]} />
          </animated.div>
        ))}
      </div>
    </section>
  )
}
