import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSpring, animated, config as springConfig } from '@react-spring/web'
import ShadowContainer from '../../components/ShadowContainer'
import SiteNav from '../../components/Navbar'

// Pre-render note pages at build time
export async function getStaticPaths() {
  try {
    const res = await fetch('https://apisanjustin.vercel.app/api/notes')
    const notes = await res.json()
    if (!Array.isArray(notes)) throw new Error('Invalid notes response')
    const paths = notes.map((note) => ({ params: { slug: note.slug } }))
    return { paths, fallback: 'blocking' }
  } catch (e) {
    console.error('[getStaticPaths] Error:', e)
    return { paths: [], fallback: 'blocking' }
  }
}

// Load a specific note’s data
export async function getStaticProps({ params }) {
  try {
    const res = await fetch(
      `https://apisanjustin.vercel.app/api/notes/${params.slug}`
    )
    const note = await res.json()
    if (!note || note.error) return { notFound: true }
    return { props: { note }, revalidate: 60 }
  } catch (e) {
    console.error('[getStaticProps] Error:', e)
    return { notFound: true }
  }
}

export default function NotePage({ note, theme, setTheme }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // trigger mount animation
  useEffect(() => {
    setMounted(true)
  }, [])

  // fade-in + slide-up
  const animation = useSpring({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
    config: springConfig.gentle,
  })

  if (!note) {
    return (
      <>
        <SiteNav theme={theme} setTheme={setTheme} />
        <div className="p-16 text-center">Note not found.</div>
      </>
    )
  }

  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />
      <animated.section
        className="py-16 px-4 max-w-6xl mx-auto"
        style={animation}
      >
        <button
          onClick={() => router.back()}
          className="
            inline-block mb-6 text-persian_green-500 dark:text-saffron-400
            hover:underline transition-colors duration-200
          "
        >
          ← Back
        </button>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-700 dark:text-white mb-2">
            {note.title}
          </h1>
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(note.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        <ShadowContainer
          styleSheets={['https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css']}
        >
          <div
            className="container"
            dangerouslySetInnerHTML={{ __html: note.contentHtml }}
          />
        </ShadowContainer>
      </animated.section>
    </>
  )
}
