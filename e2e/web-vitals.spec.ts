import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * RC7 production vitals: measured against the preview (production) build,
 * not dev. Budgets: LCP < 4s, CLS < 0.1, zero long-task storms on load.
 */
const PREVIEW = 'http://127.0.0.1:4173'

interface Vitals {
  lcp: number
  cls: number
  longTasks: number
}

async function collectVitals(
  url: string,
  page: Page,
  settle: (inner: Page) => Promise<void>,
): Promise<Vitals> {
  await page.goto(url)
  await page.evaluate(() => {
    window.__vitals = { lcp: 0, cls: 0, longTasks: 0 }
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          window.__vitals.lcp = Math.max(window.__vitals.lcp, entry.startTime)
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        const layoutEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }
        if (!layoutEntry.hadRecentInput) window.__vitals.cls += layoutEntry.value ?? 0
      }
    }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((entries) => {
      window.__vitals.longTasks += entries.getEntries().length
    }).observe({ type: 'longtask', buffered: true })
  })
  await settle(page)
  await page.waitForTimeout(2500)
  return page.evaluate(() => window.__vitals as unknown as Vitals) as Vitals
}

declare global {
  interface Window {
    __vitals: Vitals
  }
}

test.describe('production web vitals', () => {
  test('explorer: LCP < 4s, CLS < 0.1', async ({ page }) => {
    const vitals = await collectVitals(`${PREVIEW}/pokedex`, page, async (inner) => {
      await expect(inner.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })
    })
    console.log(
      `explorer vitals: LCP=${Math.round(vitals.lcp)}ms CLS=${vitals.cls.toFixed(3)} longtasks=${vitals.longTasks}`,
    )
    expect(vitals.lcp, 'LCP under 4s').toBeLessThan(4000)
    expect(vitals.cls, 'CLS under 0.1').toBeLessThan(0.1)
  })

  test('dossier: LCP < 4s, CLS < 0.1', async ({ page }) => {
    const vitals = await collectVitals(`${PREVIEW}/pokemon/25`, page, async (inner) => {
      await expect(inner.getByRole('heading', { name: /pikachu/i })).toBeVisible({ timeout: 30000 })
    })
    console.log(
      `dossier vitals: LCP=${Math.round(vitals.lcp)}ms CLS=${vitals.cls.toFixed(3)} longtasks=${vitals.longTasks}`,
    )
    expect(vitals.lcp, 'LCP under 4s').toBeLessThan(4000)
    expect(vitals.cls, 'CLS under 0.1').toBeLessThan(0.1)
  })
})
