// pages/blog/[slug].js
import SiteNav from '../../components/Navbar'
import { getSortedPostsData, getPostData } from '../../lib/posts'

export default function Post({ post, theme, setTheme }) {
  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />
      <article className="prose lg:prose-lg dark:prose-invert py-16 px-4 max-w-4xl mx-auto">
        {/* Header with smaller, blog‐appropriate title & date */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-700 dark:text-white mb-2">
            {post.title}
          </h1>
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {/* Markdown content rendered via prose */}
        <div
          className="prose block dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </>
  )
}

export async function getStaticPaths() {
  const posts = getSortedPostsData()
  const paths = posts.map(({ slug }) => ({ params: { slug } }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const post = await getPostData(params.slug)
  return { props: { post } }
}
