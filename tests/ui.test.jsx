import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CurrentlyWorkingOn from '../components/CurrentlyWorkingOn'
import Projects from '../components/Projects'
import SiteNav from '../components/Navbar'
import ShadowContainer from '../components/ShadowContainer'
import App from '../pages/_app'
import ProjectDetail from '../components/ProjectDetail'

const repos = Array.from({ length: 13 }, (_, i) => ({
  id: i, name: `Repository ${i + 1}`, html_url: `https://github.com/example/repo-${i + 1}`,
  stargazers_count: i,
}))

function Page({ theme, setTheme }) {
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme}</button>
}

const deferred = () => {
  let resolve
  const promise = new Promise(r => { resolve = r })
  return { promise, resolve }
}

function styleText(container) { return container.querySelector('style')?.textContent || '' }

describe('GitHub project showcase', () => {
  it.each([[[]], [undefined], [null], [{}]])('renders an empty curated showcase without pagination controls: %j', repos => {
    render(<Projects repos={repos} />)
    expect(screen.getByRole('heading', { name: 'Selected Projects on GitHub' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Prev' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
  })

  it('shows all curated project cards and updates when the curated list changes', async () => {
    const { rerender } = render(<Projects repos={repos.slice(0, 3)} />)
    expect(screen.getAllByRole('link', { name: 'View Repo' })).toHaveLength(3)
    expect(screen.getByText('Repository 3')).toBeTruthy()
    rerender(<Projects repos={repos.slice(0, 2)} />)
    await waitFor(() => expect(screen.getAllByRole('link', { name: 'View Repo' })).toHaveLength(2))
    expect(screen.getByText('Repository 1')).toBeTruthy()
    expect(screen.queryByText('Repository 3')).toBeNull()
  })
})



it('renders GitHub projects as a curated showcase with notes and featured labels', () => {
  render(<Projects repos={[
    { id: 1, name: 'Selected repo', description: 'Important work', html_url: 'https://github.com/example/selected', stargazers_count: 5, showcaseNote: 'Pinned from Google Drive settings', featured: true },
    { id: 2, name: 'Second repo', description: 'More work', html_url: 'https://github.com/example/second', stargazers_count: 2 },
  ]} />)
  expect(screen.getByRole('heading', { name: 'Selected Projects on GitHub' })).toBeTruthy()
  expect(screen.getByText('Pinned from Google Drive settings')).toBeTruthy()
  expect(screen.getByText('Featured')).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
})

describe('theme persistence', () => {
  it('restores dark mode before saving and persists subsequent toggles', () => {
    localStorage.setItem('theme', 'dark')
    const save = vi.spyOn(Storage.prototype, 'setItem')
    render(<App Component={Page} pageProps={{}} />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(save).not.toHaveBeenCalledWith('theme', 'light')
    fireEvent.click(screen.getByRole('button', { name: 'dark' }))
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('still switches themes when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    render(<App Component={Page} pageProps={{}} />)
    fireEvent.click(screen.getByRole('button', { name: 'light' }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

describe('stylesheet requests', () => {
  it('does not refetch identical URL arrays and clears removed styles', async () => {
    const mock = vi.fn().mockResolvedValue(new Response('body { color: red }'))
    vi.stubGlobal('fetch', mock)
    const { container, rerender } = render(<ShadowContainer styleSheets={['/first.css']}>Content</ShadowContainer>)
    await waitFor(() => expect(styleText(container)).toContain('red'))
    rerender(<ShadowContainer styleSheets={['/first.css']}>Updated</ShadowContainer>)
    expect(mock).toHaveBeenCalledTimes(1)
    rerender(<ShadowContainer styleSheets={[]}>Updated</ShadowContainer>)
    expect(styleText(container)).toBe('')
  })

  it('does not overwrite current CSS when an earlier request finishes late', async () => {
    const first = deferred()
    const second = deferred()
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise))
    const { container, rerender } = render(<ShadowContainer styleSheets={['/old.css']} />)
    rerender(<ShadowContainer styleSheets={['/new.css']} />)
    await act(async () => { second.resolve(new Response('new styles')) })
    expect(styleText(container)).toBe('new styles')
    await act(async () => { first.resolve(new Response('old styles')) })
    expect(styleText(container)).toBe('new styles')
  })
})

it('connects the mobile toggle to a single accessible animated drawer', () => {
  render(<SiteNav theme="light" setTheme={vi.fn()} />)
  const toggle = screen.getByRole('button', { name: 'Open main menu' })
  const drawer = document.getElementById(toggle.getAttribute('aria-controls'))
  expect(toggle.getAttribute('aria-expanded')).toBe('false')
  expect(drawer.hasAttribute('inert')).toBe(true)
  expect(drawer.querySelector('a').tabIndex).toBe(-1)
  fireEvent.click(toggle)
  expect(toggle.getAttribute('aria-expanded')).toBe('true')
  expect(drawer.hasAttribute('inert')).toBe(false)
  expect(drawer.querySelector('ul').children).toHaveLength(4)
  expect(drawer.querySelector('ul').firstElementChild.tagName).toBe('LI')
  fireEvent.click(drawer.querySelector('a'))
  expect(toggle.getAttribute('aria-expanded')).toBe('false')
})

it('renders project details with the existing GitHub action', () => {
  render(<ProjectDetail project={{ name: 'My project', details: 'Project details', githubUrl: 'https://github.com/example/project' }} theme="light" setTheme={vi.fn()} />)
  expect(screen.getByRole('heading', { name: 'My project' })).toBeTruthy()
  expect(screen.getByText('Project details')).toBeTruthy()
  expect(screen.getByRole('link', { name: 'View on GitHub' }).href).toBe('https://github.com/example/project')
})


it('skips malformed current projects instead of generating broken detail links', () => {
  render(<CurrentlyWorkingOn projects={[null, {}, { slug: '' }, { slug: 'a/b', name: 'Valid project' }]} />)
  expect(screen.getAllByRole('link', { name: 'Learn More' })).toHaveLength(1)
  expect(screen.getByRole('link', { name: 'Learn More' }).getAttribute('href')).toBe('/work/a%2Fb')
  expect(screen.getByText('Valid project')).toBeTruthy()
})

describe('current-project Show more', () => {
  const currentProjects = Array.from({ length: 9 }, (_, index) => ({
    slug: `project-${index + 1}`,
    name: `Current project ${index + 1}`,
    shortDescription: `Summary ${index + 1}`,
    githubUrl: `https://github.com/example/project-${index + 1}`,
  }))

  it.each([[[]], [undefined], [null], [{}], [currentProjects.slice(0, 4)]])(
    'omits the button for empty, invalid, or short lists: %j', projects => {
      render(<CurrentlyWorkingOn projects={projects} />)
      expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull()
    },
  )

  it.each([5, 9])('reveals four at a time, preserves earlier cards, and ends at %i projects', async count => {
    const { unmount } = render(<CurrentlyWorkingOn projects={currentProjects.slice(0, count)} />)
    expect(screen.getAllByRole('link', { name: 'Learn More' })).toHaveLength(4)
    const firstLink = screen.getAllByRole('link', { name: 'Learn More' })[0]
    expect(firstLink.getAttribute('href')).toBe('/work/project-1')
    fireEvent.click(screen.getByRole('button', { name: 'Show more' }))
    await waitFor(() => expect(screen.getAllByRole('link', { name: 'Learn More' })).toHaveLength(Math.min(8, count)))
    expect(screen.getAllByRole('link', { name: 'Learn More' })[0]).toBe(firstLink)
    if (count > 8) {
      fireEvent.click(screen.getByRole('button', { name: 'Show more' }))
      await waitFor(() => expect(screen.getAllByRole('link', { name: 'Learn More' })).toHaveLength(count))
    }
    expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull()
    expect(screen.getAllByRole('link', { name: 'View on GitHub' })).toHaveLength(count)
    expect(screen.getByText(`Current project ${count}`)).toBeTruthy()
    unmount()
    render(<CurrentlyWorkingOn projects={currentProjects.slice(0, count)} />)
    expect(screen.getAllByRole('link', { name: 'Learn More' })).toHaveLength(4)
  })
})
