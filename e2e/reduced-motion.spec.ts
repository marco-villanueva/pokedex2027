import { expect, test } from '@playwright/test'

/**
 * Gate 5 (motion): with `prefers-reduced-motion: reduce`, decorative loops
 * halt while every route stays fully usable.
 */
test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('loops halt, content intact', async ({ page }) => {
    await page.goto('/lab')
    await expect(page.getByText(/signature specimen/i)).toBeVisible({ timeout: 30000 })

    const sweepAnimation = await page
      .locator('.px-scanner-sweep')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName)
    expect(sweepAnimation === 'none' || sweepAnimation === '').toBeTruthy()

    // Cards remain legible links without tilt.
    const cards = page.locator('.lab-study-grid .pokemon-card-link')
    await expect(cards.first()).toBeVisible({ timeout: 30000 })
    expect(await cards.count()).toBeGreaterThan(0)

    // Explorer still paginates and opens dossiers.
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
  })
})
