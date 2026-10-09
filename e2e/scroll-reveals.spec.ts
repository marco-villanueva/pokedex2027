import { expect, test } from '@playwright/test'

/**
 * §7 P0-2 scroll-driven reveals (live API): entrance of explorer cards and
 * dossier sections is scroll-linked where supported, and content stays
 * fully legible everywhere (visible by default, killed by reduced motion).
 */
test.describe('scroll-driven reveals', () => {
  test('explorer cards reveal on scroll with view() timeline', async ({ page }) => {
    await page.goto('/pokedex')
    const items = page.locator('.explorer-grid > li')
    await expect(items.first()).toBeVisible({ timeout: 30000 })

    const timeline = await items
      .first()
      .evaluate((element) => getComputedStyle(element).animationTimeline)
    // Chromium supports scroll-driven animations: enhancement active.
    expect(timeline).toContain('view()')

    // Scroll through two infinite windows: content keeps materialising
    // (IntersectionObserver owns loading; the reveal only enhances entry).
    await page
      .getByRole('button', { name: /show more/i })
      .first()
      .click()
    await expect(items.nth(48)).toBeVisible({ timeout: 30000 })
    // The reveal is transform-only: full contrast at every flight instant.
    const lateItem = items.nth(48)
    await expect
      .poll(() => lateItem.evaluate((element) => getComputedStyle(element).opacity), {
        timeout: 15000,
      })
      .toBe('1')
  })

  test('dossier panels are legible and scroll-linked', async ({ page }) => {
    await page.goto('/pokemon/charizard')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
      timeout: 30000,
    })
    const stats = page.getByRole('heading', { name: /base statistics/i })
    await stats.evaluate((element) => element.scrollIntoView({ block: 'center' }))
    await expect(stats).toBeVisible({ timeout: 15000 })
    const panel = page.locator('.dossier-panels .panel').first()
    const timeline = await panel.evaluate((element) => getComputedStyle(element).animationTimeline)
    expect(timeline).toContain('view()')
    // Transform-only reveal: the panel never drops below full opacity.
    const panelOpacity = await panel.evaluate((element) => getComputedStyle(element).opacity)
    expect(panelOpacity).toBe('1')
  })

  test('reduced motion kills the reveal, content intact', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/pokedex')
    const items = page.locator('.explorer-grid > li')
    await expect(items.first()).toBeVisible({ timeout: 30000 })
    const animationName = await items
      .first()
      .evaluate((element) => getComputedStyle(element).animationName)
    expect(animationName).toBe('none')
    await expect(items.nth(5)).toBeVisible({ timeout: 30000 })
  })
})
