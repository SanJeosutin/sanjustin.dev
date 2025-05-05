import Link from 'next/link'
import SiteNav from '../../components/Navbar'
import { getSortedPostsData } from '../../lib/posts'

export default function Blog({ posts, theme, setTheme }) {
  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-charcoal-700 dark:text-white">
          Blog
        </h1>
        <div className="space-y-6">
          {posts.map(({ slug, title, date }) => (
            <Link key={slug} href={`/blog/${slug}`} legacyBehavior>
              <a className="
                block p-6 border-2 border-persian_green-300 rounded shadow
                hover:border-persian_green-500 transition-colors duration-200
                bg-white dark:bg-gray-800
              ">
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
  const posts = getSortedPostsData()
  return { props: { posts } }
}
