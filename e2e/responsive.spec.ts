import { expect, test } from '@playwright/test'

/**
 * Gate 4 (responsive): no horizontal page overflow on any RC0 route,
 * in loading state and in settled state.
 */
const WIDTHS = [360, 390, 430, 768, 1024, 1440]
const ROUTES = [
  '/pokedex',
  '/pokemon/6',
  '/compare',
  '/compare?left=6&right=9',
  '/team',
  '/favorites',
  '/evolution/67',
  '/lab',
  '/does-not-exist',
] as const

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    for (const route of ROUTES) {
      await page.goto(route)
      // Loading state must not overflow either (skeletons, placeholders).
      await expect
        .poll(
          async () =>
            page.evaluate(
              () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
            ),
          { timeouts: [500, 1500, 2500], timeout: 8000 },
        )
        .toBeLessThanOrEqual(1)
      // Settled state (data, images, tables) must not overflow either.
      await expect(page.getByRole('main')).toBeVisible({ timeout: 15000 })
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {})
      const settled = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(settled, `settled overflow on ${route} at ${width}px`).toBeLessThanOrEqual(1)
    }
  })
}
