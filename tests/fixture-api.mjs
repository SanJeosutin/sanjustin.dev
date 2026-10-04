import { createServer } from 'node:http'

const projects = Array.from({ length: 13 }, (_, index) => ({
  id: index + 1,
  name: `Repository ${index + 1}`,
  description: `Description ${index + 1}`,
  html_url: `https://github.com/example/repository-${index + 1}`,
  stargazers_count: index,
}))
const currentProjects = [
  { slug: 'fixture-project', name: 'Fixture project', date: '2025-07-01', shortDescription: 'Current project summary', details: 'Current project details', githubUrl: 'https://github.com/example/project' },
  { slug: 'html-project', name: 'HTML project', date: '2025-07-02', shortDescription: 'HTML project summary', contentHtml: '<h2>Project article</h2><p>HTML project content</p>', githubUrl: 'https://github.com/example/html-project' },
  ...Array.from({ length: 7 }, (_, index) => ({
    slug: `current-project-${index + 3}`,
    name: `Current project ${index + 3}`,
    shortDescription: `Summary ${index + 3}`,
    details: `Details ${index + 3}`,
    githubUrl: `https://github.com/example/current-project-${index + 3}`,
  })),
]
const notes = [{ slug: 'fixture-note', title: 'Fixture note', date: '2025-07-01', shortDescription: 'Note summary', contentHtml: '<h2>Note article</h2><p>HTML note content</p>' }]
const overrides = new Map()

createServer(async (request, response) => {
  const path = new URL(request.url, 'http://127.0.0.1').pathname
  response.setHeader('Content-Type', 'application/json')
  if (path === '/__control' && request.method === 'POST') {
    let body = ''
    for await (const chunk of request) body += chunk
    const control = JSON.parse(body)
    if (control.reset) overrides.clear()
    else overrides.set(control.path, { status: control.status || 200, body: control.body })
    response.end('{}')
    return
  }
  if (overrides.has(path)) {
    const override = overrides.get(path)
    response.statusCode = override.status
    response.end(JSON.stringify(override.body))
    return
  }
  const collections = { projects, 'current-projects': currentProjects, notes }
  const [, prefix, resource, slug] = path.split('/')
  const collection = prefix === 'api' ? collections[resource] : undefined
  const data = slug ? collection?.find(item => item.slug === decodeURIComponent(slug)) : collection
  response.statusCode = data ? 200 : 404
  response.end(JSON.stringify(data || { error: 'Not found' }))
}).listen(4100, '127.0.0.1', () => console.log('Fixture API listening on 4100'))
