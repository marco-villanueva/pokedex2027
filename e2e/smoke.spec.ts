import { expect, test } from '@playwright/test'

/**
 * Foundation flows (live API): explorer renders, detail direct,
 * 404 handling. Rich explorer matrix lives in `explorer.spec.ts`.
 */
test.describe('RC0 foundation flows', () => {
  test('explorer renders specimens', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.getByRole('heading', { name: /pokédex explorer/i })).toBeVisible()
    const cards = page.locator('.explorer-grid > li')
    await expect(cards.first()).toBeVisible({ timeout: 30_000 })
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('detail dossier renders with stats and stepper', async ({ page }) => {
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText(/base statistics/i)).toBeVisible()
    await expect(page.getByText(/abilities/i)).toBeVisible()

    await page.getByRole('link', { name: /next pokémon/i }).click()
    await expect(page).toHaveURL(/\/pokemon\/26/)
  })

  test('unknown specimen shows recoverable 404', async ({ page }) => {
    await page.goto('/pokemon/this-does-not-exist-xyz')
    await expect(page.getByText(/no specimen/i)).toBeVisible({ timeout: 30_000 })
    await expect(page.getByRole('link', { name: /return to explorer/i })).toBeVisible()
  })

  test('document title follows the route', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30_000 })
    await expect(page).toHaveTitle(/Pokédex Explorer/)

    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30_000 })
    await expect(page).toHaveTitle(/Pikachu #0025/)

    await page.goto('/totally-missing')
    await expect(page.getByRole('heading', { name: /uncharted sector/i })).toBeVisible()
    await expect(page).toHaveTitle(/Uncharted sector/)
  })
})
