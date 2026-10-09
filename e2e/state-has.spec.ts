import { expect, test } from '@playwright/test'

/**
 * §7 P1-6 `:has()` parent states (live API): the scanner chamber reacts to
 * the shiny toggle, filter groups mark their legends and the search marks
 * itself — all from native child semantics, with zero parent-touching JS.
 */
test.describe('has() parent states', () => {
  test('chamber reacts to the shiny variant', async ({ page }) => {
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({
      timeout: 30000,
    })
    const chamber = page.locator('.scanner-chamber')
    const standardBorder = await chamber.evaluate(
      (element) => getComputedStyle(element).borderColor,
    )
    const standardFilter = await page
      .locator('.scanner-art')
      .evaluate((element) => getComputedStyle(element).filter)

    await page.getByRole('button', { name: /^shiny$/i }).click()
    await expect(page).toHaveURL(/shiny=1/)
    await expect
      .poll(() => chamber.evaluate((element) => getComputedStyle(element).borderColor), {
        timeout: 15000,
      })
      .not.toBe(standardBorder)
    const shinyFilter = await page
      .locator('.scanner-art')
      .evaluate((element) => getComputedStyle(element).filter)
    expect(shinyFilter).not.toBe(standardFilter)

    await page.getByRole('button', { name: /^standard$/i }).click()
    await expect
      .poll(() => chamber.evaluate((element) => getComputedStyle(element).borderColor), {
        timeout: 15000,
      })
      .toBe(standardBorder)
  })

  test('filter group legend marks an active filter', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const legend = page.locator('.explorer-filter-group', { hasText: 'Type' }).locator('legend')
    const idleColor = await legend.evaluate((element) => getComputedStyle(element).color)

    await page.getByRole('button', { name: /^fire$/i }).click()
    await expect(page).toHaveURL(/type=fire/)
    await expect
      .poll(() => legend.evaluate((element) => getComputedStyle(element).color), {
        timeout: 15000,
      })
      .not.toBe(idleColor)

    await page.getByRole('button', { name: /^all$/i }).first().click()
    await expect
      .poll(() => legend.evaluate((element) => getComputedStyle(element).color), {
        timeout: 15000,
      })
      .toBe(idleColor)
  })

  test('search marks itself while filtering', async ({ page }) => {
    await page.goto('/pokedex')
    const input = page.getByLabel(/search by name or number/i)
    await expect(input).toBeVisible({ timeout: 30000 })
    const label = page.locator('.explorer-search .px-search-label')
    const idleColor = await label.evaluate((element) => getComputedStyle(element).color)

    await input.fill('pikachu')
    await expect
      .poll(() => label.evaluate((element) => getComputedStyle(element).color), {
        timeout: 15000,
      })
      .not.toBe(idleColor)

    await input.clear()
    await expect
      .poll(() => label.evaluate((element) => getComputedStyle(element).color), {
        timeout: 15000,
      })
      .toBe(idleColor)
  })

  test('reduced motion keeps state reactions intact', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({
      timeout: 30000,
    })
    await page.getByRole('button', { name: /^shiny$/i }).click()
    await expect(page).toHaveURL(/shiny=1/)
    await expect(page.locator('.scanner-art')).toBeVisible({ timeout: 30000 })
  })
})
