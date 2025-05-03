import { useRef, useEffect } from 'react'
import {
  useTrail,
  useSpring,
  animated,
  config as springConfig,
} from '@react-spring/web'
import Image from 'next/image'
import { Button } from 'flowbite-react'
const BANNERS = [
  '/images/banner1.jpg',
  '/images/banner2.jpg',
  '/images/banner3.jpg',
]

const headingText = "Hi, I'm Justin"
const subtitleText = "A Software Developer that something something here"

export default function Hero() {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let idx = 0
    const total = BANNERS.length
    const id = setInterval(() => {
      idx = (idx + 1) % total
      el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' })
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const headingChars = Array.from(headingText)
  const subtitleWords = subtitleText.split(' ')

  // fly-in from left for heading
  const headingTrail = useTrail(headingChars.length, {
    from: { opacity: 0, transform: 'translateX(-100px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: springConfig.stiff,
    delay: 200,
  })

  // fly-in from right for subtitle
  const subtitleTrail = useTrail(subtitleWords.length, {
    from: { opacity: 0, transform: 'translateX(100px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: springConfig.stiff,
    delay: 400,
  })

  // delay = subtitle delay + (per-word stagger ≈ 50ms * words.length)
  const buttonSpring = useSpring({
    from:   { opacity: 0, transform: 'translateY(10px)' },
    to:     { opacity: 1, transform: 'translateY(0px)' },
    config: springConfig.gentle,
    delay:  600 + subtitleWords.length * 126,
  })


  return (
    <section className="relative h-screen overflow-hidden">
      {/* Banner strip */}
      <div
        ref={scrollRef}
        className="absolute inset-0 flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {BANNERS.map((src, i) => (
          <div key={i} className="relative min-w-full h-full snap-start">
            <Image
              src={src}
              alt={`Banner ${i + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Tint + blur */}
      <div
        className="
          absolute inset-0
          bg-light-sea-green-500/30 dark:bg-black/60
          backdrop-blur-md
          transition-colors duration-500 ease-in-out
        "
      />

      {/* Animated text overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1
          className="
            flex flex-wrap justify-center
            text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]
            transition-colors duration-500 ease-in-out
          "
        >
          {headingTrail.map((style, i) => (
            <animated.span key={i} style={style}>
              {headingChars[i]}
            </animated.span>
          ))}
        </h1>
        <p
          className="
            flex flex-wrap justify-center
            text-lg sm:text-xl text-white max-w-2xl mb-6
            drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]
            transition-colors duration-500 ease-in-out
          "
        >
          {subtitleTrail.map((style, i) => (
            <animated.span
              key={i}
              style={style}
              className="inline-block mr-1"
            >
              {subtitleWords[i]}
            </animated.span>
          ))}
        </p>

        {/* learn more */}
        <animated.div style={buttonSpring}>
          <Button
            size="lg"
            className="
              mt-2 drop-shadow-lg
              bg-robin-egg-blue-500 dark:bg-gray-700
              transition-colors duration-500 ease-in-out
            "
            onClick={() => {
              document
                .getElementById('about')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Learn More
          </Button>
        </animated.div>
      </div>
    </section>
  )
}
