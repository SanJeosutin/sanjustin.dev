import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const GITHUB_PROJECT_SETTINGS_FILE = 'github-projects.settings.json'

const sampleSettings = {
  showcase: [
    {
      name: 'your-repository-name',
      featured: true,
      note: 'Why this project should be highlighted',
    },
    'another-repository-name',
  ],
}

function homePath(...parts) {
  return path.join(os.homedir(), ...parts)
}

function googleDriveCandidates(fileName = GITHUB_PROJECT_SETTINGS_FILE) {
  const cloudStorage = homePath('Library', 'CloudStorage')
  let cloudStorageCandidates = []

  try {
    cloudStorageCandidates = fs.readdirSync(cloudStorage)
      .filter(name => name.startsWith('GoogleDrive'))
      .flatMap(name => [
        path.join(cloudStorage, name, 'My Drive', 'sanjustin.dev', fileName),
        path.join(cloudStorage, name, 'sanjustin.dev', fileName),
      ])
  } catch {}

  return [
    process.env.GITHUB_PROJECTS_SETTINGS_PATH,
    ...cloudStorageCandidates,
    homePath('Google Drive', 'My Drive', 'sanjustin.dev', fileName),
    homePath('Google Drive', 'sanjustin.dev', fileName),
  ].filter(Boolean)
}

export function findGoogleDriveSettingsPath({ exists = fs.existsSync } = {}) {
  return googleDriveCandidates().find(candidate => exists(candidate)) || googleDriveCandidates()[0]
}

export function readGithubProjectSettings(settingsPath = findGoogleDriveSettingsPath()) {
  if (!settingsPath || !fs.existsSync(settingsPath)) return null

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
    return settings && typeof settings === 'object' && !Array.isArray(settings) ? settings : null
  } catch (error) {
    console.warn(`[github-project-settings] Ignoring invalid settings file at ${settingsPath}:`, error.message)
    return null
  }
}

export function ensureGithubProjectSettingsFile(settingsPath = findGoogleDriveSettingsPath(), repos = []) {
  if (!settingsPath || fs.existsSync(settingsPath)) return settingsPath

  const parent = path.dirname(settingsPath)
  if (!fs.existsSync(parent)) return settingsPath

  const initialNames = repos
    .filter(repo => repo && typeof repo.name === 'string')
    .slice(0, 3)
    .map((repo, index) => index === 0 ? { name: repo.name, featured: true, note: 'Pinned from generated starter settings' } : repo.name)

  const initialSettings = {
    ...sampleSettings,
    showcase: initialNames.length > 0 ? initialNames : sampleSettings.showcase,
  }

  try {
    fs.writeFileSync(settingsPath, `${JSON.stringify(initialSettings, null, 2)}\n`)
  } catch (error) {
    console.warn(`[github-project-settings] Could not create settings file at ${settingsPath}:`, error.message)
  }

  return settingsPath
}

function settingKey(entry) {
  if (typeof entry === 'string') return entry
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return ''
  return entry.name || entry.repo || entry.fullName || entry.url || entry.html_url || ''
}

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/github\.com\//, '')
    .replace(/\.git$/, '')
    .replace(/^.*\//, '')
}

function repoMatches(repo, key) {
  const normalized = normalize(key)
  if (!normalized) return false

  return [repo.name, repo.full_name, repo.html_url, repo.url]
    .some(value => normalize(value) === normalized)
}

export function applyGithubProjectSettings(repos, settings) {
  const safeRepos = Array.isArray(repos)
    ? repos.filter(repo => repo && typeof repo === 'object' && !Array.isArray(repo))
    : []
  const showcase = Array.isArray(settings?.showcase) ? settings.showcase : []

  if (safeRepos.length === 0 || showcase.length === 0) return safeRepos

  const used = new Set()
  const selected = []

  for (const entry of showcase) {
    const match = safeRepos.find(repo => !used.has(repo.id ?? repo.name) && repoMatches(repo, settingKey(entry)))
    if (!match) continue

    used.add(match.id ?? match.name)
    selected.push({
      ...match,
      featured: typeof entry === 'object' && !!entry.featured,
      showcaseNote: typeof entry === 'object' && typeof entry.note === 'string' ? entry.note : undefined,
    })
  }

  return selected.length > 0 ? selected : safeRepos
}

export function getShowcasedGithubProjects(repos, { createIfMissing = true } = {}) {
  if (createIfMissing) ensureGithubProjectSettingsFile(undefined, repos)
  return applyGithubProjectSettings(repos, readGithubProjectSettings())
}
