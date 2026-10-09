import { expect, test } from '@playwright/test'

/**
 * RC3 dossier flows (live API): shiny variant syncs to URL, swaps artwork,
 * and degrades gracefully when no shiny source is archived.
 */
test.describe('RC3 dossier shiny', () => {
  test('shiny toggle swaps artwork and persists in URL', async ({ page }) => {
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })

    const art = page.locator('.scanner-art')
    await expect(art).toBeVisible({ timeout: 30000 })
    const standardSrc = await art.getAttribute('src')
    expect(standardSrc).toBeTruthy()

    await page.getByRole('button', { name: /^shiny$/i }).click()
    await expect(page).toHaveURL(/shiny=1/)
    await expect
      .poll(async () => page.locator('.scanner-art').getAttribute('src'), { timeout: 15000 })
      .not.toBe(standardSrc)

    await page.reload()
    await expect(page).toHaveURL(/shiny=1/)
    await expect(page.getByRole('button', { name: /^shiny$/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  test('standard toggle clears the variant param', async ({ page }) => {
    await page.goto('/pokemon/25?shiny=1')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })

    await page.getByRole('button', { name: /^standard$/i }).click()
    await expect(page).not.toHaveURL(/shiny=1/)
  })

  test('sprite archive lists labelled sprites', async ({ page }) => {
    await page.goto('/pokemon/25')
    await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
    const gallery = page.getByRole('heading', { name: /sprite archive/i })
    await gallery.scrollIntoViewIfNeeded()
    await expect(page.getByAltText(/front sprite/i).first()).toBeVisible({ timeout: 15000 })
  })

  test('evolution preview navigates the chain', async ({ page }) => {
    await page.goto('/pokemon/133')
    await expect(page.getByRole('heading', { name: /eevee/i })).toBeVisible({ timeout: 30000 })
    const preview = page.getByRole('heading', { name: /evolution chain/i })
    await preview.scrollIntoViewIfNeeded()
    await expect(page.getByRole('link', { name: /vaporeon/i })).toBeVisible({ timeout: 30000 })

    await page.getByRole('link', { name: /vaporeon/i }).click()
    await expect(page).toHaveURL(/\/pokemon\/134/, { timeout: 30000 })
    await expect(page.getByRole('heading', { name: /vaporeon/i })).toBeVisible({ timeout: 30000 })
  })

  test('matchups expose text multipliers', async ({ page }) => {
    await page.goto('/pokemon/6')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({ timeout: 30000 })
    const matchups = page.getByRole('heading', { name: /^matchups$/i })
    await matchups.scrollIntoViewIfNeeded()
    // Scoped to the groups: the "How to read" popover legend holds the same
    // tokens while closed (§7 P0-3).
    const groups = page.locator('.matchup-group')
    await expect(groups.getByText('4×').first()).toBeVisible({ timeout: 30000 })
    await expect(groups.getByText('0×').first()).toBeVisible({ timeout: 30000 })
  })

  test('ability rows expand with archived effects', async ({ page }) => {
    await page.goto('/pokemon/6')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({ timeout: 30000 })
    await page.getByRole('button', { name: /blaze/i }).click()
    await expect(page.getByText(/strengthens fire moves/i)).toBeVisible({
      timeout: 30000,
    })
  })

  test('related specimens and generation link navigate outward', async ({ page }) => {
    await page.goto('/pokemon/6')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({ timeout: 30000 })
    await page.getByRole('heading', { name: /related fire specimens/i }).scrollIntoViewIfNeeded()
    await expect(page.locator('.related-grid > li').first()).toBeVisible({ timeout: 30000 })

    await page.getByRole('link', { name: /browse all/i }).click()
    await expect(page).toHaveURL(/\/pokedex\?type=fire/, { timeout: 30000 })

    await page.goto('/pokemon/6')
    await expect(page.getByRole('heading', { name: /charizard/i })).toBeVisible({ timeout: 30000 })
    const generation = page.locator('.px-data-link', { hasText: /generation i/i })
    await generation.click()
    await expect(page).toHaveURL(/\/pokedex\?generation=1/, { timeout: 30000 })
  })

  test('legendary status is surfaced as text', async ({ page }) => {
    await page.goto('/pokemon/150')
    await expect(page.getByRole('heading', { name: /mewtwo/i })).toBeVisible({ timeout: 30000 })
    await expect(page.getByText(/legendary/i).first()).toBeVisible({ timeout: 15000 })
  })

  test('stepper disables next at the canonical end', async ({ page }) => {
    await page.goto('/pokemon/1025')
    await expect(page.getByRole('heading', { name: /pecharunt/i })).toBeVisible({
      timeout: 30000,
    })
    await expect(page.getByRole('link', { name: /next pokémon/i })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /previous pokémon/i })).toBeVisible()
  })
})
