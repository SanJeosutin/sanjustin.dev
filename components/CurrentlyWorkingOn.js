// components/CurrentlyWorkingOn.js
import { useState, useRef, useEffect } from 'react'
import { useTrail, animated, to, useSpring } from '@react-spring/web'
import { Card } from 'flowbite-react'
import Link from 'next/link'
import { currentProjects } from '../data/currentProjects'

function AnimatedWorkCard({ project, animationStyle }) {
  // Hover spring for scale
  const [hoverSpr, hoverApi] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 15 },
  }))

  return (
    <animated.div
      // Combine the trail's y + hover scale into one transform
      style={{
        opacity: animationStyle.opacity,
        transform: to(
          [animationStyle.y, hoverSpr.scale],
          (y, s) => `translateY(${y}px) scale(${s})`
        ),
      }}
      onMouseEnter={() => hoverApi.start({ scale: 1.03 })}
      onMouseLeave={() => hoverApi.start({ scale: 1 })}
      className="h-full"
    >
      <Card className="flex flex-col h-full">
        <h5 className="text-xl font-semibold mb-2">{project.name}</h5>
        <p className="flex-1 text-gray-600 dark:text-gray-300 mb-4">
          {project.shortDescription}
        </p>
        <div className="mt-auto flex space-x-4">
          <a
            href={project.githubUrl}
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
          <Link href={`/work/${project.slug}`} legacyBehavior>
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
    </animated.div>
  )
}

export default function CurrentlyWorkingOn() {
  const [show, setShow] = useState(false)
  const sectionRef = useRef(null)

  // Trigger show when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Trail for entry animation
  const trail = useTrail(currentProjects.length, {
    from: { opacity: 0, y: 20 },
    to: { opacity: show ? 1 : 0, y: show ? 0 : 20 },
    config: { mass: 1, tension: 200, friction: 20 },
    delay: 200,
  })

  return (
    <section
      id="current-work"
      ref={sectionRef}
      className="py-16 px-4 max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-8 text-charcoal-700 dark:text-white">
        Currently Working On
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {trail.map((style, i) => (
          <AnimatedWorkCard
            key={currentProjects[i].slug}
            project={currentProjects[i]}
            animationStyle={style}
          />
        ))}
      </div>
    </section>
  )
}
