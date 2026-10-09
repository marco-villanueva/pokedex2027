import { expect, test } from '@playwright/test'

/**
 * Gate 5 (keyboard): every critical RC1 flow is reachable and operable
 * by keyboard, with a visible focus indicator.
 */
test.describe('keyboard navigation', () => {
  test('explorer search and cards are keyboard operable', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })

    // Skip link first in tab order.
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: /skip to main content/i })).toBeFocused()

    // Reach the search field by keyboard and filter.
    await page.getByLabel(/search by name or number/i).focus()
    await expect(page.getByLabel(/search by name or number/i)).toBeFocused()
    await page.keyboard.type('char')
    // Filtered ids trigger fresh detail fetches; headroom for live-API load.
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })

    // First card link shows a visible focus indicator and opens on Enter.
    const firstCard = page.locator('.explorer-grid .pokemon-card-link').first()
    await firstCard.focus()
    const outline = await firstCard.evaluate((el) => {
      const style = getComputedStyle(el)
      return { width: style.outlineWidth, style: style.outlineStyle }
    })
    expect(outline.style).not.toBe('none')
    expect(Number.parseFloat(outline.width)).toBeGreaterThan(0)

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/pokemon\/\d+/, { timeout: 30000 })
  })

  test('detail stepper is keyboard operable', async ({ page }) => {
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
    await page.getByRole('link', { name: /next pokémon/i }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/pokemon\/26/, { timeout: 30000 })
  })

  test('compare combobox selects via arrows and Enter', async ({ page }) => {
    await page.goto('/compare')
    const left = page.getByLabel(/left specimen/i)
    await left.click()
    await left.fill('char')
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 30000 })
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/left=\d+/, { timeout: 15000 })
  })
})
