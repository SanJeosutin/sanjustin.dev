import { fetchDetail, fetchPaths } from '../../lib/api'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSpring, animated, config as springConfig } from '@react-spring/web'
import ShadowContainer from '../../components/ShadowContainer'
import SiteNav from '../../components/Navbar'

export async function getStaticPaths() {
  return { paths: await fetchPaths('notes'), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const note = await fetchDetail('notes', params.slug)
  return note
    ? { props: { note, dateLabel: formatDate(note.date) }, revalidate: 60 }
    : { notFound: true, revalidate: 60 }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function NotePage({ note, dateLabel, theme, setTheme }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [displayDate, setDisplayDate] = useState(dateLabel)

  useEffect(() => {
    if (note) setDisplayDate(formatDate(note.date))
  }, [note?.date])

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
            {displayDate}
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
