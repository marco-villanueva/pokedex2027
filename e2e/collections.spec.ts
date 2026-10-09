import { expect, test } from '@playwright/test'

/**
 * RC5 persistence (live API + localStorage): favorites toggle and team
 * admission survive reloads; invalid states are prevented; malformed
 * storage never crashes the dossier.
 */
test.describe('RC5 collections persistence', () => {
  test('favorite toggle persists across reload', async ({ page }) => {
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })

    await page.getByRole('button', { name: /add pikachu to favorites/i }).click()
    await expect(page.getByRole('button', { name: /remove pikachu from favorites/i })).toBeVisible()

    await page.reload()
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
    await expect(page.getByRole('button', { name: /remove pikachu from favorites/i })).toBeVisible()
  })

  test('team admission persists and caps at six', async ({ page }) => {
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })

    await page.getByRole('button', { name: /add pikachu to your team/i }).click()
    await expect(page.getByText(/pikachu is on your team/i)).toBeVisible()

    await page.reload()
    await expect(page.getByText(/pikachu is on your team/i)).toBeVisible({ timeout: 30000 })

    // A full team blocks admission with guidance.
    await page.evaluate(() => {
      localStorage.setItem(
        'pokedex2027:team',
        JSON.stringify({ version: 1, data: [1, 4, 7, 25, 133, 150] }),
      )
    })
    await page.goto('/pokemon/151')
    await expect(page.getByRole('heading', { name: /mew/i })).toBeVisible({ timeout: 30000 })
    const addButton = page.getByRole('button', { name: /team is full/i })
    await expect(addButton).toBeDisabled()
  })

  test('malformed storage never breaks the dossier', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('pokedex2027:favorites', '💥not-json')
      localStorage.setItem('pokedex2027:team', JSON.stringify({ version: 99, data: ['x'] }))
    })
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
    await expect(page.getByRole('button', { name: /add pikachu to favorites/i })).toBeVisible()
  })

  test('favorite state follows across open tabs', async ({ context }) => {
    const first = await context.newPage()
    const second = await context.newPage()
    await first.goto('/pokemon/25')
    await expect(first.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
    await second.goto('/pokemon/25')
    await expect(second.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })

    await expect(second.getByRole('button', { name: /add pikachu to favorites/i })).toBeVisible()
    await first.getByRole('button', { name: /add pikachu to favorites/i }).click()
    // No reload: the storage event drives the second tab's state.
    await expect(
      second.getByRole('button', { name: /remove pikachu from favorites/i }),
    ).toBeVisible({ timeout: 10000 })
  })
})
