import { expect, test } from '@playwright/test'

/**
 * §7 P0-1 View Transitions morph (live API): card → dossier navigation
 * travels through the shared `view-transition-name` pair; without the API
 * or under reduced motion the same click is a plain navigation.
 */
test.describe('view-transitions morph', () => {
  test('card artwork carries the shared transition name and opens its dossier', async ({
    page,
  }) => {
    await page.goto('/pokedex')
    const firstCard = page.locator('.pokemon-card-link').first()
    await expect(firstCard).toBeVisible({ timeout: 30000 })

    const cardArt = page.locator('.pokemon-card-art').first()
    await expect(cardArt).toBeVisible({ timeout: 30000 })
    const cardTransitionName = await cardArt.evaluate(
      (element) => getComputedStyle(element).viewTransitionName,
    )
    expect(cardTransitionName).toMatch(/^pokemon-art-\d+$/)

    await firstCard.click()
    await expect(page).toHaveURL(/\/pokemon\/\d+/, { timeout: 30000 })
    const dossierArt = page.locator('.scanner-art')
    await expect(dossierArt).toBeVisible({ timeout: 30000 })
    const dossierTransitionName = await dossierArt.evaluate(
      (element) => getComputedStyle(element).viewTransitionName,
    )
    expect(dossierTransitionName).toMatch(/^pokemon-art-\d+$/)
    // Same specimen on both ends → the morph pair matches.
    expect(dossierTransitionName).toBe(cardTransitionName)
  })

  test('navigation stays intact with reduced motion (effect skipped)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/pokedex')
    const firstCard = page.locator('.pokemon-card-link').first()
    await expect(firstCard).toBeVisible({ timeout: 30000 })
    await firstCard.click()
    await expect(page).toHaveURL(/\/pokemon\/\d+/, { timeout: 30000 })
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 })
  })
})
