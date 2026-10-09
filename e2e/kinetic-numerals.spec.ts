import { expect, test } from '@playwright/test'

/**
 * §7 P1-9 kinetic numerals — delivered slice (live API): hero numerals
 * are fluid (`clamp()`, zero font downloads, no swap, no CLS). The
 * variable-weight slice was discarded on font-budget evidence (D-029).
 */
test.describe('fluid hero numerals', () => {
  test('card watermark scales with the viewport', async ({ page }) => {
    await page.goto('/pokedex')
    const watermark = page.locator('.pokemon-card-watermark').first()
    await expect(watermark).toBeVisible({ timeout: 30000 })

    await page.setViewportSize({ width: 390, height: 844 })
    const mobile = await watermark.evaluate((element) =>
      parseFloat(getComputedStyle(element).fontSize),
    )
    await page.setViewportSize({ width: 1440, height: 900 })
    const desktop = await watermark.evaluate((element) =>
      parseFloat(getComputedStyle(element).fontSize),
    )
    // Fluid, and desktop keeps the full V1 voice.
    expect(mobile).toBeLessThan(desktop)
    expect(desktop).toBeCloseTo(67.2, 0)
  })

  test('dossier numerals stay legible at both ends', async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ] as const) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/pokemon/charizard')
      await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
        timeout: 30000,
      })
      await expect(page.locator('.dossier-id')).toBeVisible()
      await expect(page.locator('.scanner-readout')).toContainText('#0006')
    }
  })

  test('reduced motion keeps numerals intact', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/pokemon/charizard')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
      timeout: 30000,
    })
    await expect(page.locator('.dossier-id')).toBeVisible()
  })
})
