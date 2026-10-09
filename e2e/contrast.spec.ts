import { expect, test } from '@playwright/test'

/**
 * Gate 5 (contrast): solid text/background pairs meet WCAG AA (≥ 4.5:1).
 * Gradient-coated surfaces are excluded — their text sits on the base
 * surface token, which is what this spec samples.
 */

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

function ratio(a: [number, number, number], b: [number, number, number]): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function parseRgb(value: string): [number, number, number] {
  const rgb = value.match(/rgba?\(([^)]+)\)/)
  if (rgb) {
    const parts = rgb[1]!.split(',').map((p) => Number.parseFloat(p))
    return [parts[0]!, parts[1]!, parts[2]!]
  }
  const oklch = value.match(/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/)
  if (oklch) {
    return oklchToRgb(Number(oklch[1]), Number(oklch[2]), Number(oklch[3]))
  }
  throw new Error(`Unparseable color: ${value}`)
}

/** OKLCH (0..1, chroma, degrees) → sRGB 0..255. */
function oklchToRgb(l: number, c: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  const lms = [
    l + 0.3963377774 * a + 0.2158037573 * b,
    l - 0.1055613458 * a - 0.0638541728 * b,
    l - 0.0894841775 * a - 1.291485548 * b,
  ].map((v) => v ** 3)
  const [lm, mm, sm] = lms as [number, number, number]
  const linear: [number, number, number] = [
    4.0767416621 * lm - 3.3077115913 * mm + 0.2309699292 * sm,
    -1.2684380046 * lm + 2.6097574011 * mm - 0.3413193965 * sm,
    -0.0041960863 * lm - 0.7034186147 * mm + 1.707614701 * sm,
  ]
  return linear.map((v) => {
    const clamped = Math.max(0, Math.min(1, v))
    const srgb = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055
    return Math.round(srgb * 255)
  }) as [number, number, number]
}

test.describe('text contrast', () => {
  test('core pairs meet AA on explorer and lab', async ({ page }) => {
    await page.goto('/pokedex')
    await expect(page.locator('.explorer-grid > li').first()).toBeVisible({ timeout: 30000 })

    const pairs: Array<{ name: string; route: string; fg: string; bg: string }> = [
      { name: 'body/subtitle', route: '/pokedex', fg: '.explorer-subtitle', bg: 'body' },
      { name: 'card name', route: '/pokedex', fg: '.pokemon-card-name', bg: '.pokemon-card-body' },
      { name: 'nav link', route: '/pokedex', fg: '.app-nav a', bg: '.app-header' },
    ]

    for (const pair of pairs) {
      await page.goto(pair.route)
      const colors = await page
        .locator(pair.fg)
        .first()
        .evaluate((el, bgSelector) => {
          const fg = getComputedStyle(el).color
          const container = el.closest(bgSelector) ?? document.body
          return { fg, bg: getComputedStyle(container).backgroundColor }
        }, pair.bg)
      const value = ratio(parseRgb(colors.fg), parseRgb(colors.bg))
      expect(
        value,
        `${pair.name}: ${colors.fg} on ${colors.bg} = ${value.toFixed(2)}`,
      ).toBeGreaterThanOrEqual(4.5)
    }

    await page.goto('/lab')
    await expect(page.getByText(/signature specimen/i)).toBeVisible({ timeout: 30000 })
    const labColors = await page.getByText(/signature specimen/i).evaluate((el) => ({
      fg: getComputedStyle(el).color,
      bg: getComputedStyle(document.body).backgroundColor,
    }))
    const labValue = ratio(parseRgb(labColors.fg), parseRgb(labColors.bg))
    expect(labValue, `lab note = ${labValue.toFixed(2)}`).toBeGreaterThanOrEqual(4.5)
  })
})
