import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * §7 P1-7 command palette (live API): Ctrl+K jumps to any Pokémon or
 * section from the keyboard, with own ranking over the existing index.
 */
test.describe('command palette', () => {
  async function openPalette(page: Page) {
    await page.keyboard.press('Control+k')
    const input = page.getByRole('combobox', { name: /by name or number/i })
    await expect(input).toBeVisible({ timeout: 15000 })
    return input
  }

  test('exact name jumps straight to the dossier', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const input = await openPalette(page)
    await input.fill('charizard')
    const option = page.getByRole('option', { name: /charizard/i }).first()
    await expect(option).toBeVisible({ timeout: 30000 })
    await option.click()
    await expect(page).toHaveURL(/\/pokemon\/6/, { timeout: 30000 })
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({
      timeout: 30000,
    })
  })

  test('arrows move and Enter opens (keyboard only)', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const input = await openPalette(page)
    await input.fill('char')
    await expect(page.getByRole('option', { name: /charmander/i })).toBeVisible({
      timeout: 30000,
    })
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/pokemon\/5/, { timeout: 30000 })
    await expect(page.getByRole('heading', { name: /charmeleon/i })).toBeVisible({
      timeout: 30000,
    })
  })

  test('human spellings resolve (mr mime)', async ({ page }) => {
    await page.goto('/team')
    await expect(page.getByRole('heading', { name: /team/i }).first()).toBeVisible({
      timeout: 30000,
    })
    const input = await openPalette(page)
    await input.fill('mr mime')
    await expect(page.getByRole('option', { name: /mr mime/i })).toBeVisible({
      timeout: 30000,
    })
  })

  test('empty query offers section actions', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    await openPalette(page)
    await page.getByRole('option', { name: /open compare/i }).click()
    await expect(page).toHaveURL(/\/compare/, { timeout: 30000 })
  })

  test('Escape closes and focus returns to the trigger', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const input = await openPalette(page)
    await input.fill('pika')
    await expect(page.getByRole('option', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
    await page.keyboard.press('Escape')
    await expect(input).toBeHidden({ timeout: 15000 })
    await expect(page.getByRole('button', { name: /quick jump/i })).toBeFocused()
  })

  test('panel stays on-screen without anchor support', async ({ page }) => {
    await page.addInitScript(() => {
      const original = CSS.supports.bind(CSS)
      CSS.supports = ((property: string, value?: string) => {
        if (property === 'position-area') return false
        return original(property, value)
      }) as typeof CSS.supports
    })
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const input = await openPalette(page)
    await input.fill('charizard')
    await expect(page.getByRole('option', { name: /charizard/i }).first()).toBeVisible({
      timeout: 30000,
    })
    const box = await page.locator('.px-palette').boundingBox()
    expect(box).not.toBeNull()
    const viewport = page.viewportSize() ?? { width: 1280, height: 720 }
    expect(box?.x).toBeGreaterThanOrEqual(0)
    expect(box ? box.x + box.width : viewport.width + 1).toBeLessThanOrEqual(viewport.width + 1)
  })

  test('mobile trigger opens the palette', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    await page.getByRole('button', { name: /quick jump/i }).click()
    const input = page.getByRole('combobox', { name: /by name or number/i })
    await expect(input).toBeVisible({ timeout: 15000 })
    await input.fill('eevee')
    await expect(page.getByRole('option', { name: /eevee/i }).first()).toBeVisible({
      timeout: 30000,
    })
  })

  test('reduced motion keeps the jump intact', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    const input = await openPalette(page)
    await input.fill('bulbasaur')
    await expect(page.getByRole('option', { name: /bulbasaur/i }).first()).toBeVisible({
      timeout: 30000,
    })
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/pokemon\/1/, { timeout: 30000 })
  })
})
