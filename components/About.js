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
      A Melbourne-based web developer, photographer, and nature enthusiast with a Bachelor of Computer Science from Swinburne University of Technology. Combines creative problem-solving with elegant code — whether refining an old projects or contributing to real-world projects.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
      Achieved High Distinctions in Advanced Web Development (COS30020), Creating Web Applications (COS10011), and Software Engineering Project A & B (SWE40001 & SWE40002) during the degree program.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300">
      Demonstrates a strong commitment to mastering modern web technologies—including PHP, HTML5, CSS3, JavaScript, MySQL, and AWS—and to developing robust, user-focused applications. When not coding, likely to be found behind the camera, exploring Melbourne's parks, or engaging with the latest indie games.
      </p>
    </animated.section>
  )
}

