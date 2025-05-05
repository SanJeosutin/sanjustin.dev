import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'

const postsDir = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDir)
  const allPosts = fileNames.map(fname => {
    const slug = fname.replace(/\.md$/, '')
    const fullPath = path.join(postsDir, fname)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    return { slug, ...data }
  })
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostData(slug) {
  const fullPath = path.join(postsDir, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // Use unified to parse markdown, allow GFM, convert to HTML with raw HTML nodes
  const processed = await unified()
    .use(remarkParse)                            // parse markdown
    .use(remarkGfm)                              // support GitHub Flavored MD (tables, strikethrough)
    .use(remarkRehype, { allowDangerousHtml: true }) // turn MDAST → HAST, keep raw HTML
    .use(rehypeRaw)                              // process the raw HTML nodes in HAST
    .use(rehypeStringify)                        // serialize HAST → HTML
    .process(content)

  const contentHtml = processed.toString()

  return {
    slug,
    contentHtml,
    ...data,
  }
}
