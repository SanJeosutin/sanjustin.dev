import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteNav from '../../components/Navbar'
import { useTrail, animated, config as springConfig } from '@react-spring/web'
import { useRouter } from 'next/router'

export default function Notes({ notes, theme, setTheme }) {
  const router = useRouter()

  // flag to trigger the animation once on mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // create a trail animation for each note entry
  const trail = useTrail(notes.length, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
    config: springConfig.gentle,
    delay: 200,
  })

  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />
      {/* Back button */}
      <div className="py-4 px-4 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="
            inline-block mb-6 text-persian_green-500 dark:text-saffron-400
            hover:underline transition-colors duration-200
          "
        >
          ← Back
        </button>
      </div>
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-charcoal-700 dark:text-white">
          Notes
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {trail.map((style, i) => {
            const { slug, title, date } = notes[i]
            return (
              <animated.div
                key={slug}
                style={style}
                className="w-full"
              >
                <Link href={`/note/${slug}`} legacyBehavior>
                  <a
                    className="
                      block p-6 border-2 border-persian_green-300 rounded shadow
                      hover:border-persian_green-500 transition-colors duration-200
                      bg-white dark:bg-gray-800
                    "
                  >
                    <h2 className="text-2xl font-semibold text-charcoal-700 dark:text-white">
                      {title}
                    </h2>
                    <time className="text-gray-500 dark:text-gray-400">{date}</time>
                  </a>
                </Link>
              </animated.div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.API_BASE_URL
      : `https://${process.env.VERCEL_URL}`

  const res = await fetch(`${baseUrl}/api/notes`)
  if (!res.ok) {
    console.error('Notes fetch failed:', res.status, await res.text())
    return { notFound: true }
  }
  const notes = await res.json()

  return {
    props: { notes },
    revalidate: 60,
  }
}
