import { expect, test } from '@playwright/test'

/**
 * §7 P0-3 native popover (live API): ability details, the matchups legend
 * and the explorer aid open as top-layer popovers with Esc support, stay
 * operable by keyboard, and fall back to a disclosure without the API.
 */
test.describe('native popover details', () => {
  test('ability row opens its archived effect and closes with Escape', async ({ page }) => {
    await page.goto('/pokemon/6')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
      timeout: 30000,
    })
    const panel = page.locator('.ability-detail-popover').first()
    await expect(panel).toBeHidden()
    await page.getByRole('button', { name: /blaze/i }).click()
    await expect(page.getByText(/strengthens fire moves/i)).toBeVisible({ timeout: 30000 })
    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()
  })

  test('matchups legend explains the multipliers', async ({ page }) => {
    await page.goto('/pokemon/6')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
      timeout: 30000,
    })
    const legend = page.getByText('Defensive take')
    await expect(legend).toBeHidden()
    await page.getByRole('button', { name: /how to read/i }).click()
    await expect(legend).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/dual types combine/i)).toBeVisible()
  })

  test('explorer aid is keyboard-operable', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const aid = page.getByText('Match by name or')
    await expect(aid).toBeHidden()
    await page.getByRole('button', { name: /search help/i }).focus()
    await page.keyboard.press('Enter')
    await expect(aid).toBeVisible({ timeout: 15000 })
  })

  test('fallback disclosure carries the same aid without the Popover API', async ({ page }) => {
    await page.addInitScript(() => {
      const proto = HTMLElement.prototype as unknown as Record<string, unknown>
      delete proto['showPopover']
      delete proto['hidePopover']
      delete proto['togglePopover']
    })
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const summary = page.locator('.px-popover-fallback > summary')
    await expect(summary).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Match by name or')).toBeHidden()
    await summary.click()
    await expect(page.getByText('Match by name or')).toBeVisible({ timeout: 15000 })
  })

  test('reduced motion keeps popover content intact', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/pokemon/6')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
      timeout: 30000,
    })
    await page.getByRole('button', { name: /blaze/i }).click()
    await expect(page.getByText(/strengthens fire moves/i)).toBeVisible({ timeout: 30000 })
  })
})
