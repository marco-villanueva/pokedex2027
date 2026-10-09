import { expect, test } from '@playwright/test'

/**
 * Error-hygiene gate (§39): when PokéAPI is unreachable, every surface
 * offers a recoverable state whose text never exposes raw URLs, payloads,
 * or stack traces.
 */
test.describe('outage error hygiene', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**://pokeapi.co/**', (route) => route.abort('failed'))
  })

  test('explorer error hides transport internals', async ({ page }) => {
    await page.goto('/pokedex')
    const alert = page.getByRole('alert').first()
    await expect(alert).toBeVisible({ timeout: 30000 })
    await expect(alert).not.toContainText(/https?:\/\//)
    await expect(alert).not.toContainText(/pokeapi/i)
    await expect(page.getByRole('button', { name: /retry/i }).first()).toBeVisible()
  })

  test('dossier error hides transport internals', async ({ page }) => {
    await page.goto('/pokemon/25')
    const alert = page.getByRole('alert').first()
    await expect(alert).toBeVisible({ timeout: 30000 })
    await expect(alert).not.toContainText(/https?:\/\//)
    await expect(alert).not.toContainText(/pokeapi/i)
  })
})
