import { expect, test } from '@playwright/test'

/**
 * RC4 evolution explorer (live API): branching tree, conditions, node
 * navigation, invalid-chain handling.
 */
test.describe('RC4 evolution explorer', () => {
  test('branching chain renders tiers with conditions', async ({ page }) => {
    await page.goto('/evolution/67')
    await expect(page.getByRole('heading', { name: /eevee lineage/i })).toBeVisible({
      timeout: 30000,
    })
    await expect(page.getByText(/9 specimens across 2 stages/i)).toBeVisible({ timeout: 30000 })

    // Branch conditions are explicit, not color-only.
    await expect(page.getByText('Water Stone').first()).toBeVisible()
    await expect(page.getByText('Thunder Stone').first()).toBeVisible()

    // Every evolution is a dossier link.
    await page.getByRole('link', { name: /sylveon/i }).click()
    await expect(page).toHaveURL(/\/pokemon\/700/, { timeout: 30000 })
    await expect(page.getByRole('heading', { name: /sylveon/i })).toBeVisible({ timeout: 30000 })
  })

  test('linear chain renders a single-file lineage', async ({ page }) => {
    await page.goto('/evolution/1')
    await expect(page.getByRole('heading', { name: /bulbasaur lineage/i })).toBeVisible({
      timeout: 30000,
    })
    await expect(page.getByText(/3 specimens across 3 stages/i)).toBeVisible({ timeout: 30000 })
    await expect(page.getByText('Level 16').first()).toBeVisible()
  })

  test('dossier links into the full tree and back', async ({ page }) => {
    await page.goto('/pokemon/133')
    await expect(page.getByRole('heading', { name: /eevee/i })).toBeVisible({ timeout: 30000 })
    await page.getByRole('link', { name: /open full tree/i }).click()
    await expect(page).toHaveURL(/\/evolution\/67/, { timeout: 30000 })
    await expect(page.getByRole('heading', { name: /eevee lineage/i })).toBeVisible({
      timeout: 30000,
    })
  })

  test('unknown chain is recoverable', async ({ page }) => {
    await page.goto('/evolution/999999')
    await expect(page.getByText(/lineage unavailable/i)).toBeVisible({ timeout: 30000 })
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible()
  })
})

/**
 * §6.1 specimen alias (live API): `/evolution/pokemon/:idOrName` resolves
 * a Pokédex id or name to its canonical chain URL.
 */
test.describe('evolution specimen alias', () => {
  test('pokemon id resolves to its chain (133 is Eevee, not chain 133)', async ({ page }) => {
    await page.goto('/evolution/pokemon/133')
    await expect(page).toHaveURL(/\/evolution\/67/, { timeout: 30000 })
    await expect(page.getByRole('heading', { name: /eevee lineage/i })).toBeVisible({
      timeout: 30000,
    })
  })

  test('pokemon name resolves to its chain', async ({ page }) => {
    await page.goto('/evolution/pokemon/pikachu')
    await expect(page).toHaveURL(/\/evolution\/10/, { timeout: 30000 })
    await expect(page.getByRole('heading', { name: /lineage/i })).toBeVisible({ timeout: 30000 })
  })

  test('single-stage chain resolves without branches', async ({ page }) => {
    await page.goto('/evolution/pokemon/ditto')
    await expect(page).toHaveURL(/\/evolution\/66/, { timeout: 30000 })
    await expect(page.getByText(/1 specimen across 1 stage/i)).toBeVisible({ timeout: 30000 })
  })

  test('unknown specimen is recoverable', async ({ page }) => {
    await page.goto('/evolution/pokemon/noexiste-xyz-999')
    await expect(page.getByText(/no specimen/i)).toBeVisible({ timeout: 30000 })
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /return to explorer/i })).toBeVisible()
  })
})
