import { expect, test } from '@playwright/test'

/**
 * RC2 explorer flows (live API): global search, type/generation filters,
 * sort — all in shareable URLs — plus detail round-trip state preservation.
 */
test.describe('RC2 explorer', () => {
  test('search filters globally and syncs URL', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })

    await page.getByLabel(/search by name or number/i).fill('pikachu')
    await expect(page).toHaveURL(/q=pikachu/)
    await expect(page.locator('.explorer-grid > li')).toHaveCount(1, { timeout: 15000 })
    await expect(page.getByRole('link', { name: /pikachu/i })).toBeVisible()
  })

  test('type filter narrows to roster and syncs URL', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })

    await page.getByRole('button', { name: /^fire$/i }).click()
    await expect(page).toHaveURL(/type=fire/)
    // Roster fetch + fresh detail batch; headroom for live-API backoff.
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 45000 })
    const status = await page.getByRole('status').first().textContent()
    expect(status).toMatch(/specimens materialised/)

    // Toggling the chip off removes the param.
    await page.getByRole('button', { name: /^fire$/i }).click()
    await expect(page).not.toHaveURL(/type=fire/)
  })

  test('generation and sort reconstruct from URL across reload', async ({ page }) => {
    await page.goto('/pokedex?generation=1&sort=name-desc')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const firstHref = await page
      .locator('.explorer-grid .pokemon-card-link')
      .first()
      .getAttribute('href')

    await page.reload()
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    await expect(page.locator('.explorer-grid .pokemon-card-link').first()).toHaveAttribute(
      'href',
      firstHref ?? '',
    )
    await expect(page).toHaveURL(/generation=1/)
    await expect(page).toHaveURL(/sort=name-desc/)
  })

  test('empty results offer recovery', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })

    await page.getByLabel(/search by name or number/i).fill('zzz-no-such-mon')
    await expect(page.getByText(/no specimens on this frequency/i)).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: /clear all filters/i }).click()
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
  })

  test('detail round-trip preserves explorer state', async ({ page }) => {
    await page.goto('/pokedex?type=water')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })

    await page.locator('.explorer-grid .pokemon-card-link').first().click()
    await expect(page).toHaveURL(/\/pokemon\/\d+/, { timeout: 30000 })

    await page.goBack()
    await expect(page).toHaveURL(/type=water/)
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
  })

  test('infinite window grows on scroll', async ({ page }) => {
    // Growth proof needs only the next window to start materialising, not
    // all 96 cards: cheaper under full-suite API contention. Raises the
    // budgets instead of the assertion count.
    test.setTimeout(150_000)
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    await expect(page.locator('.explorer-grid > li')).toHaveCount(48, { timeout: 30000 })

    await page.getByRole('button', { name: /show more/i }).click()
    // The sentinel may auto-grow further while loading, so assert growth
    // (>=) rather than an exact count.
    await expect
      .poll(async () => page.locator('.explorer-grid > li').count(), { timeout: 90000 })
      .toBeGreaterThan(48)
  })
})
