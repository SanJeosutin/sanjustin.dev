import { test, expect } from '@playwright/test'

const control = async (request, data) => {
  await request.post('http://127.0.0.1:4100/__control', { data })
}

test.beforeEach(async ({ request }) => { await control(request, { reset: true }) })

test('desktop homepage preserves anchors, pagination, banner rotation, and theme persistence', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { name: "Hi, I'm Justin" })).toBeVisible()
  for (const id of ['about', 'projects', 'current-projects', 'current-work']) {
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
  }
  await page.getByRole('link', { name: 'Github Projects', exact: true }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.getByRole('link', { name: 'View Repo', exact: true })).toHaveCount(6)
  await page.getByRole('button', { name: '3', exact: true }).click()
  await expect(page.getByRole('link', { name: 'View Repo', exact: true })).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Toggle Theme' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect.poll(() => page.locator('#hero [class*="overflow-x-auto"]').evaluate(el => el.scrollLeft), { timeout: 8000 }).toBeGreaterThan(0)
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true })
  expect(errors).toEqual([])
})

test('mobile drawer opens, animates, and closes after selecting a section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open main menu' })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('link', { name: 'About', exact: true })).toHaveCount(0)
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  const about = page.getByRole('link', { name: 'About', exact: true })
  await expect(about).toBeVisible()
  const drawer = page.locator(`[id="${await toggle.getAttribute('aria-controls')}"]`)
  await expect.poll(() => drawer.evaluate(el => el.clientHeight)).toBeGreaterThan(100)
  await expect.poll(() => drawer.evaluate(el => Math.abs(el.clientHeight - el.querySelector('ul').scrollHeight))).toBeLessThanOrEqual(1)
  await page.screenshot({ path: 'test-results/home-mobile-menu.png' })
  await about.click()
  await expect(page).toHaveURL(/#about$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('link', { name: 'About', exact: true })).toHaveCount(0)
})

test('project and compatibility URLs show names, details, and GitHub actions', async ({ page }) => {
  for (const route of ['/work/fixture-project', '/_work/fixture-project']) {
    const response = await page.goto(route)
    expect(response.status()).toBe(200)
    await expect(page.getByRole('heading', { name: 'Fixture project', exact: true })).toBeVisible()
    await expect(page.getByText('Current project details')).toBeVisible()
    await expect(page.getByRole('link', { name: 'View on GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/example/project')
  }
  await page.goto('/work')
  await expect(page.getByRole('heading', { name: 'Fixture project', exact: true })).toBeVisible()
})

test('notes and projects retain isolated HTML content', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/note/fixture-note')
  await expect(page.getByRole('heading', { name: 'Fixture note', exact: true })).toBeVisible()
  await expect(page.getByText('HTML note content')).toBeVisible()
  await expect(page.locator('time')).toContainText('2025')
  await page.goto('/work/html-project')
  await expect(page.getByText('HTML project content')).toBeVisible()
  await expect.poll(() => page.locator('section').evaluate(el => Number(el.style.opacity))).toBeGreaterThan(0.99)
  await page.screenshot({ path: 'test-results/project-html.png', fullPage: true })
  expect(errors).toEqual([])
})

test('missing details return 404 and list failures retain empty fallbacks', async ({ page, request }) => {
  for (const route of ['/work/missing', '/note/missing', '/_work/missing']) {
    expect((await page.goto(route)).status()).toBe(404)
  }
  await control(request, { path: '/api/notes', status: 503, body: { error: 'temporary outage' } })
  expect((await page.goto('/note')).status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'Notes', exact: true })).toBeVisible()
  await control(request, { path: '/api/current-projects', body: { invalid: 'list' } })
  expect((await page.goto('/work')).status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'CurrProjects', exact: true })).toBeVisible()
})


test('note dates hydrate correctly with a different browser locale and timezone', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-AU', timezoneId: 'Australia/Melbourne' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:3100/note/fixture-note')
  await expect(page.locator('time')).toHaveText('1 July 2025')
  await page.getByRole('button', { name: 'Toggle Theme' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  expect(errors).toEqual([])
  await context.close()
})

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`Show more reveals current-project cards on a ${viewport.width}px viewport`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/#current-projects')
    const section = page.locator('#current-projects')
    const links = section.getByRole('link', { name: 'Learn More', exact: true })
    const button = section.getByRole('button', { name: 'Show more', exact: true })
    await expect(links).toHaveCount(4)
    await expect(section.getByRole('heading', { name: 'Fixture project', exact: true })).toBeVisible()
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(links).toHaveCount(8)
    await expect(section.getByRole('heading', { name: 'Fixture project', exact: true })).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Current project 8', exact: true })).toBeVisible()
    await button.click()
    await expect(links).toHaveCount(9)
    await expect(button).toHaveCount(0)
    await expect.poll(() => links.nth(8).evaluate(el => Number(el.closest('[style]').style.opacity))).toBeGreaterThan(0.99)
    await expect(links.first()).toHaveAttribute('href', '/work/fixture-project')
    await expect(links.nth(8)).toHaveAttribute('href', '/work/current-project-9')
    await page.reload()
    await expect(links).toHaveCount(4)
    await expect(button).toBeVisible()
    expect(errors).toEqual([])
  })
}
