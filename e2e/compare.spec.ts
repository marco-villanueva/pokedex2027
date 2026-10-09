import { expect, test } from '@playwright/test'

/**
 * RC5 compare + collections flows (live API): side selection, shareable URL,
 * reload reconstruction, team bench management, favorites shelf.
 */
test.describe('RC5 compare', () => {
  test('select both sides, URL persists across reload', async ({ page }) => {
    await page.goto('/compare')
    await expect(page.getByRole('heading', { name: /compare specimens/i })).toBeVisible()

    await page.getByLabel(/left specimen/i).fill('charizard')
    await page
      .getByRole('option', { name: /charizard/i })
      .first()
      .click()
    await page.getByLabel(/right specimen/i).fill('blastoise')
    await page
      .getByRole('option', { name: /blastoise/i })
      .first()
      .click()

    await expect(page).toHaveURL(/left=6/)
    await expect(page).toHaveURL(/right=9/)
    await expect(page.getByRole('table')).toBeVisible({ timeout: 30000 })
    // 6 vs 9 splits individual stats 3–3: the caption must say so in words.
    await expect(page.getByRole('table')).toContainText(/dead even across individual stats/i)

    await page.reload()
    await expect(page).toHaveURL(/left=6/)
    await expect(page).toHaveURL(/right=9/)
    await expect(page.getByRole('table')).toBeVisible({ timeout: 30000 })
  })

  test('direct URL reconstructs the same comparison', async ({ page }) => {
    await page.goto('/compare?left=25&right=150')
    await expect(page.getByRole('table')).toBeVisible({ timeout: 30000 })
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /mewtwo/i })).toBeVisible()
  })

  test('swap exchanges sides', async ({ page }) => {
    await page.goto('/compare?left=25&right=150')
    await expect(page.getByRole('table')).toBeVisible({ timeout: 30000 })
    await page.getByRole('button', { name: /swap/i }).click()
    await expect(page).toHaveURL(/left=150/)
    await expect(page).toHaveURL(/right=25/)
  })

  test('surprise fills both sides with valid specimens', async ({ page }) => {
    await page.goto('/compare')
    await expect(page.getByRole('heading', { name: /compare specimens/i })).toBeVisible()
    await page.getByRole('button', { name: /surprise/i }).click()
    await expect(page).toHaveURL(/left=\d+/, { timeout: 30000 })
    await expect(page).toHaveURL(/right=\d+/)
    await expect(page.getByRole('table')).toBeVisible({ timeout: 30000 })
  })
})

test.describe('RC5 collections pages', () => {
  test('team bench manages members with persistence', async ({ page }) => {
    // Seed via evaluate (not addInitScript, which would re-seed every reload).
    await page.goto('/team')
    await expect(page.getByRole('heading', { name: /team bench/i })).toBeVisible()
    await page.evaluate(() => {
      localStorage.setItem('pokedex2027:team', JSON.stringify({ version: 1, data: [25, 6, 9] }))
    })
    await page.reload()
    await expect(page.getByText(/squad · 3 of 6/i)).toBeVisible({ timeout: 30000 })
    await expect(page.getByText(/type composition/i)).toBeVisible({ timeout: 30000 })

    // Reorder: move Pikachu later.
    await page.getByRole('button', { name: /move pikachu later/i }).click()
    const firstSlot = page.locator('.team-slot').first()
    await expect(firstSlot).toContainText(/charizard/i)

    // Release and persist.
    await page.getByRole('button', { name: /release charizard from team/i }).click()
    await expect(page.getByText(/squad · 2 of 6/i)).toBeVisible()
    await page.reload()
    await expect(page.getByText(/squad · 2 of 6/i)).toBeVisible({ timeout: 30000 })
  })

  test('favorites shelf lists toggled specimens', async ({ page }) => {
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
    await page.getByRole('button', { name: /add pikachu to favorites/i }).click()

    await page.goto('/favorites')
    await expect(page.getByRole('heading', { name: /favorites/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
  })
})
