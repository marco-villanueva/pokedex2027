import { expect, test } from '@playwright/test'

/**
 * §7 P0-4 anchor tooltips (live API): hovering a TypeBadge reveals its
 * defensive table in an anchored card that flips instead of overflowing;
 * without anchor support the static title serves, and badges never join
 * the tab order (supplementary info only).
 */
test.describe('type badge anchor tooltips', () => {
  test('hover reveals the defensive table on an explorer card', async ({ page }) => {
    await page.goto('/pokedex')
    const badge = page.locator('.explorer-grid .px-type-badge').first()
    await expect(badge).toBeVisible({ timeout: 30000 })
    await badge.hover()
    const tip = badge.locator('.px-type-tip')
    await expect(tip).toBeVisible({ timeout: 15000 })
    await expect(tip.getByText('Weak to')).toBeVisible({ timeout: 30000 })
  })

  test('tooltip flips instead of overflowing near the viewport edge', async ({ page }) => {
    await page.goto('/pokedex')
    const badge = page.locator('.explorer-grid .px-type-badge').first()
    await expect(badge).toBeVisible({ timeout: 30000 })
    await badge.hover()
    const tip = badge.locator('.px-type-tip')
    await expect(tip).toBeVisible({ timeout: 15000 })
    const box = await tip.boundingBox()
    expect(box).not.toBeNull()
    const viewport = page.viewportSize() ?? { width: 1280, height: 720 }
    expect(box?.x).toBeGreaterThanOrEqual(0)
    expect(box ? box.x + box.width : viewport.width + 1).toBeLessThanOrEqual(viewport.width + 1)
  })

  test('badges stay out of the tab order; full data lives in the dossier', async ({ page }) => {
    await page.goto('/pokemon/6')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
      timeout: 30000,
    })
    const badge = page.locator('.dossier-types .px-type-badge').first()
    await expect(badge).not.toHaveAttribute('tabindex')
    const matchups = page.getByRole('heading', { name: /^matchups$/i })
    await matchups.scrollIntoViewIfNeeded()
    await expect(matchups).toBeVisible({ timeout: 15000 })
  })

  test('static title serves without anchor support', async ({ page }) => {
    await page.addInitScript(() => {
      const original = CSS.supports.bind(CSS)
      CSS.supports = ((property: string, value?: string) => {
        if (property === 'position-area') return false
        return original(property, value)
      }) as typeof CSS.supports
    })
    await page.goto('/pokedex')
    const badge = page.locator('.explorer-grid .px-type-badge').first()
    await expect(badge).toBeVisible({ timeout: 30000 })
    await expect(badge).toHaveAttribute('title', /.+ type/)
    await badge.hover()
    await expect(page.locator('.px-type-tip')).toHaveCount(0)
  })

  test('reduced motion keeps tooltip content intact', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/pokedex')
    const badge = page.locator('.explorer-grid .px-type-badge').first()
    await expect(badge).toBeVisible({ timeout: 30000 })
    await badge.hover()
    const tip = badge.locator('.px-type-tip')
    await expect(tip).toBeVisible({ timeout: 15000 })
    await expect(tip.getByText('Weak to')).toBeVisible({ timeout: 30000 })
  })
})
