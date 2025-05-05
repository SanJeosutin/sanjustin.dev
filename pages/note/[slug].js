import { useRouter } from 'next/router'
import SiteNav from '../../components/Navbar'

export default function NoteDetail({ note, theme, setTheme }) {
  const router = useRouter()

  if (!note) {
    return (
      <>
        <SiteNav theme={theme} setTheme={setTheme} />
        <div className="p-16 text-center">Note not found</div>
      </>
    )
  }

  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />
      <article className="prose lg:prose-lg dark:prose-invert py-16 px-4 max-w-4xl mx-auto">
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
        <div
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: note.contentHtml }}
        />
      </article>
    </>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/notes`)
  const notes = await res.json()
  const paths = notes.map(({ slug }) => ({ params: { slug } }))
  return {
    paths,
    fallback: 'blocking',   // ← serve new slugs on demand
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/notes/${params.slug}`
  )
  if (!res.ok) {
    return { notFound: true }
  }
  const note = await res.json()
  return {
    props: { note },
    revalidate: 60,
  }
}
