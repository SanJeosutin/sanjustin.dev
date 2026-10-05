import { describe, expect, it, vi } from 'vitest'
import path from 'node:path'
import { applyGithubProjectSettings, findGoogleDriveSettingsPath, getShowcasedGithubProjects, readGithubProjectSettings } from '../lib/github-project-settings'

const repos = [
  { id: 1, name: 'repository-1', description: 'First', html_url: 'https://github.com/example/repository-1', stargazers_count: 3 },
  { id: 2, name: 'repository-2', description: 'Second', html_url: 'https://github.com/example/repository-2', stargazers_count: 8 },
  { id: 3, name: 'repository-3', description: 'Third', html_url: 'https://github.com/example/repository-3', stargazers_count: 1 },
]

describe('GitHub project showcase settings', () => {
  it('reads the env-configured settings file', () => {
    vi.stubEnv('GITHUB_PROJECTS_SETTINGS_PATH', path.join(process.cwd(), 'tests/fixtures/github-projects.settings.json'))
    expect(readGithubProjectSettings()).toEqual({
      showcase: [
        'repository-3',
        { name: 'repository-1', featured: true, note: 'Primary project to show first' },
      ],
    })
  })

  it('orders and annotates repos from settings while dropping unknown projects', () => {
    const showcased = applyGithubProjectSettings(repos, {
      showcase: [
        { name: 'repository-3', note: 'Show third first' },
        'missing-repo',
        { url: 'https://github.com/example/repository-1', featured: true },
      ],
    })

    expect(showcased.map(repo => repo.name)).toEqual(['repository-3', 'repository-1'])
    expect(showcased[0].showcaseNote).toBe('Show third first')
    expect(showcased[1].featured).toBe(true)
  })

  it('falls back to existing repo order when the settings file is missing or invalid', () => {
    vi.stubEnv('GITHUB_PROJECTS_SETTINGS_PATH', '/definitely/missing/github-projects.settings.json')
    expect(getShowcasedGithubProjects(repos)).toEqual(repos)
    expect(applyGithubProjectSettings(repos, { showcase: [] })).toEqual(repos)
    expect(applyGithubProjectSettings(repos, { showcase: ['missing'] })).toEqual(repos)
    expect(applyGithubProjectSettings(repos, null)).toEqual(repos)
  })

  it('discovers likely Google Drive sanjustin.dev settings locations', () => {
    const exists = candidate => candidate.includes('Library/CloudStorage/GoogleDrive')
    expect(findGoogleDriveSettingsPath({ exists })).toContain('sanjustin.dev/github-projects.settings.json')
  })
})
