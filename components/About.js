import { useRef, useState, useEffect } from 'react'
import { animated, useSpring, config as springConfig } from '@react-spring/web'

export default function About() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  // set `inView` once the section is ≥20% on screen
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // spring for fade + slide‐up
  const style = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: springConfig.molasses,  
    delay: 400,
  })

  return (
    <animated.section
      ref={ref}
      id="about"
      style={style}
      className="
        py-16 px-4 max-w-6xl mx-auto
        transition-colors duration-500 ease-in-out
      "
    >
      <h2 className="text-3xl font-bold mb-8 text-charcoal-700 dark:text-white">
        About Me
      </h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
      I’m a Melbourne-based full-stack developer who builds practical software that makes everyday work easier. My projects range from internal dashboards and inventory tools to barcode workflows, document automation, and customer-facing websites.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
      I hold a Bachelor of Computer Science from Swinburne University of Technology, where I earned High Distinctions in web development and software engineering projects. I work with Python, Node.js, React, Next.js, PHP, SQL databases, and AWS, choosing technologies to suit the problem.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300">
      Whether freelancing or working alongside an operations team, I take projects from initial requirements through deployment
      </p>
    </animated.section>
  )
}

