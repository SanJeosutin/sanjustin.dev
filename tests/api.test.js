import { describe, expect, it, vi } from 'vitest'
import { fetchList, fetchDetail, fetchPaths } from '../lib/api'
import { getStaticProps as getWork } from '../pages/work/[slug]'
import { getStaticProps as getNote } from '../pages/note/[slug]'
import { getServerSideProps as getWorkList } from '../pages/work/index'
import { getServerSideProps as getNoteList } from '../pages/note/index'
import { getStaticProps as getHome } from '../pages/index'

const respond = (data, status = 200) => {
  const fetchMock = vi.fn().mockImplementation(async () => new Response(JSON.stringify(data), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('API data and route behavior', () => {
  it('uses the default endpoint and honors a configured base with trailing slash', async () => {
    const mock = respond([])
    await fetchList('projects')
    expect(mock.mock.calls[0][0]).toBe('https://apisanjustin.vercel.app/api/projects')
    vi.stubEnv('API_BASE_URL', 'https://example.test/')
    try {
      await fetchList('projects')
      expect(mock.mock.calls[1][0]).toBe('https://example.test/api/projects')
    } finally { vi.unstubAllEnvs() }
  })

  it('rejects HTTP failures, invalid list shapes, and invalid detail bodies', async () => {
    respond({ error: 'down' }, 503)
    await expect(fetchList('projects')).rejects.toThrow('HTTP 503')
    respond({ message: 'invalid' })
    await expect(fetchList('projects')).rejects.toThrow('expected an array')
    await expect(fetchDetail('notes', 'missing')).rejects.toThrow('invalid detail')
    respond(null)
    await expect(fetchDetail('notes', 'missing')).rejects.toThrow('invalid detail')
  })

  it('filters malformed list entries and deduplicates valid static slugs', async () => {
    respond([null, 12, [], { slug: '' }, { slug: 42 }, { slug: 'valid' }, { slug: 'valid' }])
    expect(await fetchPaths('notes')).toEqual([{ params: { slug: 'valid' } }])
  })

  it('encodes slugs as one API path segment', async () => {
    const mock = respond({ name: 'Project' })
    await fetchDetail('current-projects', 'a/b ?#')
    expect(mock.mock.calls[0][0]).toContain('/api/current-projects/a%2Fb%20%3F%23')
  })

  it('returns revalidated 404s for genuinely missing detail pages', async () => {
    respond({}, 404)
    expect(await getWork({ params: { slug: 'missing' } })).toEqual({ notFound: true, revalidate: 60 })
    expect(await getNote({ params: { slug: 'missing' } })).toEqual({ notFound: true, revalidate: 60 })
  })

  it('throws on transient detail failures rather than caching a 404', async () => {
    respond({}, 503)
    await expect(getWork({ params: { slug: 'existing' } })).rejects.toThrow('HTTP 503')
    await expect(getNote({ params: { slug: 'existing' } })).rejects.toThrow('HTTP 503')
  })

  it('retains valid project data and the existing revalidation interval', async () => {
    const project = { name: 'Project', details: 'Details', githubUrl: 'https://github.com/example/project' }
    respond(project)
    expect(await getWork({ params: { slug: 'project' } })).toEqual({ props: { project }, revalidate: 60 })
  })

  it('retains empty list-page fallbacks during API failures', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    respond({}, 503)
    expect(await getWorkList()).toEqual({ props: { currProjects: [] } })
    expect(await getNoteList()).toEqual({ props: { notes: [] } })
    await expect(getHome()).rejects.toThrow('HTTP 503')
  })
})
