import { useState, useRef, useEffect } from 'react'
import { useTrail, animated } from '@react-spring/web'
import ProjectCard from './ProjectCard'

export default function Projects({ repos }) {
  const [show, setShow] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setShow(true), obs.disconnect()), {threshold:0.2})
    ref.current && obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const trail = useTrail(repos.length, {
    from: { opacity: 0, y:20 },
    to: show ? { opacity:1, y:0 } : {},
    config: { mass:1, tension:200, friction:20 },
    delay: 200,
  })

  return (
    <section id="projects" ref={ref} className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-charcoal-700 dark:text-white">
        Projects on GitHub
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trail.map((s,i)=>(
          <animated.div key={repos[i].id} style={{opacity:s.opacity,transform:s.y.to(y=>`translateY(${y}px)`)}}>
            <ProjectCard repo={repos[i]} />
          </animated.div>
        ))}
      </div>
    </section>
  )
}
