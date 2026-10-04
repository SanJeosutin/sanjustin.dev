const NOT_FOUND = Symbol('not-found')
const DEFAULT_API_BASE_URL = 'https://apisanjustin.vercel.app'

async function request(resource, allowMissing = false) {
  const base = (process.env.API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '')
  const response = await fetch(`${base}/api/${resource}`)
  if (allowMissing && response.status === 404) return NOT_FOUND
  if (!response.ok) throw new Error(`API ${resource}: HTTP ${response.status}`)
  return response.json()
}

export async function fetchList(resource) {
  const data = await request(resource)
  if (!Array.isArray(data)) throw new Error(`API ${resource}: expected an array`)
  return data.filter(item => item && typeof item === 'object' && !Array.isArray(item) &&
    (resource === 'projects' || (typeof item.slug === 'string' && item.slug.trim().length > 0)))
}

export async function fetchDetail(resource, slug) {
  const data = await request(`${resource}/${encodeURIComponent(slug)}`, true)
  if (data === NOT_FOUND) return null
  const nameField = resource === 'notes' ? 'title' : 'name'
  if (!data || Array.isArray(data) || typeof data !== 'object' || data.error ||
      typeof data[nameField] !== 'string') {
    throw new Error(`API ${resource}: invalid detail response`)
  }
  return data
}

export async function fetchPaths(resource) {
  try {
    const items = await fetchList(resource)
    const slugs = [...new Set(items.map(item => item.slug)
      .filter(slug => typeof slug === 'string' && slug.trim().length > 0))]
    return slugs.map(slug => ({ params: { slug } }))
  } catch (error) {
    console.error(`[getStaticPaths] ${resource}:`, error)
    return []
  }
}
