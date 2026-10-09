import { expect, test } from '@playwright/test'

/**
 * Gate 2 (runtime): no console errors, no uncaught page errors and no
 * failed API requests on the two RC0 routes.
 */
test.describe('runtime audit', () => {
  for (const route of ['/pokedex', '/pokemon/25']) {
    test(`clean console and network on ${route}`, async ({ page }) => {
      const consoleErrors: string[] = []
      const pageErrors: string[] = []
      const failedRequests: string[] = []

      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })
      page.on('pageerror', (error) => pageErrors.push(error.message))
      page.on('requestfailed', (request) => {
        // Aborted/cancelled requests are intentional: React StrictMode
        // remounts and TanStack Query cancels stale queries via AbortSignal.
        const reason = request.failure()?.errorText ?? ''
        if (/abort|cancel/i.test(reason)) return
        failedRequests.push(`${request.url()} :: ${reason}`)
      })
      page.on('response', (response) => {
        if (response.status() >= 500) failedRequests.push(`${response.status()} ${response.url()}`)
      })

      await page.goto(route)
      await expect(page.getByRole('main')).toBeVisible()
      // Let queries settle.
      await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {})

      expect(consoleErrors, `console errors on ${route}`).toEqual([])
      expect(pageErrors, `page errors on ${route}`).toEqual([])
      expect(failedRequests, `failed requests on ${route}`).toEqual([])
    })
  }
})
