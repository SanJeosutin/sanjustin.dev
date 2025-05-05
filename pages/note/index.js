import Link from 'next/link'
import SiteNav from '../../components/Navbar'

export default function Notes({ notes, theme, setTheme }) {
  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-charcoal-700 dark:text-white">
          Notes
        </h1>

        <div className="space-y-6">
          {notes.map(({ slug, title, date }) => (
            <Link key={slug} href={`/note/${slug}`} legacyBehavior>
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
          ))}
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  let notes = []
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/notes`)
    if (!res.ok) {
      console.error(`Failed to fetch notes: ${res.status}`)
      return { notFound: true }
    }

    const data = await res.json()
    if (Array.isArray(data)) {
      notes = data
    } else {
      console.error('Notes API returned non-array:', data)
      return { notFound: true }
    }
  } catch (err) {
    console.error('Error fetching notes:', err)
    return { notFound: true }
  }

  return {
    props: { notes },
    revalidate: 60, // optional ISR
  }
}
