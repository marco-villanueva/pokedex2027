import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * §7 P1-5 container queries (live API): the card answers to its cell, not
 * to the viewport — a lone shelved favorite goes horizontal on desktop and
 * stays vertical on handheld; evo nodes follow their tier's width even
 * below the old viewport breakpoint.
 */
test.describe('container queries', () => {
  async function seedFavorites(page: Page) {
    await page.addInitScript(() => {
      localStorage.setItem('pokedex2027:favorites', JSON.stringify({ version: 1, data: [6] }))
    })
  }

  test('lone favorite lays out horizontally in a wide desktop cell', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await seedFavorites(page)
    await page.goto('/favorites')
    const link = page.locator('.explorer-grid .pokemon-card-link').first()
    await expect(link).toBeVisible({ timeout: 30000 })
    await expect
      .poll(() => link.evaluate((element) => getComputedStyle(element).display), {
        timeout: 15000,
      })
      .toBe('grid')
    const columns = await link.evaluate((element) => getComputedStyle(element).gridTemplateColumns)
    expect(columns.split(' ').length).toBe(2)
  })

  test('same shelf stays vertical in a narrow handheld cell', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await seedFavorites(page)
    await page.goto('/favorites')
    const link = page.locator('.explorer-grid .pokemon-card-link').first()
    await expect(link).toBeVisible({ timeout: 30000 })
    const display = await link.evaluate((element) => getComputedStyle(element).display)
    expect(display).toBe('block')
  })

  test('narrow strips keep the stacked V1 layout', async ({ page }) => {
    // 800px: the tiers strip still stacks with single-column nodes — the
    // V1 viewport behavior is preserved where the strip is narrow.
    await page.setViewportSize({ width: 800, height: 900 })
    await page.goto('/evolution/67')
    const tiers = page.locator('.evo-tier')
    await expect(tiers.first()).toBeVisible({ timeout: 30000 })
    const columns = await tiers
      .nth(1)
      .locator('.evo-nodes')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns)
    expect(columns.split(' ').length).toBe(1)
  })

  test('lone evo node becomes a horizontal showcase in a wide strip', async ({ page }) => {
    // Linear chain: every tier holds one node; at desktop width the strip
    // is wide, so each lone node spans the row with a horizontal layout.
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/evolution/1')
    const tiers = page.locator('.evo-tier')
    await expect(tiers.first()).toBeVisible({ timeout: 30000 })
    const loneLink = tiers.first().locator('.evo-nodes > li:only-child .evo-card-link')
    await expect(loneLink).toBeVisible({ timeout: 30000 })
    const columns = await loneLink.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns,
    )
    expect(columns.split(' ').length).toBe(2)
  })

  test('same lone node stays vertical in a narrow strip', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 })
    await page.goto('/evolution/1')
    const tiers = page.locator('.evo-tier')
    await expect(tiers.first()).toBeVisible({ timeout: 30000 })
    const loneLink = tiers.first().locator('.evo-nodes > li:only-child .evo-card-link')
    await expect(loneLink).toBeVisible({ timeout: 30000 })
    const columns = await loneLink.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns,
    )
    expect(columns.split(' ').length).toBe(1)
  })

  test('reduced motion keeps the adaptive layouts intact', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await seedFavorites(page)
    await page.goto('/favorites')
    const link = page.locator('.explorer-grid .pokemon-card-link').first()
    await expect(link).toBeVisible({ timeout: 30000 })
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
      timeout: 15000,
    })
  })
})
