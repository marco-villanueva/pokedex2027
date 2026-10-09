import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * RC7 accessibility gate: automated axe scan on every primary route.
 * Complements (never replaces) the manual keyboard/contrast/reduced-motion
 * specs. Tags: wcag2a + wcag2aa.
 */
const ROUTES = [
  '/pokedex',
  '/pokedex?type=fire&generation=1',
  '/pokemon/25',
  '/pokemon/25?shiny=1',
  '/evolution/67',
  '/compare?left=6&right=9',
  '/team',
  '/favorites',
  '/lab',
  '/totally-missing',
]

for (const route of ROUTES) {
  test(`axe: no violations on ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page.getByRole('main')).toBeVisible({ timeout: 30000 })
    // Let async regions settle so the scan sees final DOM, not skeletons.
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {})

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(
      results.violations.map((violation) => `${violation.id}: ${violation.help}`),
      `axe violations on ${route}`,
    ).toEqual([])
  })
}
